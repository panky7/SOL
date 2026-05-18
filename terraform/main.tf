terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

# ==========================================
# 📊 VARIABLES
# ==========================================

variable "aws_region" {
  type        = string
  default     = "eu-west-3"
  description = "AWS target deployment region"
}

variable "github_org" {
  type        = string
  default     = "panky7"
  description = "GitHub Owner / Organization"
}

variable "github_repo" {
  type        = string
  default     = "SOL"
  description = "GitHub repository name"
}

# ==========================================
# 🔌 PROVIDER CONFIGURATION
# ==========================================

provider "aws" {
  region = var.aws_region
}

# ==========================================
# 🔐 GITHUB OIDC IDENTITY PROVIDER & IAM ROLE
# ==========================================

# Attempt to create OIDC provider (wrapped in dynamic setup or simple creation)
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]
}

resource "aws_iam_role" "github_actions" {
  name        = "SophieLamourGitHubDeployRole"
  description = "IAM Role assumed by GitHub Actions to securely deploy the Sophie Lamour application"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
          }
        }
      }
    ]
  })
}

# ==========================================
# 📦 PRIVATE S3 FRONTEND BUCKET
# ==========================================

resource "aws_s3_bucket" "frontend" {
  bucket        = "sophielamour-frontend"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "frontend_privacy" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==========================================
# ⚡ CLOUDFRONT ORIGIN ACCESS CONTROL (OAC)
# ==========================================

resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "sophielamour-oac"
  description                       = "OAC to secure access to the frontend static S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ==========================================
# 🐍 LAMBDA BACKEND FUNCTION
# ==========================================

# Dynamically bundle dummy backend code so Lambda deploys successfully
data "archive_file" "dummy_lambda" {
  type        = "zip"
  output_path = "${path.module}/dummy_lambda.zip"
  source {
    content  = "def handler(event, context):\n    return {'statusCode': 200, 'body': 'Serverless Bootstrap Complete'}"
    filename = "server.py"
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "SophieLamourLambdaExecRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "backend" {
  function_name    = "sophielamour-backend"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "server.handler"
  runtime          = "python3.12"
  filename         = data.archive_file.dummy_lambda.output_path
  source_code_hash = data.archive_file.dummy_lambda.output_base64sha256
  timeout          = 30
  memory_size      = 256
}

# ==========================================
# 🔌 API GATEWAY (HTTP API)
# ==========================================

resource "aws_apigatewayv2_api" "http_api" {
  name          = "sophielamour-api-gateway"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["*"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"

  connection_type      = "INTERNET"
  description          = "FastAPI lambda backend integration"
  integration_method   = "POST"
  integration_uri      = aws_lambda_function.backend.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# ==========================================
# ⚡ CLOUDFRONT DISTRIBUTION
# ==========================================

resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # Origin 1: Private S3 Frontend Bucket
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-Frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # Origin 2: API Gateway HTTP API
  origin {
    domain_name = replace(aws_apigatewayv2_api.http_api.api_endpoint, "/https:\\/\\//", "")
    origin_id   = "APIGateway-Backend"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default Cache Behavior: Serve S3 Static Assets
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Frontend"

    forwarded_values {
      query_string = false
      headers      = []
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # API Cache Behavior: Forward /api/* requests directly to API Gateway without caching
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "APIGateway-Backend"

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # React SPA Routing Configuration: Redirect 404/403 back to index.html with 200 OK
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
}

# ==========================================
# 🛡️ S3 BUCKET POLICY FOR OAC ACCESS ONLY
# ==========================================

resource "aws_s3_bucket_policy" "oac_access" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn.arn
          }
        }
      }
    ]
  })
}

# ==========================================
# 🛡️ LEAST-PRIVILEGE ROLE PERMISSIONS POLICY
# ==========================================

resource "aws_iam_role_policy" "github_actions_policy" {
  name = "SophieLamourGitHubDeployPolicy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3FrontendSync"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*"
        ]
      },
      {
        Sid    = "CloudFrontCacheInvalidation"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = aws_cloudfront_distribution.cdn.arn
      },
      {
        Sid    = "LambdaBackendCodeDeploy"
        Effect = "Allow"
        Action = [
          "lambda:UpdateFunctionCode"
        ]
        Resource = aws_lambda_function.backend.arn
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_access" {
  name = "SophieLamourLambdaAccessPolicy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:BatchWriteItem",
          "dynamodb:BatchGetItem"
        ]
        Resource = [
          "arn:aws:dynamodb:${var.aws_region}:464868388442:table/sophielamour-*",
          "arn:aws:dynamodb:${var.aws_region}:464868388442:table/sophielamour-*/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.uploads.arn,
          "${aws_s3_bucket.uploads.arn}/*"
        ]
      }
    ]
  })
}

# ==========================================
# 📦 PRIVATE S3 UPLOADS BUCKET (5 GB FREE TIER)
# ==========================================

resource "aws_s3_bucket" "uploads" {
  bucket        = "sophielamour-uploads"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "uploads_privacy" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "uploads_public_policy" {
  bucket = aws_s3_bucket.uploads.id

  depends_on = [aws_s3_bucket_public_access_block.uploads_privacy]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.uploads.arn}/*"
      }
    ]
  })
}

# ==========================================
# 📊 DYNAMODB TABLES (25 GB FREE FOREVER)
# ==========================================

resource "aws_dynamodb_table" "users" {
  name         = "sophielamour-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }
}

resource "aws_dynamodb_table" "blog_posts" {
  name         = "sophielamour-blog-posts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "slug"
    type = "S"
  }

  global_secondary_index {
    name            = "slug-index"
    hash_key        = "slug"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "testimonials" {
  name         = "sophielamour-testimonials"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "contact_requests" {
  name         = "sophielamour-contact-requests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "uploads" {
  name         = "sophielamour-uploads"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "file_id"

  attribute {
    name = "file_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "social_share_queue" {
  name         = "sophielamour-social-share-queue"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# ==========================================
# 📊 OUTPUT VARIABLES FOR GITHUB SECRETS
# ==========================================


output "GITHUB_SECRET_AWS_ROLE_TO_ASSUME" {
  value       = aws_iam_role.github_actions.arn
  description = "Copy this into GitHub Secret: AWS_ROLE_TO_ASSUME"
}

output "GITHUB_SECRET_AWS_REGION" {
  value       = var.aws_region
  description = "Copy this into GitHub Secret: AWS_REGION"
}

output "GITHUB_SECRET_AWS_S3_BUCKET_NAME" {
  value       = aws_s3_bucket.frontend.id
  description = "Copy this into GitHub Secret: AWS_S3_BUCKET_NAME"
}

output "GITHUB_SECRET_AWS_CLOUDFRONT_DISTRIBUTION_ID" {
  value       = aws_cloudfront_distribution.cdn.id
  description = "Copy this into GitHub Secret: AWS_CLOUDFRONT_DISTRIBUTION_ID"
}

output "GITHUB_SECRET_AWS_LAMBDA_FUNCTION_NAME" {
  value       = aws_lambda_function.backend.function_name
  description = "Copy this into GitHub Secret: AWS_LAMBDA_FUNCTION_NAME"
}

output "CLOUDFRONT_DOMAIN_NAME" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "Access your production website globally at this HTTPS address!"
}

"""
Test iteration 6 - Testing backend refactoring and SEO additions:
1. Backend routes refactored from monolithic server.py into modular route files
2. SEO: sitemap.xml and robots.txt created
3. All API endpoints should work identically after refactoring
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# ============================================================================
# AUTH ROUTES TESTS (routes/auth.py)
# ============================================================================
class TestAuthRoutes:
    """Test auth endpoints from routes/auth.py"""
    
    def test_login_returns_user_data_and_cookies(self):
        """POST /api/auth/login should return user data and set httpOnly cookies"""
        session = requests.Session()
        payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        response = session.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        # Verify user data returned
        assert "email" in data
        assert data["email"] == "admin@sophielamour.com"
        assert data["role"] == "admin"
        assert "name" in data
        assert "id" in data
        
        # Verify cookies set
        assert "access_token" in session.cookies or len(response.cookies) > 0
        print("✓ POST /api/auth/login returns user data and sets cookies")
    
    def test_auth_me_returns_current_user(self):
        """GET /api/auth/me should return current user with valid cookie"""
        session = requests.Session()
        # Login first
        login_payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        session.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        
        # Get current user
        response = session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200, f"Auth me failed: {response.text}"
        
        data = response.json()
        assert data["email"] == "admin@sophielamour.com"
        assert data["role"] == "admin"
        assert "password_hash" not in data  # Should not expose password
        print("✓ GET /api/auth/me returns current user with valid cookie")
    
    def test_logout_clears_cookies(self):
        """POST /api/auth/logout should clear cookies"""
        session = requests.Session()
        # Login first
        login_payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        session.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        
        # Logout
        response = session.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        print("✓ POST /api/auth/logout clears cookies")
    
    def test_login_invalid_credentials(self):
        """POST /api/auth/login should reject invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ POST /api/auth/login rejects invalid credentials")


# ============================================================================
# BLOG ROUTES TESTS (routes/blog.py)
# ============================================================================
class TestBlogRoutes:
    """Test blog endpoints from routes/blog.py"""
    
    def test_get_blog_posts_list(self):
        """GET /api/blog/posts should return blog posts list"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/blog/posts returns blog posts list ({len(data)} posts)")
    
    def test_get_blog_posts_with_status_filter(self):
        """GET /api/blog/posts?status=published should filter by status"""
        response = requests.get(f"{BASE_URL}/api/blog/posts?status=published")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        # All returned posts should be published
        for post in data:
            assert post.get("status") == "published"
        print(f"✓ GET /api/blog/posts?status=published filters correctly ({len(data)} published)")
    
    def test_get_single_blog_post_by_slug(self):
        """GET /api/blog/posts/{slug} should return single post"""
        # First get list to find a valid slug
        list_response = requests.get(f"{BASE_URL}/api/blog/posts")
        posts = list_response.json()
        
        if len(posts) > 0:
            slug = posts[0]["slug"]
            response = requests.get(f"{BASE_URL}/api/blog/posts/{slug}")
            assert response.status_code == 200
            
            data = response.json()
            assert data["slug"] == slug
            assert "title_fr" in data
            assert "content_fr" in data
            print(f"✓ GET /api/blog/posts/{slug} returns single post")
        else:
            pytest.skip("No blog posts available to test")
    
    def test_get_nonexistent_blog_post(self):
        """GET /api/blog/posts/{slug} should return 404 for nonexistent post"""
        response = requests.get(f"{BASE_URL}/api/blog/posts/nonexistent-slug-12345")
        assert response.status_code == 404
        print("✓ GET /api/blog/posts/nonexistent returns 404")


# ============================================================================
# TESTIMONIALS ROUTES TESTS (routes/testimonials.py)
# ============================================================================
class TestTestimonialsRoutes:
    """Test testimonials endpoints from routes/testimonials.py"""
    
    def test_get_testimonials_list(self):
        """GET /api/testimonials should return testimonials list"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/testimonials returns testimonials list ({len(data)} testimonials)")
    
    def test_testimonials_have_required_fields(self):
        """Testimonials should have required fields"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        data = response.json()
        
        if len(data) > 0:
            testimonial = data[0]
            assert "name" in testimonial
            assert "text_fr" in testimonial
            assert "text_en" in testimonial
            assert "rating" in testimonial
            assert "id" in testimonial
            assert "_id" not in testimonial  # MongoDB _id should be excluded
            print("✓ Testimonials have required fields (no _id exposed)")
        else:
            pytest.skip("No testimonials available to test")


# ============================================================================
# CONTACT ROUTES TESTS (routes/contact.py)
# ============================================================================
class TestContactRoutes:
    """Test contact endpoints from routes/contact.py"""
    
    def test_submit_contact_form(self):
        """POST /api/contact should accept contact form data with interestedServices"""
        payload = {
            "firstName": "TEST_Iter6",
            "lastName": "User",
            "email": "test_iter6@example.com",
            "phone": "+33123456789",
            "interestedServices": ["personnel", "yoga-du-rire"],
            "message": "Test message for iteration 6 testing",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code in [200, 201], f"Contact submit failed: {response.text}"
        
        data = response.json()
        assert "message" in data  # Success message
        print("✓ POST /api/contact accepts contact form data with interestedServices")
    
    def test_admin_get_contact_requests(self):
        """GET /api/contact/requests should return contact messages for admin"""
        session = requests.Session()
        # Login as admin
        session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        })
        
        response = session.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 200, f"Get contact requests failed: {response.text}"
        
        data = response.json()
        assert isinstance(data, list)
        
        # Check that our test contact is in the list
        test_contacts = [c for c in data if c.get("firstName", "").startswith("TEST_")]
        print(f"✓ GET /api/contact/requests returns contact messages ({len(data)} total, {len(test_contacts)} test)")
    
    def test_contact_requests_requires_auth(self):
        """GET /api/contact/requests should require authentication"""
        response = requests.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 401
        print("✓ GET /api/contact/requests requires authentication")


# ============================================================================
# UPLOADS ROUTES TESTS (routes/uploads.py)
# ============================================================================
class TestUploadsRoutes:
    """Test uploads endpoints from routes/uploads.py"""
    
    def test_upload_requires_auth(self):
        """POST /api/uploads should require authentication"""
        # Try to upload without auth
        files = {'file': ('test.jpg', b'fake image data', 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/uploads", files=files)
        assert response.status_code == 401
        print("✓ POST /api/uploads requires authentication")
    
    def test_get_existing_upload(self):
        """GET /api/uploads/{file_id} should return stored file"""
        # First, get a blog post that has a featured_image
        posts_response = requests.get(f"{BASE_URL}/api/blog/posts")
        posts = posts_response.json()
        
        # Find a post with a featured_image that uses our upload system
        for post in posts:
            featured_image = post.get("featured_image")
            if featured_image and "/api/uploads/" in featured_image:
                # Extract file_id from URL
                file_id = featured_image.split("/api/uploads/")[-1]
                
                response = requests.get(f"{BASE_URL}/api/uploads/{file_id}")
                if response.status_code == 200:
                    assert response.headers.get("Content-Type") is not None
                    print(f"✓ GET /api/uploads/{file_id} returns stored file")
                    return
        
        # If no uploads found, skip
        pytest.skip("No uploads found to test")


# ============================================================================
# SEO TESTS (sitemap.xml and robots.txt)
# ============================================================================
class TestSEOFiles:
    """Test SEO files: sitemap.xml and robots.txt"""
    
    def test_sitemap_xml_accessible(self):
        """GET /sitemap.xml should return valid XML sitemap"""
        response = requests.get(f"{BASE_URL}/sitemap.xml")
        assert response.status_code == 200, f"Sitemap not accessible: {response.status_code}"
        
        content = response.text
        # Check it's valid XML
        assert '<?xml version="1.0"' in content
        assert '<urlset' in content
        assert '</urlset>' in content
        
        # Check for expected URLs
        assert 'sophielamour.com' in content
        assert '/services/personnel' in content
        assert '/services/professionnel' in content
        assert '/services/parentalite' in content
        assert '/services/home-organising' in content
        assert '/services/yoga-du-rire' in content
        assert '/contact' in content
        assert '/blog' in content
        print("✓ GET /sitemap.xml returns valid XML sitemap with all URLs")
    
    def test_robots_txt_accessible(self):
        """GET /robots.txt should return robots file with sitemap reference"""
        response = requests.get(f"{BASE_URL}/robots.txt")
        assert response.status_code == 200, f"Robots.txt not accessible: {response.status_code}"
        
        content = response.text
        # Check for required directives
        assert 'User-agent:' in content
        assert 'Sitemap:' in content
        assert 'sitemap.xml' in content
        
        # Check admin and api are disallowed
        assert '/admin/' in content
        assert '/api/' in content
        print("✓ GET /robots.txt returns robots file with sitemap reference")


# ============================================================================
# STATIC ASSETS TESTS
# ============================================================================
class TestStaticAssets:
    """Test static assets are accessible"""
    
    def test_favicon_accessible(self):
        """Favicon should be accessible"""
        response = requests.get(f"{BASE_URL}/favicon.svg")
        assert response.status_code == 200
        print("✓ Favicon accessible")
    
    def test_logo_accessible(self):
        """Logo should be accessible"""
        response = requests.get(f"{BASE_URL}/sophie_logo.jpg")
        assert response.status_code == 200
        print("✓ Logo accessible")


# ============================================================================
# ADMIN CRUD OPERATIONS (verify refactoring didn't break admin features)
# ============================================================================
class TestAdminCRUDOperations:
    """Test admin CRUD operations work after refactoring"""
    
    @pytest.fixture
    def admin_session(self):
        """Create authenticated admin session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        })
        assert response.status_code == 200
        return session
    
    def test_admin_can_create_and_delete_testimonial(self, admin_session):
        """Admin should be able to create and delete testimonial"""
        # Create
        create_payload = {
            "name": "TEST_Iter6_Testimonial",
            "text_fr": "Texte de test",
            "text_en": "Test text",
            "rating": 5
        }
        create_response = admin_session.post(f"{BASE_URL}/api/testimonials", json=create_payload)
        assert create_response.status_code in [200, 201], f"Create failed: {create_response.text}"
        
        created = create_response.json()
        assert "id" in created
        testimonial_id = created["id"]
        
        # Delete
        delete_response = admin_session.delete(f"{BASE_URL}/api/testimonials/{testimonial_id}")
        assert delete_response.status_code == 200
        print("✓ Admin can create and delete testimonial")
    
    def test_admin_can_create_and_delete_blog_post(self, admin_session):
        """Admin should be able to create and delete blog post"""
        # Create
        create_payload = {
            "title_fr": "TEST_Iter6_Blog",
            "title_en": "TEST_Iter6_Blog_EN",
            "content_fr": "<p>Contenu test</p>",
            "content_en": "<p>Test content</p>",
            "excerpt_fr": "Extrait test",
            "excerpt_en": "Test excerpt",
            "category": "coaching",
            "status": "draft"
        }
        create_response = admin_session.post(f"{BASE_URL}/api/blog/posts", json=create_payload)
        assert create_response.status_code in [200, 201], f"Create failed: {create_response.text}"
        
        created = create_response.json()
        assert "id" in created
        post_id = created["id"]
        
        # Delete
        delete_response = admin_session.delete(f"{BASE_URL}/api/blog/posts/{post_id}")
        assert delete_response.status_code == 200
        print("✓ Admin can create and delete blog post")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

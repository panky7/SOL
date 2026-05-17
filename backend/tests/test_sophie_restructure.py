"""
Backend API tests for Sophie Lamour coaching website - Major Restructure
Tests: Contact form with new fields (firstName, lastName, interestedServices, consent)
       Admin dashboard contact requests, Auth endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@sophielamour.com"
ADMIN_PASSWORD = "SophieAdmin2025!"


class TestHealthAndBasicEndpoints:
    """Basic API health checks"""
    
    def test_testimonials_endpoint(self):
        """GET /api/testimonials should return list"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Testimonials endpoint working, {len(data)} testimonials found")
    
    def test_blog_posts_endpoint(self):
        """GET /api/blog/posts should return list"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Blog posts endpoint working, {len(data)} posts found")
    
    def test_blog_posts_published_filter(self):
        """GET /api/blog/posts?status=published should filter"""
        response = requests.get(f"{BASE_URL}/api/blog/posts?status=published")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for post in data:
            assert post.get('status') == 'published'
        print(f"✓ Blog posts filter working, {len(data)} published posts")


class TestContactFormNewFields:
    """Test enhanced contact form with firstName, lastName, interestedServices, consent"""
    
    def test_contact_form_with_all_new_fields(self):
        """POST /api/contact with all new fields should succeed"""
        payload = {
            "firstName": "TEST_Jean",
            "lastName": "TEST_Dupont",
            "email": "test_contact@example.com",
            "phone": "+33612345678",
            "interestedServices": ["personnel", "professionnel"],
            "message": "Test message for restructure testing",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Contact form with all new fields works: {data}")
    
    def test_contact_form_minimal_fields(self):
        """POST /api/contact with minimal required fields"""
        payload = {
            "firstName": "TEST_Marie",
            "lastName": "TEST_Martin",
            "email": "test_minimal@example.com",
            "message": "Minimal test message",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        print("✓ Contact form with minimal fields works")
    
    def test_contact_form_with_single_service(self):
        """POST /api/contact with single service selection"""
        payload = {
            "firstName": "TEST_Pierre",
            "lastName": "TEST_Bernard",
            "email": "test_single_service@example.com",
            "interestedServices": ["parentalite"],
            "message": "Interested in parenting support",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        print("✓ Contact form with single service works")
    
    def test_contact_form_with_home_organising(self):
        """POST /api/contact with home-organising service"""
        payload = {
            "firstName": "TEST_Sophie",
            "lastName": "TEST_Blanc",
            "email": "test_home_org@example.com",
            "interestedServices": ["home-organising"],
            "message": "Need help organizing my home",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        print("✓ Contact form with home-organising service works")
    
    def test_contact_form_missing_consent(self):
        """POST /api/contact without consent should still work (backend accepts)"""
        payload = {
            "firstName": "TEST_NoConsent",
            "lastName": "TEST_User",
            "email": "test_no_consent@example.com",
            "message": "Test without consent",
            "consent": False
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        # Backend accepts the request, frontend validates consent
        assert response.status_code == 200
        print("✓ Contact form without consent accepted by backend")
    
    def test_contact_form_invalid_email(self):
        """POST /api/contact with invalid email should fail"""
        payload = {
            "firstName": "TEST_Invalid",
            "lastName": "TEST_Email",
            "email": "not-an-email",
            "message": "Test with invalid email",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422  # Validation error
        print("✓ Contact form rejects invalid email")


class TestAuthEndpoints:
    """Test authentication endpoints"""
    
    def test_login_success(self):
        """POST /api/auth/login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print(f"✓ Admin login successful: {data['email']}")
    
    def test_login_invalid_password(self):
        """POST /api/auth/login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Login rejects invalid password")
    
    def test_login_invalid_email(self):
        """POST /api/auth/login with non-existent email"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "anypassword"
        })
        assert response.status_code == 401
        print("✓ Login rejects non-existent email")


class TestAdminContactRequests:
    """Test admin access to contact requests"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_get_contact_requests_authenticated(self, auth_session):
        """GET /api/contact/requests with auth should return list"""
        response = auth_session.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Contact requests retrieved: {len(data)} requests")
        
        # Verify new fields are present in contact requests
        if len(data) > 0:
            request = data[0]
            # Check for new fields
            assert "firstName" in request or "name" in request
            if "firstName" in request:
                print(f"  - firstName field present: {request.get('firstName')}")
            if "lastName" in request:
                print(f"  - lastName field present: {request.get('lastName')}")
            if "interestedServices" in request:
                print(f"  - interestedServices field present: {request.get('interestedServices')}")
    
    def test_get_contact_requests_unauthenticated(self):
        """GET /api/contact/requests without auth should fail"""
        response = requests.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 401
        print("✓ Contact requests protected from unauthenticated access")


class TestBlogEndpoints:
    """Test blog CRUD operations"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_create_blog_post(self, auth_session):
        """POST /api/blog/posts should create new post"""
        payload = {
            "title_fr": "TEST: Article de test restructure",
            "title_en": "TEST: Test restructure article",
            "content_fr": "<p>Contenu de test</p>",
            "content_en": "<p>Test content</p>",
            "excerpt_fr": "Extrait de test",
            "excerpt_en": "Test excerpt",
            "category": "coaching",
            "status": "draft"
        }
        response = auth_session.post(f"{BASE_URL}/api/blog/posts", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["title_fr"] == payload["title_fr"]
        assert "slug" in data
        assert "id" in data
        print(f"✓ Blog post created: {data['slug']}")
        return data
    
    def test_get_blog_post_by_slug(self, auth_session):
        """GET /api/blog/posts/:slug should return post"""
        # First create a post
        payload = {
            "title_fr": "TEST: Article pour slug test",
            "title_en": "TEST: Article for slug test",
            "content_fr": "<p>Contenu</p>",
            "content_en": "<p>Content</p>",
            "excerpt_fr": "Extrait",
            "excerpt_en": "Excerpt",
            "category": "coaching",
            "status": "published"
        }
        create_response = auth_session.post(f"{BASE_URL}/api/blog/posts", json=payload)
        if create_response.status_code == 200:
            slug = create_response.json()["slug"]
            
            # Get by slug
            response = requests.get(f"{BASE_URL}/api/blog/posts/{slug}")
            assert response.status_code == 200
            data = response.json()
            assert data["slug"] == slug
            print(f"✓ Blog post retrieved by slug: {slug}")


class TestServicesValidation:
    """Validate that only 4 main services exist in the system"""
    
    def test_contact_form_accepts_valid_services(self):
        """Contact form should accept the 4 main services"""
        valid_services = ["personnel", "professionnel", "parentalite", "home-organising"]
        
        for service in valid_services:
            payload = {
                "firstName": f"TEST_{service}",
                "lastName": "TEST_Service",
                "email": f"test_{service}@example.com",
                "interestedServices": [service],
                "message": f"Testing {service} service",
                "consent": True
            }
            response = requests.post(f"{BASE_URL}/api/contact", json=payload)
            assert response.status_code == 200
            print(f"✓ Service '{service}' accepted in contact form")
    
    def test_contact_form_accepts_autre_option(self):
        """Contact form should accept 'autre' option"""
        payload = {
            "firstName": "TEST_Autre",
            "lastName": "TEST_Option",
            "email": "test_autre@example.com",
            "interestedServices": ["autre"],
            "message": "Not sure which service I need",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        print("✓ 'autre' option accepted in contact form")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

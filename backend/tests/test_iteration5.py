"""
Test iteration 5 - Testing new changes:
1. Favicon SVG accessible
2. Contact API with yoga-du-rire service
3. Admin login and contact messages
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestFaviconAndStaticAssets:
    """Test favicon and static assets"""
    
    def test_favicon_svg_accessible(self):
        """Favicon SVG should be accessible"""
        response = requests.get(f"{BASE_URL}/favicon.svg")
        assert response.status_code == 200
        assert "svg" in response.headers.get("content-type", "").lower() or response.text.startswith("<svg")
        # Check for botanical flower design elements
        assert "circle" in response.text.lower()
        assert "path" in response.text.lower()
        print("✓ Favicon SVG accessible with botanical design")
    
    def test_logo_accessible(self):
        """Logo image should be accessible"""
        response = requests.get(f"{BASE_URL}/sophie_logo.jpg")
        assert response.status_code == 200
        print("✓ Logo image accessible")


class TestContactAPIWithYogaDuRire:
    """Test contact API with yoga-du-rire service"""
    
    def test_contact_submission_with_yoga_du_rire(self):
        """Contact form should accept yoga-du-rire in interestedServices"""
        payload = {
            "firstName": "TEST_Yoga",
            "lastName": "User",
            "email": "test_yoga@example.com",
            "phone": "+33123456789",
            "interestedServices": ["yoga-du-rire", "personnel"],
            "message": "Test message for yoga du rire service",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code in [200, 201]
        data = response.json()
        assert "id" in data or "_id" in data or "message" in data
        print("✓ Contact submission with yoga-du-rire accepted")
    
    def test_contact_submission_all_services(self):
        """Contact form should accept all 5 services + autre"""
        payload = {
            "firstName": "TEST_AllServices",
            "lastName": "User",
            "email": "test_all@example.com",
            "phone": "+33123456789",
            "interestedServices": [
                "personnel",
                "professionnel",
                "parentalite",
                "home-organising",
                "yoga-du-rire",
                "autre"
            ],
            "message": "Test message with all services",
            "consent": True
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code in [200, 201]
        print("✓ Contact submission with all services accepted")


class TestAdminAuth:
    """Test admin authentication - uses httpOnly cookies"""
    
    def test_admin_login_returns_user_data(self):
        """Admin login should return user data and set cookies"""
        session = requests.Session()
        payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        response = session.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 200
        data = response.json()
        # Check user data returned
        assert "email" in data
        assert data["email"] == "admin@sophielamour.com"
        assert data["role"] == "admin"
        # Check cookies set
        assert "access_token" in session.cookies or len(response.cookies) > 0
        print("✓ Admin login successful with user data and cookies")
    
    def test_admin_get_contact_requests(self):
        """Admin should be able to view contact requests using session cookies"""
        session = requests.Session()
        # Login first
        login_payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        assert login_response.status_code == 200
        
        # Get contact requests using same session (cookies)
        response = session.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin can view contact requests ({len(data)} found)")
    
    def test_admin_me_endpoint(self):
        """Admin /auth/me should return current user"""
        session = requests.Session()
        # Login first
        login_payload = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }
        session.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        
        # Get current user
        response = session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "admin@sophielamour.com"
        print("✓ Admin /auth/me works")


class TestPublicEndpoints:
    """Test public endpoints"""
    
    def test_testimonials_endpoint(self):
        """Testimonials endpoint should work"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        print("✓ Testimonials endpoint works")
    
    def test_blog_posts_endpoint(self):
        """Blog posts endpoint should work"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        print("✓ Blog posts endpoint works")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

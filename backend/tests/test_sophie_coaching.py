"""
Sophie Lamour Life Coaching Website - Backend API Tests
Tests: Authentication, Blog CRUD, Testimonials CRUD, Contact Form
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@sophielamour.com"
ADMIN_PASSWORD = "SophieAdmin2025!"


class TestHealthAndBasicEndpoints:
    """Basic API health and accessibility tests"""
    
    def test_blog_posts_endpoint_accessible(self):
        """Test that blog posts endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/blog/posts")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ Blog posts endpoint accessible, returned {len(response.json())} posts")
    
    def test_testimonials_endpoint_accessible(self):
        """Test that testimonials endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"✓ Testimonials endpoint accessible, returned {len(response.json())} testimonials")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert data["name"] == "Sophie Lamour"
        print(f"✓ Admin login successful: {data['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected with 401")
    
    def test_auth_me_without_token(self):
        """Test /auth/me without authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me correctly returns 401 without token")
    
    def test_auth_me_with_cookie(self):
        """Test /auth/me with valid session cookie"""
        session = requests.Session()
        login_response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200
        
        # Check /auth/me with session cookies
        me_response = session.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200
        data = me_response.json()
        assert data["email"] == ADMIN_EMAIL
        print(f"✓ /auth/me returns user data with valid session")
    
    def test_logout(self):
        """Test logout endpoint"""
        session = requests.Session()
        # Login first
        session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        
        # Logout
        logout_response = session.post(f"{BASE_URL}/api/auth/logout")
        assert logout_response.status_code == 200
        assert "Logged out" in logout_response.json().get("message", "")
        print("✓ Logout successful")


class TestBlogCRUD:
    """Blog posts CRUD operations tests"""
    
    @pytest.fixture
    def authenticated_session(self):
        """Create authenticated session for tests"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        return session
    
    def test_get_published_blog_posts(self):
        """Test getting published blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog/posts?status=published")
        assert response.status_code == 200
        posts = response.json()
        assert isinstance(posts, list)
        # All returned posts should be published
        for post in posts:
            assert post.get("status") == "published"
        print(f"✓ Retrieved {len(posts)} published blog posts")
    
    def test_create_blog_post(self, authenticated_session):
        """Test creating a new blog post"""
        test_post = {
            "title_fr": "TEST: Article de test",
            "title_en": "TEST: Test Article",
            "content_fr": "<p>Contenu de test en français</p>",
            "content_en": "<p>Test content in English</p>",
            "excerpt_fr": "Extrait de test",
            "excerpt_en": "Test excerpt",
            "category": "Coaching",
            "status": "draft",
            "share_to_social": False
        }
        
        response = authenticated_session.post(
            f"{BASE_URL}/api/blog/posts",
            json=test_post
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title_fr"] == test_post["title_fr"]
        assert data["title_en"] == test_post["title_en"]
        assert "slug" in data
        assert "created_at" in data
        print(f"✓ Blog post created with slug: {data['slug']}")
        
        # Verify persistence by GET
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{data['slug']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["title_fr"] == test_post["title_fr"]
        print("✓ Blog post verified via GET")
        
        return data
    
    def test_get_blog_post_by_slug(self, authenticated_session):
        """Test getting a specific blog post by slug"""
        # First create a post
        test_post = {
            "title_fr": "TEST: Article pour GET",
            "title_en": "TEST: Article for GET",
            "content_fr": "<p>Contenu</p>",
            "content_en": "<p>Content</p>",
            "excerpt_fr": "Extrait",
            "excerpt_en": "Excerpt",
            "category": "Bien-être",
            "status": "published"
        }
        
        create_response = authenticated_session.post(
            f"{BASE_URL}/api/blog/posts",
            json=test_post
        )
        assert create_response.status_code == 200
        slug = create_response.json()["slug"]
        
        # Get by slug
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{slug}")
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["title_fr"] == test_post["title_fr"]
        print(f"✓ Blog post retrieved by slug: {slug}")
    
    def test_update_blog_post(self, authenticated_session):
        """Test updating a blog post"""
        # Create a post first
        test_post = {
            "title_fr": "TEST: Article à modifier",
            "title_en": "TEST: Article to update",
            "content_fr": "<p>Original</p>",
            "content_en": "<p>Original</p>",
            "excerpt_fr": "Original",
            "excerpt_en": "Original",
            "category": "Coaching",
            "status": "draft"
        }
        
        create_response = authenticated_session.post(
            f"{BASE_URL}/api/blog/posts",
            json=test_post
        )
        assert create_response.status_code == 200
        post_id = create_response.json()["id"]
        
        # Update the post
        update_data = {"title_fr": "TEST: Article modifié", "status": "published"}
        update_response = authenticated_session.put(
            f"{BASE_URL}/api/blog/posts/{post_id}",
            json=update_data
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title_fr"] == "TEST: Article modifié"
        assert updated["status"] == "published"
        print(f"✓ Blog post updated: {post_id}")
    
    def test_delete_blog_post(self, authenticated_session):
        """Test deleting a blog post"""
        # Create a post first
        test_post = {
            "title_fr": "TEST: Article à supprimer",
            "title_en": "TEST: Article to delete",
            "content_fr": "<p>Delete me</p>",
            "content_en": "<p>Delete me</p>",
            "excerpt_fr": "Delete",
            "excerpt_en": "Delete",
            "category": "Coaching",
            "status": "draft"
        }
        
        create_response = authenticated_session.post(
            f"{BASE_URL}/api/blog/posts",
            json=test_post
        )
        assert create_response.status_code == 200
        post_id = create_response.json()["id"]
        slug = create_response.json()["slug"]
        
        # Delete the post
        delete_response = authenticated_session.delete(f"{BASE_URL}/api/blog/posts/{post_id}")
        assert delete_response.status_code == 200
        print(f"✓ Blog post deleted: {post_id}")
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/blog/posts/{slug}")
        assert get_response.status_code == 404
        print("✓ Deleted post returns 404")
    
    def test_create_blog_post_without_auth(self):
        """Test that creating blog post without auth fails"""
        test_post = {
            "title_fr": "Unauthorized post",
            "title_en": "Unauthorized post",
            "content_fr": "<p>Test</p>",
            "content_en": "<p>Test</p>",
            "excerpt_fr": "Test",
            "excerpt_en": "Test",
            "category": "Coaching",
            "status": "draft"
        }
        
        response = requests.post(f"{BASE_URL}/api/blog/posts", json=test_post)
        assert response.status_code == 401
        print("✓ Unauthorized blog post creation correctly rejected")


class TestTestimonialsCRUD:
    """Testimonials CRUD operations tests"""
    
    @pytest.fixture
    def authenticated_session(self):
        """Create authenticated session for tests"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        return session
    
    def test_get_testimonials(self):
        """Test getting all testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        testimonials = response.json()
        assert isinstance(testimonials, list)
        print(f"✓ Retrieved {len(testimonials)} testimonials")
    
    def test_create_testimonial(self, authenticated_session):
        """Test creating a new testimonial"""
        test_testimonial = {
            "name": "TEST: Marie Dupont",
            "text_fr": "Excellent coaching, je recommande vivement!",
            "text_en": "Excellent coaching, highly recommend!",
            "rating": 5
        }
        
        response = authenticated_session.post(
            f"{BASE_URL}/api/testimonials",
            json=test_testimonial
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == test_testimonial["name"]
        assert data["rating"] == 5
        assert "id" in data
        print(f"✓ Testimonial created: {data['id']}")
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/testimonials")
        testimonials = get_response.json()
        found = any(t["name"] == test_testimonial["name"] for t in testimonials)
        assert found
        print("✓ Testimonial verified in list")
        
        return data
    
    def test_update_testimonial(self, authenticated_session):
        """Test updating a testimonial"""
        # Create first
        test_testimonial = {
            "name": "TEST: Jean Martin",
            "text_fr": "Original text",
            "text_en": "Original text",
            "rating": 4
        }
        
        create_response = authenticated_session.post(
            f"{BASE_URL}/api/testimonials",
            json=test_testimonial
        )
        assert create_response.status_code == 200
        testimonial_id = create_response.json()["id"]
        
        # Update
        update_data = {"rating": 5, "text_fr": "Updated text"}
        update_response = authenticated_session.put(
            f"{BASE_URL}/api/testimonials/{testimonial_id}",
            json=update_data
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["rating"] == 5
        assert updated["text_fr"] == "Updated text"
        print(f"✓ Testimonial updated: {testimonial_id}")
    
    def test_delete_testimonial(self, authenticated_session):
        """Test deleting a testimonial"""
        # Create first
        test_testimonial = {
            "name": "TEST: To Delete",
            "text_fr": "Delete me",
            "text_en": "Delete me",
            "rating": 3
        }
        
        create_response = authenticated_session.post(
            f"{BASE_URL}/api/testimonials",
            json=test_testimonial
        )
        assert create_response.status_code == 200
        testimonial_id = create_response.json()["id"]
        
        # Delete
        delete_response = authenticated_session.delete(
            f"{BASE_URL}/api/testimonials/{testimonial_id}"
        )
        assert delete_response.status_code == 200
        print(f"✓ Testimonial deleted: {testimonial_id}")
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/testimonials")
        testimonials = get_response.json()
        found = any(t.get("id") == testimonial_id for t in testimonials)
        assert not found
        print("✓ Deleted testimonial not in list")


class TestContactForm:
    """Contact form tests"""
    
    @pytest.fixture
    def authenticated_session(self):
        """Create authenticated session for tests"""
        session = requests.Session()
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        return session
    
    def test_submit_contact_form(self):
        """Test submitting a contact form"""
        contact_data = {
            "name": "TEST: Contact User",
            "email": "test@example.com",
            "phone": "+33612345678",
            "subject": "Test inquiry",
            "message": "This is a test message from automated testing."
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✓ Contact form submitted successfully")
    
    def test_get_contact_requests_authenticated(self, authenticated_session):
        """Test getting contact requests as admin"""
        response = authenticated_session.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 200
        requests_list = response.json()
        assert isinstance(requests_list, list)
        print(f"✓ Retrieved {len(requests_list)} contact requests")
    
    def test_get_contact_requests_unauthenticated(self):
        """Test that unauthenticated users cannot get contact requests"""
        response = requests.get(f"{BASE_URL}/api/contact/requests")
        assert response.status_code == 401
        print("✓ Unauthenticated contact requests access correctly rejected")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

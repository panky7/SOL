#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class SophieCoachingAPITester:
    def __init__(self, base_url="https://sophie-coaching.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {
            "email": "admin@sophielamour.com",
            "password": "SophieAdmin2025!"
        }

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")

    def test_auth_login(self):
        """Test admin login"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json=self.admin_credentials,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and data['email'] == self.admin_credentials['email']:
                    self.log_test("Admin Login", True, f"Logged in as {data['email']}")
                    return True
                else:
                    self.log_test("Admin Login", False, "Invalid response format")
                    return False
            else:
                self.log_test("Admin Login", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_auth_me(self):
        """Test getting current user info"""
        try:
            response = self.session.get(f"{self.base_url}/api/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                if 'email' in data and 'role' in data:
                    self.log_test("Get Current User", True, f"User: {data['email']}, Role: {data['role']}")
                    return True
                else:
                    self.log_test("Get Current User", False, "Missing user data")
                    return False
            else:
                self.log_test("Get Current User", False, f"Status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get Current User", False, str(e))
            return False

    def test_blog_posts_get(self):
        """Test getting blog posts"""
        try:
            response = self.session.get(f"{self.base_url}/api/blog/posts")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Blog Posts", True, f"Retrieved {len(data)} posts")
                return data
            else:
                self.log_test("Get Blog Posts", False, f"Status {response.status_code}")
                return []
                
        except Exception as e:
            self.log_test("Get Blog Posts", False, str(e))
            return []

    def test_blog_post_create(self):
        """Test creating a blog post"""
        try:
            test_post = {
                "title_fr": "Test Article de Blog",
                "title_en": "Test Blog Post",
                "content_fr": "<p>Ceci est un test d'article de blog en français.</p>",
                "content_en": "<p>This is a test blog post in English.</p>",
                "excerpt_fr": "Extrait de test en français",
                "excerpt_en": "Test excerpt in English",
                "featured_image": "https://example.com/test-image.jpg",
                "category": "Développement personnel",
                "status": "draft"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/blog/posts",
                json=test_post,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'slug' in data:
                    self.log_test("Create Blog Post", True, f"Created post with ID: {data['id']}")
                    return data['id']
                else:
                    self.log_test("Create Blog Post", False, "Missing post ID in response")
                    return None
            else:
                self.log_test("Create Blog Post", False, f"Status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Create Blog Post", False, str(e))
            return None

    def test_blog_post_get_by_slug(self, slug):
        """Test getting a specific blog post by slug"""
        try:
            response = self.session.get(f"{self.base_url}/api/blog/posts/{slug}")
            
            if response.status_code == 200:
                data = response.json()
                if 'title_fr' in data and 'title_en' in data:
                    self.log_test("Get Blog Post by Slug", True, f"Retrieved post: {data['title_fr']}")
                    return True
                else:
                    self.log_test("Get Blog Post by Slug", False, "Missing post data")
                    return False
            else:
                self.log_test("Get Blog Post by Slug", False, f"Status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Get Blog Post by Slug", False, str(e))
            return False

    def test_blog_post_delete(self, post_id):
        """Test deleting a blog post"""
        try:
            response = self.session.delete(f"{self.base_url}/api/blog/posts/{post_id}")
            
            if response.status_code == 200:
                self.log_test("Delete Blog Post", True, f"Deleted post ID: {post_id}")
                return True
            else:
                self.log_test("Delete Blog Post", False, f"Status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Delete Blog Post", False, str(e))
            return False

    def test_testimonials_get(self):
        """Test getting testimonials"""
        try:
            response = self.session.get(f"{self.base_url}/api/testimonials")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Testimonials", True, f"Retrieved {len(data)} testimonials")
                return data
            else:
                self.log_test("Get Testimonials", False, f"Status {response.status_code}")
                return []
                
        except Exception as e:
            self.log_test("Get Testimonials", False, str(e))
            return []

    def test_testimonial_create(self):
        """Test creating a testimonial"""
        try:
            test_testimonial = {
                "name": "Marie Dupont",
                "text_fr": "Sophie m'a beaucoup aidée dans mon développement personnel.",
                "text_en": "Sophie helped me a lot in my personal development.",
                "rating": 5,
                "photo": "https://example.com/marie.jpg"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/testimonials",
                json=test_testimonial,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'id' in data and 'name' in data:
                    self.log_test("Create Testimonial", True, f"Created testimonial for: {data['name']}")
                    return data['id']
                else:
                    self.log_test("Create Testimonial", False, "Missing testimonial ID in response")
                    return None
            else:
                self.log_test("Create Testimonial", False, f"Status {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Create Testimonial", False, str(e))
            return None

    def test_testimonial_delete(self, testimonial_id):
        """Test deleting a testimonial"""
        try:
            response = self.session.delete(f"{self.base_url}/api/testimonials/{testimonial_id}")
            
            if response.status_code == 200:
                self.log_test("Delete Testimonial", True, f"Deleted testimonial ID: {testimonial_id}")
                return True
            else:
                self.log_test("Delete Testimonial", False, f"Status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Delete Testimonial", False, str(e))
            return False

    def test_contact_submit(self):
        """Test contact form submission"""
        try:
            test_contact = {
                "name": "Jean Test",
                "email": "jean.test@example.com",
                "phone": "+33123456789",
                "subject": "Test de contact",
                "message": "Ceci est un message de test pour vérifier le formulaire de contact."
            }
            
            response = self.session.post(
                f"{self.base_url}/api/contact",
                json=test_contact,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data:
                    self.log_test("Submit Contact Form", True, "Contact form submitted successfully")
                    return True
                else:
                    self.log_test("Submit Contact Form", False, "Missing success message")
                    return False
            else:
                self.log_test("Submit Contact Form", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Submit Contact Form", False, str(e))
            return False

    def test_contact_requests_get(self):
        """Test getting contact requests (admin only)"""
        try:
            response = self.session.get(f"{self.base_url}/api/contact/requests")
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Get Contact Requests", True, f"Retrieved {len(data)} contact requests")
                return data
            else:
                self.log_test("Get Contact Requests", False, f"Status {response.status_code}")
                return []
                
        except Exception as e:
            self.log_test("Get Contact Requests", False, str(e))
            return []

    def test_auth_logout(self):
        """Test logout"""
        try:
            response = self.session.post(f"{self.base_url}/api/auth/logout")
            
            if response.status_code == 200:
                self.log_test("Logout", True, "Successfully logged out")
                return True
            else:
                self.log_test("Logout", False, f"Status {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Logout", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Sophie Lamour Coaching API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)

        # Test authentication flow
        if not self.test_auth_login():
            print("❌ Authentication failed - stopping tests")
            return False

        self.test_auth_me()

        # Test blog functionality
        blog_posts = self.test_blog_posts_get()
        created_post_id = self.test_blog_post_create()
        
        if created_post_id:
            # Test getting the created post by slug
            self.test_blog_post_get_by_slug(created_post_id)
            # Clean up - delete the test post
            self.test_blog_post_delete(created_post_id)

        # Test testimonials functionality
        testimonials = self.test_testimonials_get()
        created_testimonial_id = self.test_testimonial_create()
        
        if created_testimonial_id:
            # Clean up - delete the test testimonial
            self.test_testimonial_delete(created_testimonial_id)

        # Test contact functionality
        self.test_contact_submit()
        self.test_contact_requests_get()

        # Test logout
        self.test_auth_logout()

        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = SophieCoachingAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
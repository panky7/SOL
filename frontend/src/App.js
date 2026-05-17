import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServicePersonnel from './pages/ServicePersonnel';
import ServiceProfessionnel from './pages/ServiceProfessionnel';
import ServiceParentalite from './pages/ServiceParentalite';
import ServiceHomeOrganising from './pages/ServiceHomeOrganising';
import ServiceIkigai from './pages/ServiceIkigai';
import ServiceArtTherapie from './pages/ServiceArtTherapie';
import ServiceYogaDuRire from './pages/ServiceYogaDuRire';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BlogEditor from './pages/BlogEditor';
import TestimonialEditor from './pages/TestimonialEditor';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="App">
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/new" element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/edit/:postId" element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                } />
                <Route path="/admin/testimonials/new" element={
                  <ProtectedRoute>
                    <TestimonialEditor />
                  </ProtectedRoute>
                } />
                <Route path="/admin/testimonials/edit/:testimonialId" element={
                  <ProtectedRoute>
                    <TestimonialEditor />
                  </ProtectedRoute>
                } />
                <Route path="/*" element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/qui-suis-je" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/personnel" element={<ServicePersonnel />} />
                        <Route path="/services/professionnel" element={<ServiceProfessionnel />} />
                        <Route path="/services/parentalite" element={<ServiceParentalite />} />
                        <Route path="/services/home-organising" element={<ServiceHomeOrganising />} />
                        <Route path="/services/ikigai" element={<ServiceIkigai />} />
                        <Route path="/services/art-therapie" element={<ServiceArtTherapie />} />
                        <Route path="/services/yoga-du-rire" element={<ServiceYogaDuRire />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/temoignages" element={<Testimonials />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                      </Routes>
                    </main>
                    <Footer />
                    <WhatsAppButton />
                  </>
                } />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;

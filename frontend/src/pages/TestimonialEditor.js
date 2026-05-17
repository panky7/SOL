import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const TestimonialEditor = () => {
  const navigate = useNavigate();
  const { testimonialId } = useParams();
  const isEditing = Boolean(testimonialId);

  const [formData, setFormData] = useState({
    name: '',
    text_fr: '',
    text_en: '',
    rating: 5,
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const fetchTestimonial = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/testimonials`, { withCredentials: true });
      const testimonial = data.find(t => t.id === testimonialId);
      if (testimonial) {
        setFormData({
          name: testimonial.name || '',
          text_fr: testimonial.text_fr || '',
          text_en: testimonial.text_en || '',
          rating: testimonial.rating || 5,
          photo: testimonial.photo || ''
        });
      } else {
        setError("Temoignage non trouve");
      }
    } catch (err) {
      setError("Erreur lors du chargement du temoignage");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'rating' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/testimonials/${testimonialId}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${API_URL}/api/testimonials`, formData, { withCredentials: true });
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || (isEditing ? "Erreur lors de la mise a jour" : "Erreur lors de la creation"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#CAF0F8] flex items-center justify-center">
        <p className="text-[#023E8A]">Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "Modifier le temoignage - Admin" : "Nouveau temoignage - Admin"}</title>
      </Helmet>

      <div className="min-h-screen bg-[#CAF0F8] py-12 px-6" data-testid="testimonial-editor">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-[#48CAE4] hover:text-[#0077B6] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)]">
            <h1 className="text-3xl font-serif text-[#03045E] mb-8">
              {isEditing ? "Modifier le temoignage" : "Nouveau temoignage"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Nom du client *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="testimonial-name-input"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Temoignage (Francais) *</label>
                <textarea
                  name="text_fr"
                  value={formData.text_fr}
                  onChange={handleChange}
                  required
                  rows={5}
                  data-testid="testimonial-text-fr-input"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Testimonial (English) *</label>
                <textarea
                  name="text_en"
                  value={formData.text_en}
                  onChange={handleChange}
                  required
                  rows={5}
                  data-testid="testimonial-text-en-input"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">Evaluation *</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    data-testid="testimonial-rating-select"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  >
                    <option value={5}>5 etoiles</option>
                    <option value={4}>4 etoiles</option>
                    <option value={3}>3 etoiles</option>
                    <option value={2}>2 etoiles</option>
                    <option value={1}>1 etoile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">Photo (URL)</label>
                  <input
                    type="url"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    data-testid="testimonial-photo-input"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl" data-testid="testimonial-editor-error">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="testimonial-submit-btn"
                  className="flex-1 bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {loading
                    ? (isEditing ? 'Mise a jour...' : 'Creation...')
                    : (isEditing ? 'Mettre a jour' : 'Creer le temoignage')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-8 py-4 border border-[#ADE8F4] text-[#023E8A] hover:bg-[#CAF0F8] rounded-full transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialEditor;

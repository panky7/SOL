import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import useEmblaCarousel from 'embla-carousel-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [emblaRef] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/testimonials`);
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("T\u00e9moignages \u2013 Sophie Lamour", "Testimonials \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="testimonials-page">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
            {t('Témoignages', 'Testimonials')}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-3xl mx-auto">
            {t(
              'Découvrez les expériences de ceux qui ont fait confiance à mon accompagnement.',
              'Discover the experiences of those who trusted my support.'
            )}
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center text-[#023E8A]">{t('Aucun témoignage pour le moment.', 'No testimonials yet.')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)] flex flex-col h-full justify-between" data-testid={`testimonial-${idx}`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-6xl font-serif text-[#0077B6] leading-none">“</div>
                    {testimonial.source === 'google' && (
                      <div className="flex items-center bg-[#F8F9FA] border border-[#DADCE0] rounded-full px-3 py-1 text-xs text-[#5F6368] font-medium font-sans">
                        <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.69-5.33 3.69-8.72z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.1c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.58-2.04-6.5-4.77H1.38v3.2A11.98 11.98 0 0 0 12 24z"/>
                          <path fill="#FBBC05" d="M5.5 14.41A7.12 7.12 0 0 1 5 12c0-.85.15-1.68.41-2.41V6.39H1.38A11.99 11.99 0 0 0 0 12c0 2.07.53 4.02 1.38 5.81l4.12-3.4z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19(15.24 0 12 0 7.32 0 3.3 2.69 1.38 6.39l4.12 3.41c.92-2.73 3.48-4.77 6.5-4.77z"/>
                        </svg>
                        {t("Avis Google", "Google Review")}
                      </div>
                    )}
                  </div>
                  <p className="text-base leading-relaxed text-[#023E8A] mb-6">
                    {language === 'fr' ? testimonial.text_fr : testimonial.text_en}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#0077B6] text-xl">★</span>
                    ))}
                  </div>
                  <p className="font-semibold text-[#03045E]">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-16">
          <a
            href="https://share.google/fcIZVyu8Zu9Vyf9Kh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] text-[#3C4043] rounded-full px-6 py-3.5 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md font-sans text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.69-5.33 3.69-8.72z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.1c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.58-2.04-6.5-4.77H1.38v3.2A11.98 11.98 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.5 14.41A7.12 7.12 0 0 1 5 12c0-.85.15-1.68.41-2.41V6.39H1.38A11.99 11.99 0 0 0 0 12c0 2.07.53 4.02 1.38 5.81l4.12-3.4z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.3 2.69 1.38 6.39l4.12 3.41c.92-2.73 3.48-4.77 6.5-4.77z"/>
            </svg>
            {t("Laisser un avis sur Google", "Write a Google Review")}
          </a>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
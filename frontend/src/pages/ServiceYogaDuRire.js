import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, X } from 'lucide-react';

const yogaImages = [
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-8-scaled.jpg',
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-4-scaled.jpg',
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-7-scaled.jpg',
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-72-scaled.jpg',
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-scaled.jpg',
  'https://sophielamour.com/wp-content/uploads/2025/06/image1-9-scaled.jpg'
];

const ServiceYogaDuRire = () => {
  const { t } = useLanguage();
  const [showDiploma, setShowDiploma] = useState(false);

  return (
    <>
      <Helmet>
        <title>{t("Yoga du Rire \u2013 Sophie Lamour", "Laughter Yoga \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {t("Yoga Du Rire", "Laughter Yoga")}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t("Liberez votre joie de vivre", "Release Your Joy of Living")}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={yogaImages[0]}
              alt="Yoga Du Rire"
              className="w-full h-80 object-cover object-top"
            />
          </div>

          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Vous avez besoin d'un boost de vitalite ?", "Do you need a vitality boost?")}
              </h3>
              <p>
                {t(
                  "Le rire est un remede naturel pour renforcer votre energie et retrouver une sensation de legerete.",
                  "Laughter is a natural remedy to boost your energy and regain a feeling of lightness."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Vous vous sentez stresse(e) ou tendu(e) ?", "Do you feel stressed or tense?")}
              </h3>
              <p>
                {t(
                  "Grace au yoga du rire, apprenez a relacher vos tensions et a vivre pleinement le moment present.",
                  "Through laughter yoga, learn to release your tensions and fully live in the present moment."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Vous souhaitez apporter une energie gagnante a votre entreprise ?", "Want to bring winning energy to your company?")}
              </h3>
              <p>
                {t(
                  "Renforce la cohesion d'equipe, accroit les performances, la motivation et une meilleure communication des collaborateurs.",
                  "Strengthens team cohesion, increases performance, motivation and better communication among employees."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-10">
              {yogaImages.slice(1).map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt={`Yoga Du Rire ${idx + 2}`}
                    className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="bg-[#F0F9FF] border border-[#ADE8F4] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#03045E] mb-3">
                {t("Les bienfaits du yoga du rire", "Benefits of Laughter Yoga")}
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Reduction du stress et de l'anxiete", "Reduction of stress and anxiety")}</li>
                <li>{t("Renforcement du systeme immunitaire", "Strengthened immune system")}</li>
                <li>{t("Liberation d'endorphines (hormones du bonheur)", "Release of endorphins (happiness hormones)")}</li>
                <li>{t("Amelioration de la qualite du sommeil", "Improved sleep quality")}</li>
                <li>{t("Cohesion d'equipe en entreprise", "Team cohesion in business")}</li>
                <li>{t("Sensation de legerete et de bien-etre", "Feeling of lightness and well-being")}</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowDiploma(true)}
            data-testid="certification-badge-yoga-du-rire"
            className="inline-flex items-center gap-3 bg-[#CAF0F8] border border-[#ADE8F4] rounded-2xl px-5 py-3 mb-8 hover:bg-[#ADE8F4] transition-colors duration-300 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-[#0077B6] flex-shrink-0" />
            <span className="text-sm font-medium text-[#03045E]">
              {t("Certifiée Yoga du Rire", "Certified Laughter Yoga Instructor")}
            </span>
            <span className="text-xs text-[#0077B6] underline flex-shrink-0">
              {t("Voir", "View")}
            </span>
          </button>

          {showDiploma && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowDiploma(false)} data-testid="diploma-lightbox-yoga">
              <button onClick={() => setShowDiploma(false)} className="absolute top-6 right-6 text-white hover:text-[#48CAE4] transition-colors z-10"><X size={32} /></button>
              <img src="/diploma_yoga_du_rire.jpg" alt="Diploma Yoga du Rire" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          )}

          <div>
            <Link
              to="/contact"
              data-testid="service-yoga-du-rire-cta"
              className="inline-block bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
            >
              {t("Me contacter", "Contact Me")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceYogaDuRire;

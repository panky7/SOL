import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, X } from 'lucide-react';

const ServiceIkigai = () => {
  const { t } = useLanguage();
  const [showDiploma, setShowDiploma] = useState(false);

  return (
    <>
      <Helmet>
        <title>{t("Ikiga\u00ef \u2013 Sophie Lamour", "Ikigai \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            Ikigai
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t("Trouvez votre raison d'etre", "Find Your Reason for Being")}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/03/DALL%C2%B7E-2025-03-01-07.56.39-A-symbolic-and-artistic-representation-of-the-concept-of-Ikigai.-A-large-ancient-tree-with-deep-roots-and-expansive-branches-stands-in-the-center-of-.webp"
              alt="Ikigai"
              className="w-full h-80 object-cover object-top"
            />
          </div>

          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <p>
              {t(
                "L'Ikigai est un concept japonais qui signifie \"raison d'etre\". Il se situe a l'intersection de quatre dimensions fondamentales : ce que vous aimez, ce dans quoi vous excellez, ce dont le monde a besoin, et ce pour quoi vous pouvez etre remunere.",
                "Ikigai is a Japanese concept meaning \"reason for being\". It lies at the intersection of four fundamental dimensions: what you love, what you are good at, what the world needs, and what you can be paid for."
              )}
            </p>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Ce que vous aimez (Passion)", "What You Love (Passion)")}
              </h3>
              <p>
                {t(
                  "Ensemble, nous explorerons vos passions profondes, ces activites qui vous font perdre la notion du temps et qui nourrissent votre ame. Retrouver ce qui vous anime est la premiere etape vers une vie epanouie.",
                  "Together, we will explore your deep passions, those activities that make you lose track of time and nourish your soul. Rediscovering what drives you is the first step towards a fulfilling life."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Ce dans quoi vous excellez (Vocation)", "What You Are Good At (Vocation)")}
              </h3>
              <p>
                {t(
                  "Identifiez vos talents uniques et vos competences naturelles. Souvent, nous sous-estimons nos propres forces. Je vous aide a les reconnaitre et a les valoriser pleinement.",
                  "Identify your unique talents and natural skills. Often, we underestimate our own strengths. I help you recognize and fully value them."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Ce dont le monde a besoin (Mission)", "What the World Needs (Mission)")}
              </h3>
              <p>
                {t(
                  "Decouvrez comment vos passions et talents peuvent servir les autres et contribuer positivement au monde. Trouver sa mission donne un sens profond a chaque journee.",
                  "Discover how your passions and talents can serve others and positively contribute to the world. Finding your mission gives deep meaning to every day."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Ce pour quoi vous pouvez etre remunere (Profession)", "What You Can Be Paid For (Profession)")}
              </h3>
              <p>
                {t(
                  "Alignez votre vie professionnelle avec vos valeurs et aspirations. L'objectif est de trouver cet equilibre ou votre travail n'est plus une contrainte mais une source de joie et d'accomplissement.",
                  "Align your professional life with your values and aspirations. The goal is to find that balance where your work is no longer a constraint but a source of joy and fulfillment."
                )}
              </p>
            </div>

            <div className="bg-[#F0F9FF] border border-[#ADE8F4] rounded-2xl p-8 my-8">
              <h3 className="text-xl font-semibold text-[#03045E] mb-3">
                {t("Comment se deroule l'accompagnement ?", "How Does the Coaching Work?")}
              </h3>
              <p>
                {t(
                  "A travers des seances personnalisees, nous utilisons des exercices de reflexion, des outils de coaching et des techniques de visualisation pour vous aider a clarifier votre Ikigai. Chaque parcours est unique et adapte a votre rythme.",
                  "Through personalized sessions, we use reflection exercises, coaching tools and visualization techniques to help you clarify your Ikigai. Each journey is unique and adapted to your pace."
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDiploma(true)}
            data-testid="certification-badge-ikigai"
            className="inline-flex items-center gap-3 bg-[#CAF0F8] border border-[#ADE8F4] rounded-2xl px-5 py-3 mb-8 hover:bg-[#ADE8F4] transition-colors duration-300 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-[#0077B6] flex-shrink-0" />
            <span className="text-sm font-medium text-[#03045E]">
              {t("Certifiée Accompagnement Ikigai", "Certified Ikigai Coach")}
            </span>
            <span className="text-xs text-[#0077B6] underline flex-shrink-0">
              {t("Voir", "View")}
            </span>
          </button>

          {showDiploma && (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowDiploma(false)} data-testid="diploma-lightbox-ikigai">
              <button onClick={() => setShowDiploma(false)} className="absolute top-6 right-6 text-white hover:text-[#48CAE4] transition-colors z-10"><X size={32} /></button>
              <img src="/diploma_ikigai.jpg" alt="Diploma Ikigai" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
          )}

          <div>
            <Link
              to="/contact"
              data-testid="service-ikigai-cta"
              className="inline-block bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
            >
              {t("Prendre contact", "Get in Touch")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceIkigai;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const ServicePersonnel = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Accompagnement personnel \u2013 Sophie Lamour", "Personal Coaching \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {t('Accompagnement Personnel', 'Personal Coaching')}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t('(Re)trouver votre équilibre', 'Rediscover Your Balance')}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770.jpg"
              alt="Accompagnement Personnel"
              className="w-full h-80 object-cover object-top"
            />
          </div>
          
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous sentez-vous perdu(e) dans votre vie ?', 'Do you feel lost in your life?')}</h3>
              <p>{t('Nous explorerons ensemble ce qui vous fait vibrer, vos passions oubliées ou mises de côté, et les chemins qui peuvent vous permettre de redonner un véritable sens à votre existence.', 'Together we will explore what makes you vibrate, your forgotten or set aside passions, and the paths that can allow you to give real meaning to your existence.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Une nouvelle étape s’impose-t-elle à vous ?', 'Is a new stage necessary for you?')}</h3>
              <p>{t('Que ce soit un changement volontaire ou une transition imposée, je suis à vos côtés pour vous aider à surmonter vos doutes et à embrasser cette nouvelle phase avec confiance et sérénité.', 'Whether it is a voluntary change or an imposed transition, I am by your side to help you overcome your doubts and embrace this new phase with confidence and serenity.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous sentez-vous épuisé(e) ou surmené(e) ?', 'Do you feel exhausted or overwhelmed?')}</h3>
              <p>{t('Le stress et les émotions accumulées peuvent être de véritables freins. Ensemble, nous trouverons des moyens de vous apaiser, de gérer vos émotions et de retrouver votre énergie intérieure.', 'Stress and accumulated emotions can be real obstacles. Together we will find ways to soothe you, manage your emotions and regain your inner energy.')}</p>
            </div>
          </div>

          <Link
            to="/contact"
            data-testid="service-cta-button"
            className="inline-block bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
          >
            {t("Prendre contact", "Get in Touch")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicePersonnel;
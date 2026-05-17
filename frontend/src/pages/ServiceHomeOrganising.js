import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const ServiceHomeOrganising = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Home Organising \u2013 Sophie Lamour", "Home Organizing \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            Home Organising
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t('Créez un environnement qui vous apaise', 'Create an Environment That Soothes You')}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/02/DALL%C2%B7E-2025-02-20-19.17.12-Une-photo-ultra-realiste-de-la-meme-piece-mais-parfaitement-rangee-et-organisee.-Les-vetements-sont-plies-et-ranges-dans-une-armoire-bien-ordonnee-l.webp"
              alt="Home Organising"
              className="w-full h-80 object-cover object-top"
            />
          </div>
          
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Votre maison vous semble encombrée ou oppressante ?', 'Does your home feel cluttered or oppressive?')}</h3>
              <p>{t('En simplifiant votre espace, nous libérerons non seulement de la place dans votre foyer, mais aussi dans votre esprit.', 'By simplifying your space, we will free up not only space in your home, but also in your mind.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous avez besoin d’un cadre de vie plus harmonieux ?', 'Do you need a more harmonious living environment?')}</h3>
              <p>{t('Transformez votre maison en un espace qui vous ressemble, où il fait bon vivre et se ressourcer.', 'Transform your home into a space that suits you, where it is good to live and recharge.')}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">{t('Vous voulez aller à l’essentiel ?', 'Do you want to get to the essentials?')}</h3>
              <p>{t('En éliminant le superflu, vous vous concentrerez sur ce qui compte vraiment pour vous et votre famille.', 'By eliminating the superfluous, you will focus on what really matters to you and your family.')}</p>
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

export default ServiceHomeOrganising;
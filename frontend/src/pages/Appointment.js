import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const Appointment = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Rendez-vous - Sophie Lamour", "Appointment - Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="appointment-page">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
              {t('Prendre rendez-vous', 'Book Appointment')}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#023E8A]">
              {t(
                'Sélectionnez un créneau qui vous convient pour commencer votre parcours de transformation.',
                'Select a time slot that suits you to begin your transformation journey.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-2 shadow-[0_8px_32px_rgba(44,44,42,0.04)]" data-testid="calendly-embed">
            <div className="calendly-inline-widget" data-url="https://calendly.com/sophielamour" style={{ minWidth: '320px', height: '700px' }} />
            <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
          </div>

          <div className="mt-12 text-center text-[#023E8A]">
            <p className="mb-4">
              {t(
                'Vous ne trouvez pas de créneau qui vous convient?',
                'Can\'t find a suitable time slot?'
              )}
            </p>
            <a href="/contact" className="text-[#0077B6] hover:text-[#C48A7E] font-medium">
              {t('Contactez-moi directement', 'Contact me directly')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Appointment;
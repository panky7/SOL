import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const serviceImages = {
  personnel: 'https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770.jpg',
  professionnel: 'https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_08_04.png',
  parentalite: 'https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_42_16.png',
  homeOrganising: 'https://sophielamour.com/wp-content/uploads/2025/02/DALL%C2%B7E-2025-02-20-19.17.12-Une-photo-ultra-realiste-de-la-meme-piece-mais-parfaitement-rangee-et-organisee.-Les-vetements-sont-plies-et-ranges-dans-une-armoire-bien-ordonnee-l.webp',
  yogaDuRire: 'https://sophielamour.com/wp-content/uploads/2025/04/ChatGPT-Image-4-avr.-2025-15_08_04.png'
};

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      title: t("Accompagnement personnel", "Personal Coaching"),
      desc: t("(Re)trouvez votre \u00e9quilibre et votre raison d\u2019\u00eatre", "Rediscover your balance and purpose"),
      link: '/services/personnel',
      image: serviceImages.personnel
    },
    {
      title: t("Accompagnement professionnel", "Professional Coaching"),
      desc: t("Construisez un avenir align\u00e9 avec vos valeurs", "Build a future aligned with your values"),
      link: '/services/professionnel',
      image: serviceImages.professionnel
    },
    {
      title: t("Accompagnement parentalit\u00e9", "Parenting Support"),
      desc: t("Grandissez ensemble en famille", "Grow together as a family"),
      link: '/services/parentalite',
      image: serviceImages.parentalite
    },
    {
      title: "Home Organising",
      desc: t("Cr\u00e9ez un environnement qui vous apaise", "Create an environment that soothes you"),
      link: '/services/home-organising',
      image: serviceImages.homeOrganising
    },
    {
      title: t("Yoga du Rire", "Laughter Yoga"),
      desc: t("Lib\u00e9rez votre joie de vivre", "Release your joy of living"),
      link: '/services/yoga-du-rire',
      image: serviceImages.yogaDuRire
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("Services \u2013 Sophie Lamour", "Services \u2013 Sophie Lamour")}</title>
        <meta name="description" content={t(
          "D\u00e9couvrez mes services\u00a0: coaching personnel, professionnel, parentalit\u00e9 et home organising.",
          "Discover my services: personal coaching, professional coaching, parenting and home organizing."
        )} />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="services-page">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
            {t("Mes services", "My Services")}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-3xl mx-auto">
            {t(
              "Un accompagnement personnalis\u00e9 pour vous aider \u00e0 atteindre vos objectifs et vivre une vie align\u00e9e avec vos valeurs.",
              "Personalized support to help you achieve your goals and live a life aligned with your values."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <Link
              key={idx}
              to={service.link}
              data-testid={`service-link-${idx}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] hover:shadow-[0_16px_48px_rgba(0,119,182,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/60 to-transparent" />
                <h2 className="absolute bottom-4 left-6 right-6 text-xl sm:text-2xl font-serif text-white leading-tight">
                  {service.title}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-base leading-relaxed text-[#023E8A] mb-4">{service.desc}</p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4] group-hover:text-[#0077B6] transition-colors">
                  {t("D\u00e9couvrir", "Learn More")} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;

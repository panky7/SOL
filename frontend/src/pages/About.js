import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { GraduationCap, User, Smile, Sparkles, X } from 'lucide-react';

const certifications = [
  {
    titleFr: "Coach en parentalité",
    titleEn: "Parenting Coach",
    image: "/diploma_coach_parentalite.jpg"
  },
  {
    titleFr: "Coach professionnel",
    titleEn: "Professional Coach",
    image: "/diploma_coach_pro.jpg"
  },
  {
    titleFr: "Accompagnement Ikigai",
    titleEn: "Ikigai Coaching",
    image: "/diploma_ikigai.jpg"
  },
  {
    titleFr: "Yoga du Rire",
    titleEn: "Laughter Yoga",
    image: "/diploma_yoga_du_rire.jpg"
  }
];

const About = () => {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState(null);

  const values = [
    {
      title: t('Bienveillance', 'Kindness'),
      desc: t('Chaque personne mérite d’être accueillie sans jugement', 'Everyone deserves to be welcomed without judgment')
    },
    {
      title: t('Authenticité', 'Authenticity'),
      desc: t('Vivre en accord avec ses valeurs et ses désirs', 'Live in accordance with your values and desires')
    },
    {
      title: t('Lâcher-prise', 'Letting Go'),
      desc: t('Libérer son énergie pour avancer sereinement', 'Release energy to move forward peacefully')
    },
    {
      title: t('Quête de sens', 'Search for Meaning'),
      desc: t('Trouver sa raison d’être', 'Find your reason for being')
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("Qui suis-je\u00a0? \u2013 Sophie Lamour", "About Me \u2013 Sophie Lamour")}</title>
        <meta name="description" content={t(
          'Découvrez mon parcours, mes valeurs et mon approche bienveillante du coaching de vie.',
          'Discover my journey, values, and caring approach to life coaching.'
        )} />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="about-hero">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
              {t('Qui suis-je?', 'About Me')}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] font-sans mb-6">
              {t(
                'Je m’appelle Sophie Lamour, et je suis profondément convaincue que chaque individu possède en lui les ressources nécessaires pour évoluer, grandir et surmonter les défis de la vie. Mais parfois, il suffit d’une main tendue ou d’un regard bienveillant pour révéler tout ce potentiel.',
                'My name is Sophie Lamour, and I am deeply convinced that every individual has within them the necessary resources to evolve, grow, and overcome life\'s challenges. But sometimes, all it takes is an outstretched hand or a caring look to reveal this potential.'
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770-891x1024.jpg"
              alt="Sophie Lamour"
              className="rounded-3xl shadow-[0_16px_48px_rgba(217,160,152,0.15)] w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#CAF0F8]" data-testid="about-journey">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-8">
            {t('Un parcours riche en expériences', 'A Journey Rich in Experiences')}
          </h2>
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A]">
            <p>
              {t(
                'Pendant plus de 20 ans, j’ai évolué dans le monde du commerce, un secteur exigeant où j’ai développé des compétences en communication, en gestion d’équipe et en relation humaine. Cependant, à force de donner sans m’écouter, j’ai moi-même traversé une période d’épuisement et de remise en question.',
                'For over 20 years, I worked in the world of commerce, a demanding sector where I developed skills in communication, team management, and human relations. However, by constantly giving without listening to myself, I went through a period of exhaustion and questioning.'
              )}
            </p>
            <p>
              {t(
                'En 2018, un événement marquant m’a contrainte à ralentir : une hospitalisation en centre de rééducation. Ce moment, aussi difficile qu’il ait été, a marqué le début d’un voyage intérieur. J’ai découvert la puissance de la pleine conscience et appris à lâcher prise face à mes douleurs physiques et émotionnelles.',
                'In 2018, a significant event forced me to slow down: hospitalization in a rehabilitation center. This moment, as difficult as it was, marked the beginning of an inner journey. I discovered the power of mindfulness and learned to let go of my physical and emotional pain.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="about-coaching">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-8">
            {t('Un cheminement vers le coaching', 'A Path to Coaching')}
          </h2>
          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A]">
            <p>
              {t(
                'Poussée par l’envie d’apporter aux autres ce que j’avais appris, j’ai entrepris une reconversion en 2020. Je me suis formée au coaching, une discipline qui me permet de guider chaque personne dans sa quête de sens et de bien-être. Parallèlement, je me suis plongée dans la philosophie de l’Ikigaï, cette approche japonaise qui aide à trouver sa raison d’être.',
                'Driven by the desire to bring to others what I had learned, I undertook a career change in 2020. I trained in coaching, a discipline that allows me to guide each person in their quest for meaning and well-being. At the same time, I immersed myself in the philosophy of Ikigai, this Japanese approach that helps find one\'s reason for being.'
              )}
            </p>
            <p>
              {t(
                'Toujours en quête de nouvelles manières d’accompagner, je me suis également certifiée en tant qu’animatrice de yoga du rire. Cet outil, à la fois ludique et puissant, offre une opportunité unique de lâcher prise, de se recentrer et de cultiver la joie.',
                'Always seeking new ways to support others, I also became certified as a laughter yoga instructor. This tool, both playful and powerful, offers a unique opportunity to let go, refocus, and cultivate joy.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#48CAE4]/10" data-testid="about-certifications">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4 text-center">
            {t("Mes certifications", "My Certifications")}
          </h2>
          <p className="text-base lg:text-lg text-[#023E8A] text-center mb-12 max-w-2xl mx-auto">
            {t(
              "Des formations reconnues pour un accompagnement professionnel et bienveillant.",
              "Recognized training for professional and caring support."
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {certifications.map((cert, idx) => (
              <motion.button
                key={idx}
                onClick={() => setLightboxImage(cert.image)}
                data-testid={`certification-card-${idx}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(44,44,42,0.04)] hover:shadow-[0_12px_40px_rgba(0,119,182,0.12)] transition-all duration-300 text-left cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F0F9FF]">
                  <img
                    src={cert.image}
                    alt={t(cert.titleFr, cert.titleEn)}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-[#0077B6] flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-[#03045E] leading-snug">{t(cert.titleFr, cert.titleEn)}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          {lightboxImage && (
            <div
              className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
              data-testid="diploma-lightbox"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-6 right-6 text-white hover:text-[#48CAE4] transition-colors z-10"
                data-testid="lightbox-close"
              >
                <X size={32} />
              </button>
              <img
                src={lightboxImage}
                alt="Diploma"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="about-values">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-12 text-center">
            {t('Des valeurs qui m’animent', 'Values That Drive Me')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)]">
                <h3 className="text-2xl font-serif text-[#03045E] mb-3">{value.title}</h3>
                <p className="text-base lg:text-lg leading-relaxed text-[#023E8A]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
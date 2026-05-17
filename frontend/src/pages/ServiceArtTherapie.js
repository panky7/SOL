import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const ServiceArtTherapie = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Art-th\u00e9rapie \u2013 Sophie Lamour", "Art Therapy \u2013 Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {t("Art-Therapie", "Art Therapy")}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#03045E] mb-6">
            {t("Liberez vos emotions par la creativite", "Release Your Emotions Through Creativity")}
          </h2>

          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/03/DALL%C2%B7E-2025-03-01-07.57.13-A-symbolic-and-artistic-representation-of-Art-Therapy.-A-peaceful-artist-sits-in-a-bright-open-studio-surrounded-by-paintings-sculptures-and-sketch.webp"
              alt="Art-Therapie"
              className="w-full h-80 object-cover object-top"
            />
          </div>

          <div className="space-y-6 text-base lg:text-lg leading-relaxed text-[#023E8A] mb-12">
            <p>
              {t(
                "L'art-therapie est une approche therapeutique qui utilise le processus creatif pour ameliorer le bien-etre physique, mental et emotionnel. Pas besoin d'etre artiste : l'important n'est pas le resultat, mais le chemin parcouru.",
                "Art therapy is a therapeutic approach that uses the creative process to improve physical, mental and emotional well-being. No need to be an artist: what matters is not the result, but the journey."
              )}
            </p>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Pourquoi l'art-therapie ?", "Why Art Therapy?")}
              </h3>
              <p>
                {t(
                  "Certaines emotions sont difficiles a exprimer avec des mots. L'art offre un langage alternatif, un espace sur ou l'on peut deposer ce que l'on porte en soi sans jugement. Peinture, collage, modelage, ecriture creative... chaque medium devient un pont entre votre monde interieur et l'expression de soi.",
                  "Some emotions are difficult to express with words. Art offers an alternative language, a safe space where you can express what you carry within without judgment. Painting, collage, modeling, creative writing... each medium becomes a bridge between your inner world and self-expression."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Les bienfaits", "The Benefits")}
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t("Reduction du stress et de l'anxiete", "Reduction of stress and anxiety")}</li>
                <li>{t("Meilleure gestion des emotions", "Better emotion management")}</li>
                <li>{t("Renforcement de l'estime de soi", "Strengthened self-esteem")}</li>
                <li>{t("Developpement de la creativite et de l'intuition", "Development of creativity and intuition")}</li>
                <li>{t("Prise de conscience de schémas inconscients", "Awareness of unconscious patterns")}</li>
                <li>{t("Apaisement interieur et lacher-prise", "Inner peace and letting go")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#03045E] mb-2">
                {t("Pour qui ?", "Who Is It For?")}
              </h3>
              <p>
                {t(
                  "L'art-therapie s'adresse a tous, quel que soit votre age ou votre niveau artistique. Elle est particulierement benefique pour les personnes traversant une periode de transition, de deuil, de burn-out, ou simplement en quete de mieux se connaitre.",
                  "Art therapy is for everyone, regardless of your age or artistic level. It is particularly beneficial for people going through a period of transition, grief, burnout, or simply seeking to know themselves better."
                )}
              </p>
            </div>

            <div className="bg-[#F0F9FF] border border-[#ADE8F4] rounded-2xl p-8 my-8">
              <h3 className="text-xl font-semibold text-[#03045E] mb-3">
                {t("Deroulement d'une seance", "How a Session Works")}
              </h3>
              <p>
                {t(
                  "Chaque seance commence par un temps d'echange pour identifier vos besoins du moment. Puis, je vous propose une activite creative adaptee. Vous etes guide(e) tout au long du processus dans un cadre bienveillant et confidentiel. La seance se termine par un temps de partage sur votre experience.",
                  "Each session begins with a discussion to identify your current needs. Then, I suggest a suitable creative activity. You are guided throughout the process in a caring and confidential setting. The session ends with a moment of sharing about your experience."
                )}
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            data-testid="service-art-therapie-cta"
            className="inline-block bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
          >
            {t("Prendre contact", "Get in Touch")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServiceArtTherapie;

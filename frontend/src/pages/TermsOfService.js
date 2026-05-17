import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Conditions générales – Sophie Lamour", "Terms of Service – Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="terms-of-service-page">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-10">
            {t("Conditions générales d'utilisation", "Terms of Service")}
          </h1>

          <div className="space-y-8 text-base lg:text-lg leading-relaxed text-[#023E8A]">
            <p className="text-sm text-[#023E8A]/70">
              {t("Dernière mise à jour : avril 2026", "Last updated: April 2026")}
            </p>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("1. Présentation du site", "1. Website Overview")}
              </h2>
              <p>
                {t(
                  "Le site sophielamour.com est édité par Sophie Lamour, coach de vie certifiée, domiciliée à Château-Landon 77570, France. Il a pour objet de présenter ses services de coaching et de permettre la prise de contact.",
                  "The website sophielamour.com is published by Sophie Lamour, certified life coach, based in Château-Landon 77570, France. Its purpose is to present her coaching services and enable contact."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("2. Acceptation des conditions", "2. Acceptance of Terms")}
              </h2>
              <p>
                {t(
                  "L'utilisation de ce site implique l'acceptation pleine et entière des présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.",
                  "Use of this site implies full acceptance of these terms of service. If you do not accept these terms, please do not use this site."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("3. Services proposés", "3. Services Offered")}
              </h2>
              <p>
                {t(
                  "Sophie Lamour propose des prestations de coaching de vie, accompagnement parental, accompagnement professionnel, Ikigai, yoga du rire et home organising. Les modalités, tarifs et conditions de chaque prestation sont communiqués sur demande lors de la prise de contact.",
                  "Sophie Lamour offers life coaching, parenting support, professional coaching, Ikigai, laughter yoga, and home organizing services. The terms, rates, and conditions for each service are communicated upon request during initial contact."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("4. Propriété intellectuelle", "4. Intellectual Property")}
              </h2>
              <p>
                {t(
                  "L'ensemble des contenus de ce site (textes, images, logo, graphismes) sont la propriété exclusive de Sophie Lamour ou de leurs auteurs respectifs. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.",
                  "All content on this site (text, images, logo, graphics) is the exclusive property of Sophie Lamour or their respective authors. Any reproduction, distribution, or use without prior authorization is strictly prohibited."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("5. Limitation de responsabilité", "5. Limitation of Liability")}
              </h2>
              <p>
                {t(
                  "Les informations fournies sur ce site le sont à titre indicatif et ne constituent pas un avis médical, psychologique ou juridique. Sophie Lamour ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de ce site.",
                  "The information provided on this site is for informational purposes only and does not constitute medical, psychological, or legal advice. Sophie Lamour cannot be held liable for any direct or indirect damages resulting from the use of this site."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("6. Protection des données", "6. Data Protection")}
              </h2>
              <p>
                {t(
                  "La collecte et le traitement des données personnelles sont régis par notre Politique de confidentialité, accessible à l'adresse /privacy. Conformément au RGPD, vous disposez de droits sur vos données personnelles.",
                  "The collection and processing of personal data is governed by our Privacy Policy, accessible at /privacy. In accordance with GDPR, you have rights regarding your personal data."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("7. Liens externes", "7. External Links")}
              </h2>
              <p>
                {t(
                  "Ce site peut contenir des liens vers des sites tiers. Sophie Lamour n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
                  "This site may contain links to third-party websites. Sophie Lamour has no control over these sites and disclaims all responsibility for their content."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("8. Droit applicable", "8. Applicable Law")}
              </h2>
              <p>
                {t(
                  "Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du domicile de Sophie Lamour.",
                  "These terms are governed by French law. In case of dispute, the competent courts will be those of Sophie Lamour's place of residence."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("9. Contact", "9. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question relative aux présentes conditions, vous pouvez nous contacter à : contact@sophielamour.com",
                  "For any questions regarding these terms, you can contact us at: contact@sophielamour.com"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfService;

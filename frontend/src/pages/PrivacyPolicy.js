import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t("Politique de confidentialité – Sophie Lamour", "Privacy Policy – Sophie Lamour")}</title>
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="privacy-policy-page">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-10">
            {t("Politique de confidentialité", "Privacy Policy")}
          </h1>

          <div className="space-y-8 text-base lg:text-lg leading-relaxed text-[#023E8A]">
            <p className="text-sm text-[#023E8A]/70">
              {t("Dernière mise à jour : avril 2026", "Last updated: April 2026")}
            </p>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("1. Responsable du traitement", "1. Data Controller")}
              </h2>
              <p>
                {t(
                  "Sophie Lamour, coach de vie, domiciliée à Château-Landon 77570, France. Contact : contact@sophielamour.com",
                  "Sophie Lamour, life coach, based in Château-Landon 77570, France. Contact: contact@sophielamour.com"
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("2. Données collectées", "2. Data Collected")}
              </h2>
              <p>
                {t(
                  "Nous collectons les données personnelles que vous nous fournissez volontairement via notre formulaire de contact : nom, prénom, adresse e-mail, numéro de téléphone, et le contenu de votre message. Nous ne collectons aucune donnée de navigation sensible ni cookie de suivi publicitaire.",
                  "We collect personal data that you voluntarily provide through our contact form: first name, last name, email address, phone number, and your message content. We do not collect any sensitive browsing data or advertising tracking cookies."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("3. Finalités du traitement", "3. Purpose of Processing")}
              </h2>
              <p>
                {t(
                  "Vos données sont utilisées exclusivement pour : répondre à vos demandes de contact, vous proposer un accompagnement personnalisé, et gérer la relation client. Elles ne sont jamais utilisées à des fins de prospection commerciale non sollicitée.",
                  "Your data is used exclusively to: respond to your contact requests, offer personalized coaching, and manage the client relationship. It is never used for unsolicited commercial prospecting."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("4. Base légale", "4. Legal Basis")}
              </h2>
              <p>
                {t(
                  "Le traitement de vos données repose sur votre consentement explicite, recueilli via la case à cocher du formulaire de contact, conformément au Règlement Général sur la Protection des Données (RGPD).",
                  "The processing of your data is based on your explicit consent, collected through the contact form checkbox, in accordance with the General Data Protection Regulation (GDPR)."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("5. Durée de conservation", "5. Data Retention")}
              </h2>
              <p>
                {t(
                  "Vos données personnelles sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec nous, sauf obligation légale contraire.",
                  "Your personal data is retained for a maximum of 3 years from your last interaction with us, unless a legal obligation requires otherwise."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("6. Partage des données", "6. Data Sharing")}
              </h2>
              <p>
                {t(
                  "Vos données ne sont transmises à aucun tiers. Elles sont hébergées sur des serveurs sécurisés et ne font l'objet d'aucun transfert en dehors de l'Union européenne.",
                  "Your data is not shared with any third parties. It is hosted on secure servers and is not transferred outside the European Union."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("7. Vos droits", "7. Your Rights")}
              </h2>
              <p>
                {t(
                  "Conformément au RGPD, vous disposez des droits suivants : droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition. Pour exercer ces droits, contactez-nous à contact@sophielamour.com.",
                  "In accordance with the GDPR, you have the following rights: right of access, rectification, erasure, restriction of processing, data portability, and objection. To exercise these rights, contact us at contact@sophielamour.com."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("8. Cookies", "8. Cookies")}
              </h2>
              <p>
                {t(
                  "Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi publicitaire ou analytique n'est utilisé.",
                  "This site only uses technical cookies necessary for its proper functioning. No advertising or analytics tracking cookies are used."
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-[#03045E] mb-3">
                {t("9. Contact", "9. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question relative à cette politique, vous pouvez nous contacter à : contact@sophielamour.com ou par courrier à Château-Landon 77570, France.",
                  "For any questions regarding this policy, you can contact us at: contact@sophielamour.com or by mail at Château-Landon 77570, France."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;

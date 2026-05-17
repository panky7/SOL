import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Linkedin, Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-[#03045E] to-[#023E8A] text-white py-20 lg:py-32" data-testid="main-footer">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="mb-4 inline-block" data-testid="footer-logo-link">
                <img
                  src="/sophie_logo_full.png"
                  alt="Sophie Lamour Coaching"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain"
                  data-testid="footer-logo"
                />
            </Link>
            <p className="text-white/80 leading-relaxed text-center md:text-left">
              {t(
                "Accompagnement personnalis\u00e9 en d\u00e9veloppement personnel et coaching de vie.",
                "Personalized support in personal development and life coaching."
              )}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">
              {t("Liens rapides", "Quick Links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/qui-suis-je" className="text-white/80 hover:text-[#48CAE4] transition-colors">
                  {t("Qui suis-je\u00a0?", "About Me")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/80 hover:text-[#48CAE4] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-[#48CAE4] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-[#48CAE4] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/80">
                <Mail size={18} />
                <a href="mailto:contact@sophielamour.com" className="hover:text-[#48CAE4] transition-colors">
                  contact@sophielamour.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone size={18} />
                <a href="tel:+33689844778" className="hover:text-[#48CAE4] transition-colors">
                  +33 6 89 84 47 78
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <MessageCircle size={18} />
                <a
                  href="https://wa.me/33689844778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#48CAE4] transition-colors"
                  data-testid="whatsapp-footer"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <MapPin size={18} />
                <a
                  href="https://www.google.com/maps/place/Ch%C3%A2teau-Landon,+77570+France/@48.1522,2.7006,13z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#48CAE4] transition-colors"
                  data-testid="location-footer"
                >
                  {"Ch\u00e2teau-Landon 77570"}
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#48CAE4] transition-colors"
                data-testid="social-facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#48CAE4] transition-colors"
                data-testid="social-instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#48CAE4] transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Sophie Lamour. {t("Tous droits r\u00e9serv\u00e9s.", "All rights reserved.")}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#48CAE4] transition-colors" data-testid="footer-privacy-link">
              {t("Politique de confidentialité", "Privacy Policy")}
            </Link>
            <Link to="/terms" className="hover:text-[#48CAE4] transition-colors" data-testid="footer-terms-link">
              {t("CGU", "Terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

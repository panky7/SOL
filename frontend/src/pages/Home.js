import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Heart, Briefcase, Baby, Home as HomeIcon, Target, Palette, Smile, Leaf } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const Home = () => {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [fbSettings, setFbSettings] = useState({
    feed_style: 'juicer',
    juicer_feed_id: 'sophielamourcoaching',
    post_url_1: '',
    post_url_2: '',
    post_url_3: ''
  });
  const [emblaRef] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    fetchTestimonials();
    fetchBlogPosts();
    fetchFbSettings();
  }, []);

  const fetchFbSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/testimonials/settings/facebook`);
      setFbSettings(data);
    } catch (error) {
      console.error('Error fetching FB settings:', error);
    }
  };

  useEffect(() => {
    if (window.FB) {
      try {
        window.FB.XFBML.parse();
      } catch (e) {
        console.error("Failed to parse FB XFBML", e);
      }
    }
  }, [fbSettings]);

  useEffect(() => {
    if (window.Juicer) {
      try {
        window.Juicer.initialize();
      } catch (e) {
        console.error("Failed to initialize Juicer", e);
      }
    }
    return () => {
      if (window.Juicer) {
        try {
          window.Juicer.remove();
        } catch (e) {
          console.error("Failed to remove Juicer", e);
        }
      }
    };
  }, [fbSettings.juicer_feed_id]);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/testimonials`);
      setTestimonials(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/blog/posts?status=published`);
      setBlogPosts(data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const services = [
    {
      icon: Heart,
      title: t("Accompagnement personnel", "Personal Coaching"),
      desc: t("(Re)trouvez votre \u00e9quilibre et votre raison d\u2019\u00eatre", "Rediscover your balance and purpose"),
      link: '/services/personnel'
    },
    {
      icon: Briefcase,
      title: t("Accompagnement professionnel", "Professional Coaching"),
      desc: t("Construisez un avenir align\u00e9 avec vos valeurs", "Build a future aligned with your values"),
      link: '/services/professionnel'
    },
    {
      icon: Baby,
      title: t("Accompagnement parentalit\u00e9", "Parenting Support"),
      desc: t("Grandissez ensemble en famille", "Grow together as a family"),
      link: '/services/parentalite'
    },
    {
      icon: HomeIcon,
      title: "Home Organising",
      desc: t("Cr\u00e9ez un environnement qui vous apaise", "Create an environment that soothes you"),
      link: '/services/home-organising'
    },
    {
      icon: Smile,
      title: t("Yoga du Rire", "Laughter Yoga"),
      desc: t("Lib\u00e9rez votre joie de vivre", "Release your joy of living"),
      link: '/services/yoga-du-rire'
    }
  ];

  const techniques = [
    {
      icon: Target,
      title: "Ikiga\u00ef",
      desc: t("Trouvez votre boussole int\u00e9rieure", "Find your inner compass"),
      link: '/services/ikigai',
      color: '#0077B6'
    },
    {
      icon: Palette,
      title: t("Art-th\u00e9rapie", "Art Therapy"),
      desc: t("Explorer, cr\u00e9er, se reconnecter \u00e0 soi", "Explore, create, reconnect with yourself"),
      link: '/services/art-therapie',
      color: '#48CAE4'
    },
    {
      icon: Leaf,
      title: t("Pleine conscience", "Mindfulness"),
      desc: t("Cultivez la pr\u00e9sence et la s\u00e9r\u00e9nit\u00e9", "Cultivate presence and serenity"),
      link: null,
      color: '#90E0EF'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t("Sophie Lamour \u2013 Coach de vie et d\u00e9veloppement personnel", "Sophie Lamour \u2013 Life Coach & Personal Development")}</title>
        <meta name="description" content={t(
          "Accompagnement personnalis\u00e9 en d\u00e9veloppement personnel, coaching professionnel, parentalit\u00e9 et home organising. Ikiga\u00ef, yoga du rire, art-th\u00e9rapie et pleine conscience.",
          "Personalized support in personal development, professional coaching, parenting and home organizing. Ikigai, laughter yoga, art therapy and mindfulness."
        )} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="hero-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
              {t("D\u00e9couvrez votre raison d\u2019\u00eatre", "Discover Your Purpose")}
            </h1>
            <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] font-sans mb-8">
              {t(
                "Bienvenue dans un espace d\u00e9di\u00e9 \u00e0 votre transformation et \u00e0 votre \u00e9panouissement. Mon approche bienveillante s\u2019adapte \u00e0 vos besoins uniques.",
                "Welcome to a space dedicated to your transformation and fulfillment. My caring approach adapts to your unique needs."
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                data-testid="hero-cta-primary"
                className="bg-[#0077B6] text-white hover:bg-[#023E8A] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
              >
                {t("Prendre contact", "Get in Touch")}
              </Link>
              <Link
                to="/qui-suis-je"
                data-testid="hero-cta-secondary"
                className="bg-transparent border border-[#48CAE4] text-[#023E8A] hover:bg-[#48CAE4] hover:text-white rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide"
              >
                {t("En savoir plus", "Learn More")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://sophielamour.com/wp-content/uploads/2025/02/IMG-20250207-WA0001-e1740056629770.jpg"
              alt="Sophie Lamour"
              className="rounded-3xl shadow-[0_16px_48px_rgba(3,4,94,0.12)] w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section — 4 bookable services */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#CAF0F8]/40" data-testid="services-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
            {t("Quel accompagnement est fait pour vous\u00a0?", "Which Support is Right for You?")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={idx}
                to={service.link}
                data-testid={`service-card-${idx}`}
                className="bg-white rounded-3xl p-8 lg:p-10 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] hover:shadow-[0_16px_48px_rgba(0,119,182,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-full bg-[#48CAE4]/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[#0077B6]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#03045E] mb-3">{service.title}</h3>
                <p className="text-base leading-relaxed text-[#023E8A] font-sans mb-6">{service.desc}</p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4]">
                  {t("D\u00e9couvrir", "Discover")} &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Techniques & Approaches — horizontal strip */}
      <section className="py-20 lg:py-24 px-6 md:px-12 lg:px-24 bg-[#03045E]" data-testid="techniques-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-white mb-3">
            {t("Mes outils & approches", "My Tools & Approaches")}
          </h2>
          <p className="text-base lg:text-lg text-white/70 max-w-2xl mx-auto">
            {t(
              "Des m\u00e9thodes compl\u00e9mentaires que j\u2019int\u00e8gre dans mes accompagnements pour enrichir votre parcours.",
              "Complementary methods I integrate into my coaching to enrich your journey."
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {techniques.map((tech, idx) => {
            const Icon = tech.icon;
            const inner = (
              <div className="flex flex-col items-center text-center group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${tech.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: tech.color }} />
                </div>
                <h3 className="text-lg font-serif text-white mb-2">{tech.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{tech.desc}</p>
              </div>
            );
            if (tech.link) {
              return (
                <Link
                  key={idx}
                  to={tech.link}
                  data-testid={`technique-card-${idx}`}
                  className="p-6 rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={idx}
                data-testid={`technique-card-${idx}`}
                className="p-6 rounded-2xl border border-white/10"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#48CAE4]/10" data-testid="testimonials-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
              {t("Ce que disent mes clients", "What My Clients Say")}
            </h2>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)] flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-5xl font-serif text-[#0077B6] leading-none">{"\u00AB"}</div>
                        {testimonial.source === 'google' && (
                          <div className="flex items-center bg-[#F8F9FA] border border-[#DADCE0] rounded-full px-3 py-1 text-xs text-[#5F6368] font-medium font-sans">
                            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.69-5.33 3.69-8.72z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.1c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.58-2.04-6.5-4.77H1.38v3.2A11.98 11.98 0 0 0 12 24z"/>
                              <path fill="#FBBC05" d="M5.5 14.41A7.12 7.12 0 0 1 5 12c0-.85.15-1.68.41-2.41V6.39H1.38A11.99 11.99 0 0 0 0 12c0 2.07.53 4.02 1.38 5.81l4.12-3.4z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.3 2.69 1.38 6.39l4.12 3.41c.92-2.73 3.48-4.77 6.5-4.77z"/>
                            </svg>
                            {t("Avis Google", "Google Review")}
                          </div>
                        )}
                      </div>
                      <p className="text-base leading-relaxed text-[#023E8A] mb-6">
                        {language === 'fr' ? testimonial.text_fr : testimonial.text_en}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-[#0077B6] text-xl">{"\u2605"}</span>
                        ))}
                      </div>
                      <p className="font-semibold text-[#03045E]">{testimonial.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <a
              href="https://share.google/fcIZVyu8Zu9Vyf9Kh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] text-[#3C4043] rounded-full px-6 py-3.5 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md font-sans text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h4.01c2.34-2.16 3.69-5.33 3.69-8.72z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.01-3.1c-1.12.75-2.55 1.19-3.92 1.19-3.02 0-5.58-2.04-6.5-4.77H1.38v3.2A11.98 11.98 0 0 0 12 24z"/>
                <path fill="#FBBC05" d="M5.5 14.41A7.12 7.12 0 0 1 5 12c0-.85.15-1.68.41-2.41V6.39H1.38A11.99 11.99 0 0 0 0 12c0 2.07.53 4.02 1.38 5.81l4.12-3.4z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.3 2.69 1.38 6.39l4.12 3.41c.92-2.73 3.48-4.77 6.5-4.77z"/>
              </svg>
              {t("Laisser un avis sur Google", "Write a Google Review")}
            </a>
            <Link
              to="/temoignages"
              className="inline-block bg-[#0077B6] hover:bg-[#023E8A] text-white rounded-full px-6 py-3.5 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md text-sm"
            >
              {t("Voir tous les témoignages", "View all testimonials")}
            </Link>
          </div>
        </section>
      )}

      {/* Blog Preview Section */}
      {blogPosts.length > 0 && (
        <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="blog-preview-section">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
              {t("Derni\u00e8res r\u00e9flexions", "Latest Thoughts")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}`}
                data-testid={`blog-preview-${idx}`}
                className="group"
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={language === 'fr' ? post.title_fr : post.title_en}
                    className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <p className="text-sm text-[#48CAE4] mb-2">{new Date(post.created_at).toLocaleDateString(language)}</p>
                <h3 className="text-xl font-serif text-[#03045E] mb-2 group-hover:text-[#0077B6] transition-colors">
                  {language === 'fr' ? post.title_fr : post.title_en}
                </h3>
                <p className="text-base text-[#023E8A] mb-4">
                  {language === 'fr' ? post.excerpt_fr : post.excerpt_en}
                </p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4]">
                  {t("Lire la suite", "Read More")} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Facebook/Social Feed Section */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24 bg-[#CAF0F8]/20" data-testid="facebook-feed-section">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-snug font-serif text-[#03045E] mb-4">
            {t("Actualités & Partages", "News & Inspiration")}
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] font-sans max-w-2xl mx-auto">
            {t(
              "Retrouvez mes dernières publications et réflexions partagées sur les réseaux.",
              "Discover my latest posts and reflections shared on social media."
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {fbSettings.feed_style === 'juicer' && (
            <div className="bg-white rounded-3xl p-8 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] overflow-hidden">
              <ul 
                key={fbSettings.juicer_feed_id} 
                className="juicer-feed" 
                data-feed-id={fbSettings.juicer_feed_id} 
                data-per="3" 
                data-columns="3"
                data-truncate="150"
              >
                <h3 className="fb-xfbml-parse-ignore text-center text-[#023E8A] py-6 font-sans">
                  <a 
                    href={`https://www.juicer.io/feeds/${fbSettings.juicer_feed_id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-[#0077B6] transition-colors font-medium"
                  >
                    {t("Voir mes publications sur Facebook", "View my posts on Facebook")}
                  </a>
                </h3>
              </ul>
            </div>
          )}

          {fbSettings.feed_style === 'timeline' && (
            <div className="flex justify-center">
              <div className="w-full max-w-[500px] bg-white rounded-3xl p-6 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] overflow-hidden flex justify-center">
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/61576060076125"
                  data-tabs="timeline"
                  data-width="500"
                  data-height="600"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite="https://www.facebook.com/61576060076125" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/61576060076125">Sophie Lamour Coaching</a>
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {fbSettings.feed_style === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[fbSettings.post_url_1, fbSettings.post_url_2, fbSettings.post_url_3].map((url, index) => (
                url ? (
                  <div key={index} className="bg-white rounded-3xl p-4 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] overflow-hidden flex justify-center min-h-[400px]">
                    <div 
                      className="fb-post" 
                      data-href={url} 
                      data-width="auto"
                      data-show-text="true"
                    >
                      <blockquote cite={url} className="fb-xfbml-parse-ignore">
                        <a href={url}>{t("Voir la publication sur Facebook", "View post on Facebook")}</a>
                      </blockquote>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="bg-white rounded-3xl p-8 border border-[#ADE8F4] shadow-[0_8px_32px_rgba(44,44,42,0.04)] flex flex-col justify-between min-h-[300px]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#0077B6]/10 flex items-center justify-center">
                        <span className="font-bold text-[#0077B6] font-sans">S</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#03045E] font-sans text-sm">Sophie Lamour</h4>
                        <p className="text-xs text-[#023E8A]/60 font-sans">Publication Facebook</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#023E8A] font-sans mb-6">
                      {index === 0 && t("Découvrez mes conseils et partages pour retrouver votre équilibre intérieur.", "Discover my tips and insights to find your inner balance.")}
                      {index === 1 && t("Rejoignez nos prochains ateliers collectifs pour vivre un moment de partage et de convivialité.", "Join our next group workshops to experience a moment of sharing and connection.")}
                      {index === 2 && t("Libérez votre joie de vivre au quotidien grâce à nos séances de Yoga du Rire !", "Release your joy of living daily with our Laughter Yoga sessions!")}
                    </p>
                    <a 
                      href="https://www.facebook.com/61576060076125" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0077B6] hover:text-[#023E8A] text-sm font-semibold tracking-wider uppercase font-sans mt-auto"
                    >
                      {t("Consulter la page", "View Page")} &rarr;
                    </a>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0077B6]" data-testid="cta-banner">
        <div className="text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
            {t("Pr\u00eat(e) \u00e0 commencer votre transformation\u00a0?", "Ready to Start Your Transformation?")}
          </h2>
          <Link
            to="/contact"
            data-testid="cta-banner-button"
            className="inline-block bg-white text-[#0077B6] hover:bg-[#CAF0F8] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-md hover:shadow-lg"
          >
            {t("Me contacter", "Contact Me")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/blog/posts?status=published`);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Blog \u2013 Sophie Lamour", "Blog \u2013 Sophie Lamour")}</title>
        <meta name="description" content={t(
          'Découvrez mes réflexions sur le développement personnel, le coaching de vie et le bien-être.',
          'Discover my thoughts on personal development, life coaching and well-being.'
        )} />
      </Helmet>

      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="blog-page">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-6">
            Blog
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#023E8A] max-w-3xl mx-auto">
            {t(
              'Réflexions, conseils et inspiration pour votre voyage de développement personnel.',
              'Reflections, advice and inspiration for your personal development journey.'
            )}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#023E8A]">{t('Chargement...', 'Loading...')}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-[#023E8A]">{t('Aucun article pour le moment.', 'No articles yet.')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <Link
                key={idx}
                to={`/blog/${post.slug}`}
                data-testid={`blog-post-${idx}`}
                className="group"
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={language === 'fr' ? post.title_fr : post.title_en}
                    className="w-full h-56 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-[#48CAE4]">{new Date(post.created_at).toLocaleDateString(language)}</span>
                  <span className="text-sm px-3 py-1 bg-[#48CAE4]/10 text-[#48CAE4] rounded-full">{post.category}</span>
                </div>
                <h2 className="text-2xl font-serif text-[#03045E] mb-3 group-hover:text-[#0077B6] transition-colors">
                  {language === 'fr' ? post.title_fr : post.title_en}
                </h2>
                <p className="text-base text-[#023E8A] mb-4 line-clamp-3">
                  {language === 'fr' ? post.excerpt_fr : post.excerpt_en}
                </p>
                <span className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4] group-hover:text-[#0077B6] transition-colors">
                  {t('Lire la suite', 'Read More')} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Blog;
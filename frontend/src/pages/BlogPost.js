import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, Facebook, Linkedin } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BlogPost = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/blog/posts/${slug}`);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-24 text-center">{t('Chargement...', 'Loading...')}</div>;
  if (!post) return <div className="py-24 text-center">{t('Article non trouvé', 'Post not found')}</div>;

  const title = language === 'fr' ? post.title_fr : post.title_en;
  const content = language === 'fr' ? post.content_fr : post.content_en;

  return (
    <>
      <Helmet>
        <title>{`${title} - Sophie Lamour`}</title>
        <meta name="description" content={language === 'fr' ? post.excerpt_fr : post.excerpt_en} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={language === 'fr' ? post.excerpt_fr : post.excerpt_en} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>

      <article className="py-24 lg:py-32 px-6 md:px-12 lg:px-24" data-testid="blog-post-detail">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#48CAE4] hover:text-[#0077B6] mb-8 transition-colors">
            <ArrowLeft size={20} />
            {t('Retour au blog', 'Back to blog')}
          </Link>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={title}
              className="w-full h-96 object-cover rounded-3xl mb-8"
            />
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-[#48CAE4]">{new Date(post.created_at).toLocaleDateString(language)}</span>
            <span className="text-sm px-3 py-1 bg-[#48CAE4]/10 text-[#48CAE4] rounded-full">{post.category}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight font-serif text-[#03045E] mb-8">
            {title}
          </h1>

          <div className="prose prose-lg max-w-none prose-headings:text-[#03045E] prose-headings:font-serif prose-p:text-[#023E8A] prose-li:text-[#023E8A] prose-strong:text-[#03045E] prose-a:text-[#0077B6] prose-blockquote:border-[#48CAE4] prose-blockquote:text-[#023E8A] leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />

          <div className="mt-12 pt-8 border-t border-[#ADE8F4]">
            <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#48CAE4] mb-4">{t('Partager', 'Share')}</p>
            <div className="flex gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#023E8A] hover:text-[#0077B6] transition-colors"
                data-testid="share-facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#023E8A] hover:text-[#0077B6] transition-colors"
                data-testid="share-linkedin"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
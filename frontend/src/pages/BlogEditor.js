import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowLeft, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post(`${API_URL}/api/uploads`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

const QuillEditor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const isSettingValue = useRef(false);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    import('quill').then((mod) => {
      const Quill = mod.default;
      if (!containerRef.current) return;

      const editorDiv = document.createElement('div');
      containerRef.current.appendChild(editorDiv);

      const q = new Quill(editorDiv, {
        theme: 'snow',
        placeholder: placeholder || '',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image', 'video'],
              ['clean']
            ],
            handlers: {
              image: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = async () => {
                  const file = input.files[0];
                  if (!file) return;
                  try {
                    const result = await uploadFile(file);
                    const range = q.getSelection(true);
                    q.insertEmbed(range.index, 'image', `${API_URL}${result.url}`);
                    q.setSelection(range.index + 1);
                  } catch (err) {
                    console.error('Image upload failed:', err);
                    alert('Erreur lors du telechargement de l\'image');
                  }
                };
              },
              video: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'video/*');
                input.click();
                input.onchange = async () => {
                  const file = input.files[0];
                  if (!file) return;
                  try {
                    const result = await uploadFile(file);
                    const range = q.getSelection(true);
                    q.insertEmbed(range.index, 'video', `${API_URL}${result.url}`);
                    q.setSelection(range.index + 1);
                  } catch (err) {
                    console.error('Video upload failed:', err);
                    alert('Erreur lors du telechargement de la video');
                  }
                };
              }
            }
          }
        }
      });

      q.on('text-change', () => {
        if (!isSettingValue.current) {
          onChangeRef.current(q.root.innerHTML);
        }
      });

      quillRef.current = q;

      if (value) {
        isSettingValue.current = true;
        q.clipboard.dangerouslyPasteHTML(value);
        isSettingValue.current = false;
      }
    });

    return () => {
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value && value !== null) {
        isSettingValue.current = true;
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
        isSettingValue.current = false;
      }
    }
  }, [value]);

  return <div ref={containerRef} />;
};

const FeaturedImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      const imageUrl = `${API_URL}${result.url}`;
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Erreur lors du telechargement');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div data-testid="featured-image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        data-testid="featured-image-file-input"
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-[#ADE8F4]">
          <img
            src={preview}
            alt="Featured"
            className="w-full h-48 object-cover"
            data-testid="featured-image-preview"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
            data-testid="featured-image-remove-btn"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 rounded-xl border-2 border-dashed border-[#ADE8F4] hover:border-[#0077B6] flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer bg-[#F0F9FF]/50"
          data-testid="featured-image-upload-btn"
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-[#48CAE4] animate-spin" />
              <span className="text-sm text-[#023E8A]">Telechargement...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#48CAE4]/10 flex items-center justify-center">
                <ImageIcon size={24} className="text-[#48CAE4]" />
              </div>
              <span className="text-sm text-[#023E8A] font-medium">Cliquez pour ajouter une image</span>
              <span className="text-xs text-[#48CAE4]">JPEG, PNG, GIF, WebP</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

const BlogEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditing = Boolean(postId);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    content_fr: '',
    content_en: '',
    excerpt_fr: '',
    excerpt_en: '',
    featured_image: '',
    category: 'Développement personnel',
    status: 'draft',
    share_to_social: false
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/blog/posts/${postId}`, { withCredentials: true });
      setFormData({
        title_fr: data.title_fr || '',
        title_en: data.title_en || '',
        content_fr: data.content_fr || '',
        content_en: data.content_en || '',
        excerpt_fr: data.excerpt_fr || '',
        excerpt_en: data.excerpt_en || '',
        featured_image: data.featured_image || '',
        category: data.category || 'Développement personnel',
        status: data.status || 'draft',
        share_to_social: false
      });
    } catch (err) {
      setError("Erreur lors du chargement de l'article");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        const { share_to_social, ...updateData } = formData;
        await axios.put(`${API_URL}/api/blog/posts/${postId}`, updateData, { withCredentials: true });
      } else {
        await axios.post(`${API_URL}/api/blog/posts`, formData, { withCredentials: true });
      }
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || (isEditing ? "Erreur lors de la mise a jour" : "Erreur lors de la creation");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#CAF0F8] flex items-center justify-center">
        <p className="text-[#023E8A]">Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "Modifier l'article - Admin" : "Nouvel article - Admin"}</title>
      </Helmet>

      <div className="min-h-screen bg-[#CAF0F8] py-12 px-6" data-testid="blog-editor">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-[#48CAE4] hover:text-[#0077B6] mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </button>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h1 className="text-3xl font-serif text-[#03045E] mb-4">
              {isEditing ? "Modifier l'article" : "Nouvel article de blog"}
            </h1>
            <p className="text-sm text-[#023E8A] mb-8">
              Utilisez les outils ci-dessous pour formater votre texte facilement
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Titre (Francais) *
                  </label>
                  <input
                    type="text"
                    name="title_fr"
                    value={formData.title_fr}
                    onChange={handleChange}
                    required
                    data-testid="title-fr-input"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    required
                    data-testid="title-en-input"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Extrait (Francais) *
                  </label>
                  <textarea
                    name="excerpt_fr"
                    value={formData.excerpt_fr}
                    onChange={handleChange}
                    required
                    rows={3}
                    data-testid="excerpt-fr-input"
                    placeholder="Court resume de article"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Excerpt (English) *
                  </label>
                  <textarea
                    name="excerpt_en"
                    value={formData.excerpt_en}
                    onChange={handleChange}
                    required
                    rows={3}
                    data-testid="excerpt-en-input"
                    placeholder="Brief article summary"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Contenu (Francais) *
                </label>
                <div className="bg-white rounded-xl border border-[#ADE8F4]" data-testid="content-fr-editor">
                  <QuillEditor
                    value={formData.content_fr}
                    onChange={(val) => setFormData(prev => ({ ...prev, content_fr: val }))}
                    placeholder="Ecrivez votre article ici..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">
                  Content (English) *
                </label>
                <div className="bg-white rounded-xl border border-[#ADE8F4]" data-testid="content-en-editor">
                  <QuillEditor
                    value={formData.content_en}
                    onChange={(val) => setFormData(prev => ({ ...prev, content_en: val }))}
                    placeholder="Write your article here..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Image a la une
                  </label>
                  <FeaturedImageUpload
                    value={formData.featured_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#03045E] mb-2">
                    Categorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    data-testid="category-select"
                    className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                  >
                    <option value="D\u00e9veloppement personnel">{"\u00c9"}panouissement personnel</option>
                    <option value="Coaching">Coaching</option>
                    <option value="Parentalit\u00e9">Parentalit{"\u00e9"}</option>
                    <option value="Bien-\u00eatre">Bien-{"\u00ea"}tre</option>
                    <option value="Organisation">Organisation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#03045E] mb-2">Statut *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  data-testid="status-select"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publie</option>
                </select>
              </div>

              {!isEditing && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#E0F2FE] to-[#CCFBF1] rounded-xl border border-[#48CAE4]">
                  <input
                    type="checkbox"
                    id="share_to_social"
                    name="share_to_social"
                    checked={formData.share_to_social}
                    onChange={(e) => setFormData({...formData, share_to_social: e.target.checked})}
                    data-testid="share-social-checkbox"
                    className="w-5 h-5 rounded border-[#48CAE4] text-[#0077B6] focus:ring-[#0077B6]"
                  />
                  <label htmlFor="share_to_social" className="text-sm font-medium text-[#03045E] cursor-pointer flex-1">
                    Partager sur les reseaux sociaux
                  </label>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl" data-testid="blog-editor-error">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="blog-submit-btn"
                  className="flex-1 bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-8 py-4 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {loading
                    ? (isEditing ? 'Mise a jour...' : 'Creation...')
                    : (isEditing ? 'Mettre a jour' : 'Creer article')
                  }
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-8 py-4 border border-[#ADE8F4] text-[#023E8A] hover:bg-[#CAF0F8] rounded-full transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #ADE8F4 !important;
          background: #F0F9FF;
          border-radius: 12px 12px 0 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .ql-container {
          border: none !important;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .ql-editor {
          min-height: 350px;
          padding: 20px;
        }
        
        .ql-editor.ql-blank::before {
          color: #90E0EF;
          font-style: italic;
        }
        
        .ql-toolbar button:hover,
        .ql-toolbar button.ql-active {
          color: #0077B6 !important;
        }
        
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #0077B6 !important;
        }
        
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #0077B6 !important;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .ql-editor iframe {
          max-width: 100%;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default BlogEditor;

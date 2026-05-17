import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Sophie Lamour</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#CAF0F8]" data-testid="admin-login-page">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(44,44,42,0.04)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-[#03045E] mb-2">Admin Login</h1>
            <p className="text-[#023E8A]">Connexion au panneau d'administration</p>
          </div>

          <form onSubmit={handleSubmit} data-testid="admin-login-form">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#03045E] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="admin-email-input"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#03045E] mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="admin-password-input"
                  className="w-full px-4 py-3 rounded-xl border border-[#ADE8F4] focus:outline-none focus:border-[#0077B6] transition-colors"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm" data-testid="admin-login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                data-testid="admin-login-submit"
                className="w-full bg-[#0077B6] text-white hover:bg-[#0096C7] rounded-full px-8 py-4 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
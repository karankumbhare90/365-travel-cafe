import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(error)

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin/reservations');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="bg-surface-dark p-8 rounded-2xl border border-white/5 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-background-dark font-bold text-xl mx-auto mb-4">T</div>
          <h1 className="text-2xl font-bold text-white">Captain's Deck</h1>
          <p className="text-gray-400 text-sm">Login to manage 365 Travel Cafe</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="admin@365cafe.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
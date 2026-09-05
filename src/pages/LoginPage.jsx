import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Loader2, Sparkles, Flame } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const result = await login(cleanUsername, cleanPassword);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setUsername('demouser');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Sunset glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B35]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#FFB347]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center shadow-xl shadow-[#FF6B35]/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#FF6B35] via-[#FFB347] to-[#FF8C6B] bg-clip-text text-transparent">JobFlow AI</span>
        </Link>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#FFF5EE]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-[#9A8C7D]">
          Manage your applications, job matches, and interview schedules.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-[#FF6B35]/15 shadow-2xl shadow-[#FF6B35]/5">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-[#1a1a2e] border border-[#FF6B35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#6B5B4F] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a2e] border border-[#FF6B35]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#6B5B4F] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:from-[#FF8C6B] hover:to-[#FFB347] text-white shadow-lg shadow-[#FF6B35]/25 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-6 border-t border-[#FF6B35]/10">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold glass-card text-[#FFB347] hover:bg-[#FF6B35]/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Auto-Fill Demo Credentials</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[#9A8C7D]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#FF6B35] hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

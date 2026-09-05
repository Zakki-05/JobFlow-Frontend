import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Loader2, Flame, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    const cleanData = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
    };
    const result = await register(cleanData);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const inputClass = "w-full bg-[#1a1a2e] border border-[#FF6B35]/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#6B5B4F] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] transition-all";
  const inputWithIconClass = "w-full bg-[#1a1a2e] border border-[#FF6B35]/15 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#6B5B4F] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] transition-all";

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B35]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#FFB347]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center shadow-xl shadow-[#FF6B35]/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#FF6B35] via-[#FFB347] to-[#FF8C6B] bg-clip-text text-transparent">JobFlow AI</span>
        </Link>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#FFF5EE]">
          Create your JobFlow account
        </h2>
        <p className="mt-2 text-xs text-[#9A8C7D]">
          Start tracking job applications and analyzing matches in minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-[#FF6B35]/15 shadow-2xl shadow-[#FF6B35]/5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">Username *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={inputWithIconClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#9A8C7D] hover:text-[#E8D5C4] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E8D5C4] mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9A8C7D] absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirm"
                  required
                  minLength={8}
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={inputWithIconClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-[#9A8C7D] hover:text-[#E8D5C4] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF6B35] to-[#FFB347] hover:from-[#FF8C6B] hover:to-[#FFB347] text-white shadow-lg shadow-[#FF6B35]/25 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#9A8C7D]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#FF6B35] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

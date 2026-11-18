import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Coffee, Lock, Mail, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@cafeflow.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E8E0D5] shadow-2xl space-y-6 relative overflow-hidden">
        {/* Coffee Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#E58A3A] to-[#5C3A21] flex items-center justify-center mx-auto shadow-lg shadow-[#E58A3A]/30">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-aesthetic-serif italic font-extrabold text-[#241A14] tracking-wider">
            The 7 Cafe
          </h1>
          <p className="font-aesthetic-cursive text-base text-[#75553E] font-bold tracking-wide -mt-1">
            ~ coffee & conversations ~
          </p>
          <p className="text-xs text-[#8A7A6E]">
            Smart Cafe Management & Multi-Table POS System
          </p>
        </div>

        {/* Demo Fast Access Button */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E58A3A]" />
            <div className="text-left">
              <p className="text-xs font-bold text-amber-900">Demo Mode Access</p>
              <p className="text-[10px] text-amber-700">admin@cafeflow.com / admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3 py-1.5 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-[11px] font-bold shadow-sm transition-all"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#665A4F] block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cafeflow.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#665A4F] block mb-1">
              Security Password / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-extrabold shadow-lg shadow-[#5C3A21]/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span>Enter Cafe Management System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-[#8A7A6E] pt-2 border-t border-[#E8E0D5]">
          Client Presentation Demo • 12 Tables • Instant Voice Dispatch
        </div>
      </div>
    </div>
  );
}

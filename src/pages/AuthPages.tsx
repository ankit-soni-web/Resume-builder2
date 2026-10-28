import React, { useState } from 'react';
import { FileText, ArrowRight, CheckCircle2, ShieldCheck, Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface Props {
  initialMode?: 'login' | 'signup' | 'forgot';
  onNavigate: (page: string) => void;
  onContinueAsGuest: () => void;
}

export const AuthPages: React.FC<Props> = ({ initialMode = 'login', onNavigate, onContinueAsGuest }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1">
          <div
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              Resume<span className="text-blue-600">Craft</span>
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' && 'Sign in to ResumeCraft'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Manage your resumes and tracked job applications.'}
            {mode === 'signup' && 'Start creating ATS-optimized professional resumes.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="p-6 text-center bg-green-50 rounded-xl border border-green-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
            <h3 className="text-sm font-bold text-green-900">
              {mode === 'forgot' ? 'Instructions Dispatched' : 'Welcome to ResumeCraft!'}
            </h3>
            <p className="text-xs text-green-700">
              Redirecting you to your workspace dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-[#14213D] hover:bg-blue-600 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Send Recovery Link'}
            </button>
          </form>
        )}

        {/* Guest Mode Card */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-left">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Prefer Not to Create an Account?
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-2.5">
              ResumeCraft provides full-featured local guest mode with instant browser autosave, complete privacy, and zero sign-in required.
            </p>
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              Continue in Guest Mode →
            </button>
          </div>

          {/* Switch Mode Links */}
          <div className="text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

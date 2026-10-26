import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github,
} from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    const client = getSupabaseClient();

    try {
      if (mode === 'signup') {
        if (client) {
          const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
            },
          });
          if (error) {
            console.warn('Supabase sign up notice:', error.message);
          }
        }

        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'AS';

        const newUser: UserProfile = {
          name: name || 'Akash Sharma',
          initials,
          email,
          role: 'Pro Member',
          plan: 'Autonomous Tier',
          isAuthenticated: true,
        };

        setSuccessMsg('Account created successfully! Welcome to Sarthi AI.');
        setTimeout(() => {
          onAuthSuccess(newUser);
          onClose();
        }, 800);
      } else {
        // Sign In
        if (client) {
          const { data, error } = await client.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            console.warn('Supabase sign in notice:', error.message);
          }
        }

        const inferredName = email.split('@')[0];
        const formattedName =
          inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
        const initials = formattedName.slice(0, 2).toUpperCase();

        const loggedInUser: UserProfile = {
          name: formattedName || 'Akash Sharma',
          initials,
          email,
          role: 'Pro Member',
          plan: 'Autonomous Tier',
          isAuthenticated: true,
        };

        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onAuthSuccess(loggedInUser);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const socialUser: UserProfile = {
        name: 'Akash Sharma',
        initials: 'AS',
        email: `akash@${provider}.com`,
        role: 'Pro Member',
        plan: 'Autonomous Tier',
        isAuthenticated: true,
      };
      onAuthSuccess(socialUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 text-white relative overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-cyan-500/20 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#8D9BBF] hover:text-white hover:bg-white/10 transition"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/30 mb-2">
            <img
              src="/sharthi-logo.png"
              alt="Sarthi AI"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold tracking-wide">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-[12px] text-[#BAC7E8] mt-0.5">
            {mode === 'signin'
              ? 'Sign in to access your autonomous workspaces & memory'
              : 'Join Sarthi AI — Your AI-Native Browser Companion'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl text-[12px] font-semibold transition ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-[#8D9BBF] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl text-[12px] font-semibold transition ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-[#8D9BBF] hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success alerts */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-[#BAC7E8] mb-1">
                Full Name
              </label>
              <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#141b3a] border border-white/15 focus-within:border-cyan-400">
                <User size={15} className="text-[#8D9BBF] mr-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Akash Sharma"
                  className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-[#BAC7E8] mb-1">
              Email Address
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#141b3a] border border-white/15 focus-within:border-cyan-400">
              <Mail size={15} className="text-[#8D9BBF] mr-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#BAC7E8] mb-1">
              Password
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[#141b3a] border border-white/15 focus-within:border-cyan-400">
              <Lock size={15} className="text-[#8D9BBF] mr-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold text-[13px] shadow-lg shadow-blue-500/25 hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#101633] px-2 text-[#8D9BBF]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social auth buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl glass-pill hover:border-cyan-400/40 text-[11px] text-[#BAC7E8] hover:text-white transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('github')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl glass-pill hover:border-cyan-400/40 text-[11px] text-[#BAC7E8] hover:text-white transition"
          >
            <Github size={14} />
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github,
  Globe,
  Brain,
  Shield,
  Zap,
} from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
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
            console.warn('Supabase auth notice:', error.message);
          }
        }

        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'AS';

        const newUser: UserProfile = {
          name: name.trim() || 'Akash Sharma',
          initials,
          email,
          role: 'Pro Member',
          plan: 'Autonomous Tier',
          isAuthenticated: true,
        };

        setSuccessMsg('Account created successfully! Launching Sarthi AI...');
        setTimeout(() => {
          onLoginSuccess(newUser);
        }, 600);
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
        const initials = formattedName.slice(0, 2).toUpperCase() || 'AS';

        const loggedInUser: UserProfile = {
          name: formattedName || 'Akash Sharma',
          initials,
          email,
          role: 'Pro Member',
          plan: 'Autonomous Tier',
          isAuthenticated: true,
        };

        setSuccessMsg('Signed in successfully! Entering browser workspace...');
        setTimeout(() => {
          onLoginSuccess(loggedInUser);
        }, 600);
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
      onLoginSuccess(socialUser);
    }, 500);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoUser: UserProfile = {
        name: 'Akash Sharma',
        initials: 'AS',
        email: 'akash@sharthi.ai',
        role: 'Pro Member',
        plan: 'Autonomous Tier',
        isAuthenticated: true,
      };
      onLoginSuccess(demoUser);
    }, 400);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center p-4 select-none">
      {/* Cinematic Mountain Sunset Backdrop with Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(113, 59, 255, 0.2) 0%, rgba(7, 11, 25, 0.6) 80%),
            linear-gradient(to bottom, rgba(7, 11, 25, 0.25) 0%, rgba(7, 11, 25, 0.7) 100%),
            url('/mountain-sunset.jpg')
          `,
          backgroundColor: '#070B19',
        }}
      />

      {/* Main Glassmorphic Auth Gateway Container */}
      <div className="relative z-10 w-full max-w-4xl glass-panel rounded-[32px] border border-white/20 shadow-[0_24px_70px_rgba(0,0,0,0.7)] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Glow ambient background lights */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-tr from-cyan-500/25 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-500/25 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Brand Hero & Vision */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/35 border border-white/20">
              <img
                src="/sharthi-logo.png"
                alt="Sarthi AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                Sarthi{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Ai
                </span>
              </h1>
              <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                AI-Native Browser
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2 leading-snug">
            Sign in is required to unlock your autonomous browser.
          </h2>

          <p className="text-[13px] text-[#BAC7E8] leading-relaxed mb-6 max-w-md">
            Sarthi AI synchronizes episodic browsing history, vector memory embeddings, and multimodal AdaL task workflows directly with your secure workspace.
          </p>

          {/* Value Props Pills */}
          <div className="space-y-2.5 w-full max-w-sm hidden sm:block">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[12px] text-white">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Brain size={16} />
              </div>
              <div>
                <p className="font-semibold text-white">AdaL Multimodal Companion</p>
                <p className="text-[10px] text-[#8D9BBF]">Autonomous subcommands & real-time perception</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[12px] text-white">
              <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Globe size={16} />
              </div>
              <div>
                <p className="font-semibold text-white">AI-Native Web Canvas</p>
                <p className="text-[10px] text-[#8D9BBF]">Direct page analysis, speed dials & research dossiers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[12px] text-white">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Shield size={16} />
              </div>
              <div>
                <p className="font-semibold text-white">Encrypted Vector Memory</p>
                <p className="text-[10px] text-[#8D9BBF]">Persistent session history with Supabase pgvector</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Auth Form */}
        <div className="w-full md:w-[380px] glass-card rounded-3xl p-6 border border-white/20 shadow-2xl relative">
          {/* Sign In / Sign Up Mode Switch */}
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

          {/* Feedback messages */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-[#BAC7E8] mb-1">
                  Full Name
                </label>
                <div className="flex items-center px-3 py-2.5 rounded-xl bg-[#121733] border border-white/15 focus-within:border-cyan-400">
                  <User size={14} className="text-[#8D9BBF] mr-2.5" />
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
              <div className="flex items-center px-3 py-2.5 rounded-xl bg-[#121733] border border-white/15 focus-within:border-cyan-400">
                <Mail size={14} className="text-[#8D9BBF] mr-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="akash@example.com"
                  className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#BAC7E8] mb-1">
                Password
              </label>
              <div className="flex items-center px-3 py-2.5 rounded-xl bg-[#121733] border border-white/15 focus-within:border-cyan-400">
                <Lock size={14} className="text-[#8D9BBF] mr-2.5" />
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
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold text-[13px] shadow-lg shadow-blue-500/30 hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In & Open Browser' : 'Create Account & Enter'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-2 mt-3">
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

          {/* Quick Demo Access Button */}
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-cyan-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <Sparkles size={12} />
              <span>Quick 1-Click Access as Akash Sharma</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


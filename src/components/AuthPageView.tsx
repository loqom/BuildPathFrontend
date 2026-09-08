import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SkillLevel, Goal } from '../types';
import { authService } from '../services/auth.service';

interface AuthPageViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAuthSuccess: (user: UserProfile) => void;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  clientId?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: GoogleCredentialResponse) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, any>) => void;
        };
      };
    };
  }
}

const EXPERIENCE_TO_SKILL: Record<string, SkillLevel> = {
  Junior: 'beginner',
  Mid: 'intermediate',
  Senior: 'advanced',
  'Staff/Lead': 'advanced',
};

const GOAL_MAP: Record<string, Goal> = {
  'Portfolio Building': 'learning',
  'Startup MVP': 'startup',
  'Skill Mastery': 'learning',
  'Open Source Contribution': 'freelance',
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Visual steps for the 3D pipeline visualization
const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Identify Problems',
    subtitle: 'Real-World Friction',
    tag: 'SIGNAL MINING',
    description: 'Scraping dev friction from GitHub issues, Reddit & StackOverflow',
    glowColor: 'rgba(220, 0, 40, 0.5)',
    icon: 'problem',
    x: -28,
    y: -36,
    z: 20,
  },
  {
    step: '02',
    title: 'Generate Ideas',
    subtitle: 'High-Impact Niches',
    tag: 'AI SYNTHESIS',
    description: 'Synthesize verified pain points into validated product opportunities',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    icon: 'idea',
    x: 32,
    y: -22,
    z: 10,
  },
  {
    step: '03',
    title: 'Plan & Build',
    subtitle: '4-Week Roadmaps',
    tag: 'EXECUTION ARCHITECTURE',
    description: 'Gemini-powered task decomposition, tech stack alignment & MVP scope',
    glowColor: 'rgba(220, 0, 40, 0.6)',
    icon: 'plan',
    x: -30,
    y: 18,
    z: 30,
  },
  {
    step: '04',
    title: 'Grow Your Portfolio',
    subtitle: 'Shipped Artifacts',
    tag: 'PRODUCTION PROOF',
    description: 'Deploy real tools, build in public, and land senior developer roles',
    glowColor: 'rgba(255, 68, 68, 0.5)',
    icon: 'grow',
    x: 28,
    y: 34,
    z: 15,
  },
];

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  userProfile,
  setUserProfile,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    githubHandle: userProfile.githubHandle || '',
    skillLevel: 'intermediate' as SkillLevel,
    goal: 'learning' as Goal,
  });

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // 3D Visual Tilt State
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Auto-cycle highlighted stage smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Google OAuth Initialization
  useEffect(() => {
    if (userProfile.isLoggedIn || !GOOGLE_CLIENT_ID) return;

    let retryCount = 0;
    const initGoogle = () => {
      const id = window.google?.accounts?.id;
      if (!id) {
        if (retryCount < 5) {
          retryCount++;
          setTimeout(initGoogle, 400);
        }
        return;
      }

      try {
        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          const parentWidth = googleBtnRef.current.parentElement?.clientWidth || 360;
          const targetWidth = Math.min(380, Math.max(240, parentWidth));
          id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            text: mode === 'signin' ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
            width: targetWidth,
          });
        }
      } catch (err) {
        console.warn('Google Sign-In init error:', err);
      }
    };

    initGoogle();

    return () => {
      if (googleBtnRef.current) googleBtnRef.current.innerHTML = '';
    };
  }, [mode, userProfile.isLoggedIn]);

  // Handle Mouse Tilt on the 3D Visual panel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualContainerRef.current) return;
    const rect = visualContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 deg
    const rotateX = -((y - centerY) / centerY) * 8; // Max 8 deg

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (!formData.firstName.trim()) {
          setError('First name is required');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const skillLevel =
          formData.skillLevel ||
          EXPERIENCE_TO_SKILL[userProfile.experienceLevel] ||
          'intermediate';
        const goal =
          formData.goal ||
          GOAL_MAP[userProfile.primaryGoal] ||
          'learning';

        const response = await authService.register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          techStack: userProfile.techStack.length > 0 ? userProfile.techStack : ['React', 'TypeScript', 'Node.js'],
          skillLevel,
          goal,
        });

        if (response.success && response.data) {
          const user: UserProfile = {
            ...userProfile,
            isLoggedIn: true,
            githubHandle: formData.githubHandle.trim() || response.data.githubHandle || formData.email.split('@')[0],
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            _id: response.data._id,
            techStack: response.data.techStack || userProfile.techStack,
          };
          setUserProfile(user);
          try {
            localStorage.setItem('buildpath_user_profile', JSON.stringify(user));
          } catch {}
          onAuthSuccess(user);
        } else {
          setError(response.message || 'Registration failed. Please check your information.');
        }
      } else {
        const response = await authService.login(formData.email.trim().toLowerCase(), formData.password);

        if (response.success && response.data) {
          const user: UserProfile = {
            ...userProfile,
            isLoggedIn: true,
            githubHandle: response.data.githubHandle || formData.githubHandle.trim() || response.data.email.split('@')[0],
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            _id: response.data._id,
            avatar: response.data.avatar,
            techStack: response.data.techStack || userProfile.techStack,
          };
          setUserProfile(user);
          try {
            localStorage.setItem('buildpath_user_profile', JSON.stringify(user));
          } catch {}
          onAuthSuccess(user);
        } else {
          setError(response.message || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credentialResponse: GoogleCredentialResponse) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.googleSignIn(credentialResponse.credential, GOOGLE_CLIENT_ID);
      if (res.success && res.data) {
        const user: UserProfile = {
          ...userProfile,
          isLoggedIn: true,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          _id: res.data._id,
          avatar: res.data.avatar,
          techStack: res.data.techStack || userProfile.techStack,
          githubHandle: res.data.githubHandle || res.data.email?.split('@')[0],
        };
        setUserProfile(user);
        try {
          localStorage.setItem('buildpath_user_profile', JSON.stringify(user));
        } catch {}
        onAuthSuccess(user);
      } else {
        setError(res.message || 'Google sign-in failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070708] text-white flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#dc0028]/30 selection:text-white">
      {/* ============================================================ */}
      {/* LEFT SIDE: AUTHENTICATION FORM (50% on desktop)             */}
      {/* ============================================================ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative z-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0a0a0c]">
        {/* Subtle Ambient Red Glow in background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#dc0028]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#dc0028]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header / Branding */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[#dc0028] font-black text-white text-xs tracking-wider rounded-lg shadow-lg shadow-red-900/40">
                BP
              </div>
              <div>
                <span className="text-sm font-black tracking-widest uppercase text-white font-mono">
                  BUILDPATH <span className="text-[#dc0028]">/ ENGINE</span>
                </span>
                <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-white/60 rounded">
                  AUTHENTICATED ACCESS
                </span>
              </div>
            </div>

            {/* Mode Switcher Pill */}
            <div className="inline-flex p-1 bg-white/[0.04] border border-white/10 rounded-full">
              <button
                type="button"
                id="auth-switch-signin-btn"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`px-3.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full transition ${
                  mode === 'signin'
                    ? 'bg-[#dc0028] text-white font-bold shadow-md shadow-red-950'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="auth-switch-signup-btn"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`px-3.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded-full transition ${
                  mode === 'signup'
                    ? 'bg-[#dc0028] text-white font-bold shadow-md shadow-red-950'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Center Content Form */}
        <div className="relative z-10 max-w-md w-full mx-auto my-8 sm:my-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#dc0028]/10 border border-[#dc0028]/25 text-[#ff4455] text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dc0028] animate-pulse" />
              Developer Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-1.5 leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to access real-world problem indexes, AI roadmap pipelines, and your saved engineering portfolio.'
                : 'Join the engineering platform turning real developer friction into production-ready software.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-base text-[#ff4d4d] shrink-0 mt-0.5">error</span>
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Success / Notice Banner */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-base text-emerald-400 shrink-0 mt-0.5">check_circle</span>
              <div className="flex-1 font-medium">{successNotice}</div>
            </div>
          )}

          {/* Google OAuth Button */}
          {GOOGLE_CLIENT_ID ? (
            <div className="space-y-4 mb-5">
              <div className="flex justify-center w-full min-h-[44px]">
                <div ref={googleBtnRef} className="w-full flex justify-center" />
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  or continue with email
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          ) : null}

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    First Name <span className="text-[#dc0028]">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Rivera"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Work or Developer Email <span className="text-[#dc0028]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="builder@buildpath.io"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition pl-9"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/30 text-sm pointer-events-none">
                  mail
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70">
                  Password <span className="text-[#dc0028]">*</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessNotice(
                        'Password reset instructions: Please contact administrator or sign in with verified Google identity.'
                      );
                    }}
                    className="text-[10px] font-mono text-white/50 hover:text-[#ff4455] transition"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter account password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition pl-9"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/30 text-sm pointer-events-none">
                  lock
                </span>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    Confirm Password <span className="text-[#dc0028]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="Re-type password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition pl-9"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/30 text-sm pointer-events-none">
                      verified_user
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Experience Tier
                    </label>
                    <select
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/15 bg-[#141416] px-3 py-2.5 text-xs text-white focus:border-[#dc0028] focus:outline-none transition"
                    >
                      <option value="beginner">Junior / Beginner</option>
                      <option value="intermediate">Mid-Level Engineer</option>
                      <option value="advanced">Senior / Staff Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Primary Objective
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/15 bg-[#141416] px-3 py-2.5 text-xs text-white focus:border-[#dc0028] focus:outline-none transition"
                    >
                      <option value="learning">Portfolio Building</option>
                      <option value="startup">Startup MVP</option>
                      <option value="freelance">Open Source Work</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                    GitHub Handle <span className="text-white/40 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="githubHandle"
                      placeholder="octocat"
                      value={formData.githubHandle}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2.5 text-xs text-white placeholder-white/25 focus:border-[#dc0028] focus:bg-white/[0.05] focus:outline-none transition pl-9"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-white/30 text-sm pointer-events-none">
                      terminal
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 rounded-lg bg-[#dc0028] py-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#b00020] active:scale-[0.99] transition shadow-lg shadow-red-950/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Profile...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to BuildPath' : 'Initialize Developer Account'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              {mode === 'signin' ? "Don't have an account yet?" : 'Already registered an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                }}
                className="text-[#ff4455] font-bold hover:underline ml-1 cursor-pointer"
              >
                {mode === 'signin' ? 'Sign up for access' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-white/40 gap-2">
          <span>Protected by BuildPath Engine Authentication</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            Zero Stale Sessions
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDE: INTERACTIVE 3D BUILDPATH VISUAL (50% on desktop)  */}
      {/* ============================================================ */}
      <div
        ref={visualContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full lg:w-1/2 relative min-h-[480px] lg:min-h-screen bg-[#050506] flex items-center justify-center p-6 sm:p-12 overflow-hidden perspective-1200"
      >
        {/* Futuristic Background Grid with Perspective */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220, 0, 40, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220, 0, 40, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            transform: 'perspective(600px) rotateX(45deg) translateY(-20%) scale(1.5)',
            transformOrigin: 'center 40%',
          }}
        />

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#dc0028]/15 rounded-full blur-[110px] pointer-events-none animate-pulse-subtle" />

        {/* SVG Laser / Connection lines in 3D space */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc0028" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff4455" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc0028" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connection arcs linking stages */}
          <path
            d="M 220, 240 C 350, 210, 450, 270, 580, 260"
            stroke="url(#laserGrad)"
            strokeWidth="2"
            fill="none"
            filter="url(#glowEffect)"
            className="animate-laser"
          />
          <path
            d="M 580, 260 C 500, 390, 430, 430, 220, 520"
            stroke="url(#laserGrad)"
            strokeWidth="2"
            fill="none"
            filter="url(#glowEffect)"
            className="animate-laser"
          />
          <path
            d="M 220, 520 C 360, 550, 480, 560, 580, 600"
            stroke="url(#laserGrad)"
            strokeWidth="2"
            fill="none"
            filter="url(#glowEffect)"
            className="animate-laser"
          />

          {/* Center concentric orbital circles */}
          <circle
            cx="400"
            cy="400"
            r="160"
            stroke="rgba(220, 0, 40, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="400"
            cy="400"
            r="240"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        </svg>

        {/* 3D Transform Container (Reacts dynamically to tilt) */}
        <div
          className="relative w-full max-w-lg aspect-square flex items-center justify-center transform-style-3d transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          }}
        >
          {/* Central 3D Glowing BuildPath Core */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center p-7 rounded-2xl bg-[#0e0e11]/90 border border-[#dc0028]/60 shadow-[0_0_50px_rgba(220,0,40,0.35)] backdrop-blur-md text-center transform-style-3d transition duration-500"
            style={{
              transform: 'translateZ(60px)',
            }}
          >
            <div className="relative mb-3">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-[#dc0028] via-[#e6002f] to-[#ff4455] flex items-center justify-center shadow-lg shadow-red-600/40">
                <span className="material-symbols-outlined text-white text-3xl">route</span>
              </div>
              <div className="absolute -inset-2 border border-[#dc0028]/40 rounded-2xl animate-ping opacity-30 pointer-events-none" />
            </div>

            <div className="text-xs font-black uppercase tracking-[0.25em] text-white font-mono">
              BuildPath Core
            </div>
            <div className="text-[10px] font-mono text-[#ff5566] tracking-wider mt-0.5 uppercase">
              Autonomous Pipeline
            </div>

            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: READY
            </div>
          </div>

          {/* Floating Stage 1: Identify Problems */}
          <div
            onClick={() => setActiveStageIndex(0)}
            className={`absolute top-4 sm:top-8 left-2 sm:left-4 z-10 w-44 sm:w-52 p-3.5 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-pointer ${
              activeStageIndex === 0
                ? 'bg-[#18181c]/95 border-[#dc0028] shadow-[0_0_25px_rgba(220,0,40,0.4)] scale-105'
                : 'bg-[#101014]/70 border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
            }`}
            style={{
              transform: 'translateZ(30px) translateY(-10px)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc0028] uppercase">
                01 • SIGNAL
              </span>
              <span className="material-symbols-outlined text-xs text-white/40">search</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Identify Problems
            </div>
            <div className="text-[10px] text-white/50 mt-1 leading-tight line-clamp-2">
              Deep-mining friction across GitHub issues & Reddit dev boards.
            </div>
          </div>

          {/* Floating Stage 2: Generate Ideas */}
          <div
            onClick={() => setActiveStageIndex(1)}
            className={`absolute top-12 sm:top-16 right-2 sm:right-4 z-10 w-44 sm:w-52 p-3.5 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-pointer ${
              activeStageIndex === 1
                ? 'bg-[#18181c]/95 border-[#dc0028] shadow-[0_0_25px_rgba(220,0,40,0.4)] scale-105'
                : 'bg-[#101014]/70 border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
            }`}
            style={{
              transform: 'translateZ(40px)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc0028] uppercase">
                02 • SYNTHESIS
              </span>
              <span className="material-symbols-outlined text-xs text-white/40">auto_awesome</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Generate Ideas
            </div>
            <div className="text-[10px] text-white/50 mt-1 leading-tight line-clamp-2">
              Transforming raw developer pain points into validated product concepts.
            </div>
          </div>

          {/* Floating Stage 3: Plan & Build */}
          <div
            onClick={() => setActiveStageIndex(2)}
            className={`absolute bottom-16 sm:bottom-20 left-2 sm:left-4 z-10 w-44 sm:w-52 p-3.5 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-pointer ${
              activeStageIndex === 2
                ? 'bg-[#18181c]/95 border-[#dc0028] shadow-[0_0_25px_rgba(220,0,40,0.4)] scale-105'
                : 'bg-[#101014]/70 border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
            }`}
            style={{
              transform: 'translateZ(50px) translateY(10px)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc0028] uppercase">
                03 • EXECUTION
              </span>
              <span className="material-symbols-outlined text-xs text-white/40">account_tree</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Plan & Build
            </div>
            <div className="text-[10px] text-white/50 mt-1 leading-tight line-clamp-2">
              4-week step-by-step milestones, tech stack blueprints & MVP checklist.
            </div>
          </div>

          {/* Floating Stage 4: Grow Your Portfolio */}
          <div
            onClick={() => setActiveStageIndex(3)}
            className={`absolute bottom-6 sm:bottom-10 right-2 sm:right-4 z-10 w-44 sm:w-52 p-3.5 sm:p-4 rounded-xl backdrop-blur-md border transition-all duration-500 cursor-pointer ${
              activeStageIndex === 3
                ? 'bg-[#18181c]/95 border-[#dc0028] shadow-[0_0_25px_rgba(220,0,40,0.4)] scale-105'
                : 'bg-[#101014]/70 border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
            }`}
            style={{
              transform: 'translateZ(35px)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc0028] uppercase">
                04 • GROWTH
              </span>
              <span className="material-symbols-outlined text-xs text-white/40">rocket_launch</span>
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Grow Portfolio
            </div>
            <div className="text-[10px] text-white/50 mt-1 leading-tight line-clamp-2">
              Deploy real software, showcase live artifacts, and build in public.
            </div>
          </div>
        </div>

        {/* Bottom Micro-Breadcrumb Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#121216]/80 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md text-[10px] font-mono text-white/60">
          <span className="text-white/40 font-bold">PIPELINE:</span>
          {PIPELINE_STAGES.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStageIndex(idx)}
              className={`flex items-center gap-1 transition ${
                activeStageIndex === idx ? 'text-[#ff4455] font-bold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span>{s.step}</span>
              {idx < PIPELINE_STAGES.length - 1 && <span className="text-white/20">→</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, SkillLevel, Goal } from '../types';
import { authService } from '../services/auth.service';

interface AuthModalViewProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAuthSuccess?: (user: UserProfile) => void;
}

const EXPERIENCE_TO_SKILL: Record<string, SkillLevel> = {
  'Junior': 'beginner',
  'Mid': 'intermediate',
  'Senior': 'advanced',
  'Staff/Lead': 'advanced',
};

const GOAL_MAP: Record<string, Goal> = {
  'Portfolio Building': 'learning',
  'Startup MVP': 'startup',
  'Skill Mastery': 'learning',
  'Open Source Contribution': 'freelance',
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const AuthModalView: React.FC<AuthModalViewProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    githubHandle: userProfile.githubHandle || '',
  });

  useEffect(() => {
    if (!isOpen || userProfile.isLoggedIn || !GOOGLE_CLIENT_ID) return;
    const id = window.google?.accounts?.id;
    if (!id) return;

    id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });

    if (googleBtnRef.current) {
      googleBtnRef.current.innerHTML = '';
      id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        text: mode === 'signin' ? 'signin_with' : 'signup_with',
        shape: 'rectangular',
        width: 400,
      });
    }

    return () => {
      if (googleBtnRef.current) googleBtnRef.current.innerHTML = '';
    };
  }, [isOpen, mode, userProfile.isLoggedIn]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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

        const skillLevel = EXPERIENCE_TO_SKILL[userProfile.experienceLevel] || 'beginner';
        const goal = GOAL_MAP[userProfile.primaryGoal] || 'learning';

        const response = await authService.register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          techStack: userProfile.techStack,
          skillLevel,
          goal,
        });

        if (response.success && response.data) {
          const user: UserProfile = {
            ...userProfile,
            isLoggedIn: true,
            githubHandle: formData.githubHandle.trim() || formData.email.split('@')[0],
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            _id: response.data._id,
          };
          setUserProfile(user);
          onAuthSuccess?.(user);
          onClose();
        }
      } else {
        const response = await authService.login(formData.email.trim().toLowerCase(), formData.password);

        if (response.success && response.data) {
          const user: UserProfile = {
            ...userProfile,
            isLoggedIn: true,
            githubHandle: formData.githubHandle.trim() || response.data.email.split('@')[0],
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            _id: response.data._id,
          };
          setUserProfile(user);
          onAuthSuccess?.(user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
      onClose();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (response: GoogleCredentialResponse) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.googleSignIn(response.credential, GOOGLE_CLIENT_ID);
      if (res.success && res.data) {
        const user: UserProfile = {
          ...userProfile,
          isLoggedIn: true,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          _id: res.data._id,
          avatar: res.data.avatar,
          githubHandle: res.data.githubHandle || res.data.email?.split('@')[0],
        };
        setUserProfile(user);
        onAuthSuccess?.(user);
        onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
          disabled={isLoading}
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">route</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            {userProfile.isLoggedIn ? 'Developer Profile' : mode === 'signin' ? 'Sign In to BuildPath' : 'Create Developer Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Accelerating real-world project discovery & portfolio engineering.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        {userProfile.isLoggedIn ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900/80 p-4 border border-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-slate-700 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {userProfile.firstName?.[0] || userProfile.githubHandle?.[0] || 'D'}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{userProfile.firstName || userProfile.githubHandle}</div>
                <div className="text-xs text-cyan-400">{userProfile.experienceLevel} • {userProfile.commitment}</div>
                {userProfile.email && <div className="text-[10px] text-slate-500">{userProfile.email}</div>}
              </div>
            </div>

            <div className="text-xs text-slate-300">
              <span className="font-mono text-slate-400 block mb-1">Your Selected Stack:</span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.techStack.map((tech) => (
                  <span key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full rounded-xl border border-red-500/40 bg-red-950/20 py-2.5 text-xs font-bold text-red-300 hover:bg-red-950/40 transition disabled:opacity-50"
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Last Name (Optional)</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">GitHub Username (Optional)</label>
              <input
                type="text"
                name="githubHandle"
                placeholder="johndoe"
                value={formData.githubHandle}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50"
            >
              {isLoading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>

            {GOOGLE_CLIENT_ID && (
              <div className="pt-1">
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-slate-700" />
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>
                <div ref={googleBtnRef} className="flex justify-center w-full" />
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
                className="text-xs text-slate-400 hover:text-cyan-400 transition"
              >
                {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { PageTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  userProfile: UserProfile;
  openAuthModal: () => void;
  problemsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  openAuthModal,
  problemsCount = 0,
  matchesCount = 0,
  hasMatches = false,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left transition hover:opacity-90 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center bg-[#dc0028] font-black text-white text-xs tracking-wider rounded-lg">
              BP
            </div>
            <div>
              <span className="text-sm font-black tracking-widest uppercase text-white">
                BUILDPATH <span className="text-[#dc0028]">/ ENGINE</span>
              </span>
            </div>
          </button>

          {/* Live Index Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 tabular-nums">{problemsCount.toLocaleString()}</span>
            <span className="text-white/40">PROBLEMS INDEXED</span>
          </div>
        </div>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] uppercase">
          <button
            id="nav-explore-btn"
            onClick={() => setActiveTab('explore')}
            className={`transition py-1 border-b-2 ${
              activeTab === 'explore'
                ? 'text-white border-[#dc0028] opacity-100'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            Explore
          </button>

          <button
            id="nav-pipeline-btn"
            onClick={() => setActiveTab('pipeline')}
            className={`transition py-1 border-b-2 ${
              activeTab === 'pipeline'
                ? 'text-white border-[#dc0028] opacity-100'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            AI Pipeline
          </button>

          <button
            id="nav-feed-btn"
            onClick={() => setActiveTab('build-in-public')}
            className={`transition py-1 border-b-2 ${
              activeTab === 'build-in-public'
                ? 'text-white border-[#dc0028] opacity-100'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            Build Feed
          </button>

          <button
            id="nav-teams-btn"
            onClick={() => setActiveTab('teams')}
            className={`transition py-1 border-b-2 ${
              activeTab === 'teams'
                ? 'text-white border-[#dc0028] opacity-100'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            Teams
          </button>

          {hasMatches && (
            <button
              id="nav-matches-btn"
              onClick={() => setActiveTab('match-results')}
              className={`transition py-1 border-b-2 ${
                activeTab === 'match-results'
                  ? 'text-white border-[#dc0028] opacity-100'
                  : 'text-white/60 border-transparent hover:text-white'
              }`}
            >
              Match Results ({matchesCount})
            </button>
          )}

          <button
            id="nav-projects-btn"
            onClick={() => setActiveTab('saved-projects')}
            className={`transition py-1 border-b-2 ${
              activeTab === 'saved-projects'
                ? 'text-white border-[#dc0028] opacity-100'
                : 'text-white/60 border-transparent hover:text-white'
            }`}
          >
            My Projects
          </button>
        </nav>

        {/* Right CTA / User Controls */}
        <div className="flex items-center gap-3">
          <button
            id="nav-submit-problem-btn"
            onClick={() => setActiveTab('submit-problem')}
            className="hidden sm:flex items-center gap-1.5 border border-white/20 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white hover:border-white hover:bg-white/5 transition rounded-full"
          >
            Submit Problem
          </button>

          <button
            id="nav-match-cta-btn"
            onClick={() => setActiveTab('onboarding')}
            className="flex items-center gap-1.5 bg-white text-black px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-slate-200 transition shadow-lg rounded-full active:scale-95"
          >
            Terminal Access
          </button>

          {/* User Auth profile icon */}
          <button
            id="nav-user-auth-btn"
            onClick={() => (userProfile.isLoggedIn ? setActiveTab('profile') : openAuthModal())}
            className="flex h-7 w-7 items-center justify-center border border-white/20 bg-white/5 text-[10px] font-mono font-bold text-white hover:border-white transition"
            title={userProfile.isLoggedIn ? "Profile" : "Sign In / Register"}
          >
            {userProfile.isLoggedIn ? "DEV" : <span className="material-symbols-outlined text-sm">person</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-white/10 bg-[#0a0a0a] px-3 py-2 no-scrollbar text-[10px] font-bold tracking-[0.15em] uppercase">
        <div className="flex items-center gap-4 min-w-max">
          <button
            onClick={() => setActiveTab('explore')}
            className={`py-1 ${activeTab === 'explore' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-1 ${activeTab === 'pipeline' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
          >
            AI Pipeline
          </button>
          <button
            onClick={() => setActiveTab('build-in-public')}
            className={`py-1 ${activeTab === 'build-in-public' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
          >
            Build Feed
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-1 ${activeTab === 'teams' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
          >
            Teams
          </button>
          {hasMatches && (
            <button
              onClick={() => setActiveTab('match-results')}
              className={`py-1 ${activeTab === 'match-results' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
            >
              Match Results
            </button>
          )}
          <button
            onClick={() => setActiveTab('saved-projects')}
            className={`py-1 ${activeTab === 'saved-projects' ? 'text-[#0057ff] border-b border-[#0057ff]' : 'text-white/60'}`}
          >
            My Projects
          </button>
        </div>
      </div>
    </header>
  );
};

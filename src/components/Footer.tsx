import React from 'react';
import { PageTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white/70">
      {/* Initiation Action Banner */}
      <div className="border-b border-white/10 px-4 py-8 sm:px-8 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#0057ff] font-bold">READY TO BUILD?</span>
            <h3 className="text-lg font-black uppercase text-white tracking-tight mt-0.5">
              Input your tech stack & discover real projects
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('onboarding')}
            className="px-8 py-3.5 bg-[#0057ff] text-white hover:bg-[#0046d5] transition text-xs font-black tracking-[0.25em] uppercase rounded-full shadow-lg"
          >
            LAUNCH AI MATCHER →
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center bg-[#0057ff] font-black text-white text-xs">
                BP
              </div>
              <span className="text-base font-black tracking-wider uppercase text-white">
                BUILDPATH
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              Scrape, match, and orchestrate real engineering projects based on your tech stack and growth goals.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ALL SCRAPER AGENTS OPERATIONAL
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-3">PLATFORM DIRECTIVES</h4>
            <ul className="space-y-2 text-xs font-bold tracking-wider uppercase">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-[#0057ff] transition">
                  Explore Problems
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pipeline')} className="hover:text-[#0057ff] transition">
                  AI Matching Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('submit-problem')} className="hover:text-[#0057ff] transition">
                  Submit Real Problem
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('saved-projects')} className="hover:text-[#0057ff] transition">
                  Active Roadmaps
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-3">NETWORK PROTOCOLS</h4>
            <ul className="space-y-2 text-xs font-bold tracking-wider uppercase">
              <li>
                <button onClick={() => setActiveTab('build-in-public')} className="hover:text-[#0057ff] transition">
                  Build in Public Feed
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('teams')} className="hover:text-[#0057ff] transition">
                  Teammate Directory
                </button>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#0057ff] transition">
                  GitHub Organization
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Agent Stack */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-3">SYSTEM ARCHITECTURE</h4>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              Multi-agent reasoning pipeline, data ingestion routines, and vector embeddings.
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 text-white/80">
                FASTAPI
              </span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 text-white/80">
                EXPRESS API
              </span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 text-white/80">
                TAILWIND CSS
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 font-mono uppercase tracking-wider gap-4">
          <p>© {new Date().getFullYear()} BUILDPATH SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">PRIVACY</span>
            <span className="hover:text-white cursor-pointer">TERMS</span>
            <span className="hover:text-white cursor-pointer">API TERMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { PageTab, ProblemItem } from '../types';

interface HeroLandingViewProps {
  setActiveTab: (tab: PageTab) => void;
  featuredProblems: ProblemItem[];
  onSelectProblem: (problem: ProblemItem) => void;
}

export const HeroLandingView: React.FC<HeroLandingViewProps> = ({
  setActiveTab,
  featuredProblems,
  onSelectProblem,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#dc0028] text-white">
      {/* Background Graphic: Subtle Wavy Vector bounded strictly within hero bounds */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full text-black opacity-20"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 900 C300 750, 450 400, 800 520 C1100 620, 1300 800, 1600 880 L1600 1000 L-100 1000 Z"
            fill="currentColor"
          />
          <path
            d="M-100 650 C250 500, 500 250, 950 420 C1250 520, 1400 350, 1600 400 L1600 580 C1350 520, 1100 700, 750 580 C400 480, 150 720, -100 820 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-8">
        {/* Top Floating Badge Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 mb-10">
          

          
        </div>

        {/* Main Hero Center Content */}
        <div className="text-center max-w-4xl mx-auto space-y-8 py-4">
          <h1 className="text-[40px] sm:text-[68px] md:text-[80px] leading-[0.95] font-black uppercase tracking-tighter text-white drop-shadow-2xl">
            FIND REAL PROBLEMS.<br/>
            BUILD REAL<br/>
            <span className="text-white decoration-white/40 decoration-wavy decoration-2">PROJECTS</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-medium text-white/90 leading-relaxed drop-shadow-md">
            BuildPath continuously indexes developer friction across GitHub, Reddit, and StackOverflow. Input your tech stack to generate a 4-week execution roadmap powered by Gemini.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="hero-find-project-btn"
              onClick={() => setActiveTab('onboarding')}
              className="bg-white text-black px-8 py-3.5 text-xs font-black tracking-widest uppercase hover:bg-slate-100 transition shadow-xl rounded-full w-full sm:w-auto active:scale-95"
            >
              Execute AI Match
            </button>

            <button
              id="hero-explore-problems-btn"
              onClick={() => setActiveTab('explore')}
              className="border border-white/40 bg-black/40 backdrop-blur-md text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-black/60 hover:border-white transition rounded-full w-full sm:w-auto"
            >
              Explore Directory
            </button>
          </div>
        </div>

        {/* Source Data Partners Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-2xl">
          <div className="p-3 flex items-center justify-center gap-2 text-center border-r border-b md:border-b-0 border-white/10">
            <span className="material-symbols-outlined text-sm text-white">code</span>
            <span className="text-[11px] font-mono font-bold uppercase text-white">GitHub Issues</span>
          </div>
          <div className="p-3 flex items-center justify-center gap-2 text-center border-r border-b md:border-b-0 border-white/10">
            <span className="material-symbols-outlined text-sm text-amber-400">forum</span>
            <span className="text-[11px] font-mono font-bold uppercase text-white">StackOverflow</span>
          </div>
          <div className="p-3 flex items-center justify-center gap-2 text-center border-r border-b md:border-b-0 border-white/10">
            <span className="material-symbols-outlined text-sm text-red-500">local_fire_department</span>
            <span className="text-[11px] font-mono font-bold uppercase text-white">Reddit Dev</span>
          </div>
          <div className="p-3 flex items-center justify-center gap-2 text-center border-r border-b md:border-b-0 border-white/10">
            <span className="material-symbols-outlined text-sm text-orange-400">newspaper</span>
            <span className="text-[11px] font-mono font-bold uppercase text-white">HackerNews</span>
          </div>
          <div className="p-3 col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-sm text-cyan-400">terminal</span>
            <span className="text-[11px] font-mono font-bold uppercase text-white">Discord Nodes</span>
          </div>
        </div>
      </div>

      {/* Secondary Dark Section with Clean Non-overlapping Boundary */}
      <div className="bg-[#0a0a0a] text-white pt-16 pb-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-2xl hover:border-[#dc0028] transition group">
              <div className="text-[#dc0028] text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
                01 // AUTOMATED SCOUTING
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white mb-2 group-hover:text-[#dc0028] transition">
                Autonomous Problem Scouts
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Background AI agents scan thousands of unresolved thread conversations, parsing friction bottlenecks and extracting developer tooling gaps.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-2xl hover:border-[#dc0028] transition group">
              <div className="text-[#dc0028] text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
                02 // STACK COMPATIBILITY
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white mb-2 group-hover:text-[#dc0028] transition">
                Gemini Stack Matcher
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Input your tech stack, skill target, and weekly availability. Our matching model ranks real-world challenges for high-impact project results.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-2xl hover:border-[#dc0028] transition group">
              <div className="text-[#dc0028] text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-3">
                03 // EXECUTION BLUEPRINT
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white mb-2 group-hover:text-[#dc0028] transition">
                4-Week Execution Roadmaps
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Every indexed problem includes architect-reviewed weekly tasks, MVP specifications, stretch goals, and modular scaffolding code templates.
              </p>
            </div>
          </div>

          {/* Featured Real-World Problems Section */}
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#dc0028]">
                  DIRECTIVES & OPPORTUNITIES
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                  High-Impact Engineering Challenges
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/80 hover:text-[#dc0028] transition"
              >
                INDEX DIRECTORY (2,847)
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProblems.slice(0, 3).map((problem, idx) => (
                <div
                  key={problem.id}
                  className="bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-2xl border border-white/10 flex flex-col justify-between transition hover:border-[#dc0028]/50"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-[#dc0028]/20 text-white border border-[#dc0028]/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md">
                        {problem.sector}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 uppercase">
                        PROTOCOL 0{idx + 1}
                      </span>
                    </div>

                    <h3
                      className="text-base font-bold text-white uppercase tracking-tight mb-2 line-clamp-2 hover:text-[#dc0028] transition cursor-pointer"
                      onClick={() => onSelectProblem(problem)}
                    >
                      {problem.title}
                    </h3>

                    <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5 border-t border-white/10 pt-4">
                      {problem.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/80 border border-white/10 uppercase rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span>♥ {problem.likes}</span>
                        <span>{problem.buildersCount} BUILDERS</span>
                      </div>

                      <button
                        onClick={() => onSelectProblem(problem)}
                        className="flex items-center gap-1 font-bold text-[10px] tracking-widest uppercase text-white hover:text-[#dc0028] transition"
                      >
                        ROADMAP
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


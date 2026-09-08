import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from '../types';
import { BuildPathLogo } from './BuildPathLogo';

interface HowBuildPathWorksProps {
  setActiveTab: (tab: PageTab) => void;
}

interface WorkflowStage {
  id: string;
  step: string;
  title: string;
  badge: string;
  tagline: string;
  summary: string;
  technicalDetails: string[];
  techTags: string[];
  icon: string;
  color: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'discover',
    step: '01',
    title: 'DISCOVER',
    badge: 'AUTONOMOUS SCOUTING',
    tagline: 'Scraping Unresolved Pain Points Across Developer Communities',
    summary:
      'BuildPath continuously monitors thousands of discussions across GitHub Issues, Stack Overflow questions, Reddit dev subreddits, and Hacker News to index real developer frustrations.',
    technicalDetails: [
      'Unresolved thread conversation analysis',
      'Extraction of developer tooling bottlenecks',
      'Automated signal-to-noise NLP filtering',
      'Real-time indexing of emerging ecosystem gaps',
    ],
    techTags: ['GitHub API', 'Reddit Scraper', 'StackOverflow', 'Noise Filter'],
    icon: 'travel_explore',
    color: '#dc0028',
  },
  {
    id: 'understand',
    step: '02',
    title: 'UNDERSTAND',
    badge: 'EMBEDDINGS & CLUSTERING',
    tagline: 'Vector Semantic Clustering & Pain Point Extraction',
    summary:
      'Our Clustering Agent vectorizes unstructured developer complaints using high-dimensional embeddings and ChromaDB to synthesize recurring patterns into validated problem clusters.',
    technicalDetails: [
      'Semantic grouping into issue clusters via vector embeddings',
      'Elimination of redundant and subjective discussions',
      'LLM synthesis to identify core friction causes',
      'Scoring problem severity and frequency across developer hubs',
    ],
    techTags: ['ChromaDB', 'Vector Embeddings', 'Mistral LLM', 'Semantic Clustering'],
    icon: 'psychology',
    color: '#ff4455',
  },
  {
    id: 'match',
    step: '03',
    title: 'MATCH',
    badge: 'STACK COMPATIBILITY',
    tagline: 'Algorithmic Alignment With Your Skills, Goals & Availability',
    summary:
      'The Match Agent evaluates indexed problem clusters directly against your verified tech stack, experience tier, portfolio goals, and weekly commit hours to find your optimal engineering challenge.',
    technicalDetails: [
      'Multi-variable constraint matching (skills, hours/wk, objective)',
      'Compatibility ranking with clear reason breakdowns',
      'Prevents mismatching beginners with complex distributed systems',
      'Direct alignment with startup MVPs, portfolio pieces, or learning',
    ],
    techTags: ['Stack Matcher', 'Skill Compatibility', 'Goal Tuning', 'Time Constraints'],
    icon: 'hub',
    color: '#dc0028',
  },
  {
    id: 'plan',
    step: '04',
    title: 'PLAN',
    badge: 'BLUEPRINT ARCHITECTURE',
    tagline: 'Architect Agent Generates a Production Blueprint & 4-Week Plan',
    summary:
      'The Architect Agent decomposes the validated problem into a comprehensive, production-grade technical specification with clear MVP bounds, architecture patterns, and structured weekly milestones.',
    technicalDetails: [
      'Production MVP scope definition & stretch features',
      'Technical architecture guidelines & modular scaffolding',
      'Granular week-by-week task checklists (Week 1 through 4)',
      'Recommended libraries, API contracts, and database schema drafts',
    ],
    techTags: ['4-Week Roadmaps', 'MVP Scope', 'System Architecture', 'Weekly Checklists'],
    icon: 'architecture',
    color: '#ff5566',
  },
  {
    id: 'build',
    step: '05',
    title: 'BUILD',
    badge: 'ENGINEERING EXECUTION',
    tagline: 'Step-by-Step Development With Scaffolding Guidance',
    summary:
      'Follow your personalized execution roadmap step by step. Track milestone completion, leverage architectural guidance, and build with real context instead of watching passive tutorials.',
    technicalDetails: [
      'Focused milestones eliminating developer decision paralysis',
      'Architect-reviewed technical constraints preventing scope creep',
      'Clear task dependencies from foundational setup to production polish',
      'Real-world integration practice with actual APIs and services',
    ],
    techTags: ['Milestone Tracking', 'Modular Code', 'Real-world Context', 'Anti-Tutorial'],
    icon: 'terminal',
    color: '#dc0028',
  },
  {
    id: 'showcase',
    step: '06',
    title: 'SHOWCASE',
    badge: 'PORTFOLIO & ECOSYSTEM',
    tagline: 'Turn Real Problem Solutions Into Proof-of-Work Portfolio Pieces',
    summary:
      'Publish your shipped project to the Build in Public feed, showcase verifiable GitHub repos to hiring managers, find co-builders in Teams, and establish genuine engineering credibility.',
    technicalDetails: [
      'Demonstrates you solve genuine friction, not generic tutorial clones',
      'Live project artifacts and verifiable codebase links',
      'Build in Public community feed engagement and peer reviews',
      'Find teammates and collaborators with complementary skillsets',
    ],
    techTags: ['Build in Public', 'Teammate Match', 'Verified Repo', 'Proof of Work'],
    icon: 'rocket_launch',
    color: '#ff4455',
  },
];

export const HowBuildPathWorks: React.FC<HowBuildPathWorksProps> = ({ setActiveTab }) => {
  const [activeStageId, setActiveStageId] = useState<string>('discover');
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Progressive Scroll Reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3D Parallax tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12; // Max 6 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12; // Max 6 deg
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const currentActiveStage =
    WORKFLOW_STAGES.find((s) => s.id === (hoveredStageId || activeStageId)) ||
    WORKFLOW_STAGES[0];

  return (
    <section
      id="how-buildpath-works"
      ref={sectionRef}
      className="relative bg-[#070709] text-white py-24 sm:py-32 border-t border-white/10 overflow-hidden"
    >
      {/* Background Subtle Geometric Grid & Crimson Radial Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 0, 40, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(220, 0, 40, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#dc0028]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc0028]/10 border border-[#dc0028]/30 text-[#ff4455] text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(220,0,40,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#dc0028] animate-pulse" />
            END-TO-END EXECUTION PIPELINE
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            HOW BUILDPATH <span className="text-[#dc0028]">WORKS</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
            From real-world developer problems to a project you can actually build. We replace generic tutorial clones with genuine engineering friction.
          </p>

          {/* Quick Flow Breadcrumb Stream */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-white/50 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full">
            <span className="text-white font-bold">REAL PROBLEM</span>
            <span className="text-[#dc0028]">→</span>
            <span>AI ANALYSIS</span>
            <span className="text-[#dc0028]">→</span>
            <span>PERSONALIZED MATCH</span>
            <span className="text-[#dc0028]">→</span>
            <span>PROJECT BLUEPRINT</span>
            <span className="text-[#dc0028]">→</span>
            <span>4-WEEK BUILD</span>
            <span className="text-[#dc0028]">→</span>
            <span className="text-[#ff4455] font-bold">PORTFOLIO</span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* DESKTOP/TABLET 3D INTERACTIVE PIPELINE ENGINE (Hidden on Mobile) */}
        {/* ========================================================== */}
        <div className="hidden md:block">
          <div
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-3xl bg-black/60 border border-white/15 p-8 lg:p-12 shadow-2xl backdrop-blur-xl perspective-1200 overflow-hidden transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-4'
            }`}
          >
            {/* Ambient Background laser lines in 3D canvas/SVG space */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 1200 650"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flowLaser" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dc0028" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#dc0028" stopOpacity="0.8" />
                </linearGradient>
                <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Wave Line linking the 6 nodes across the workspace */}
              <path
                d="M 120 180 C 220 120, 280 240, 400 180 C 520 120, 580 240, 700 180 C 820 120, 880 240, 1000 180"
                stroke="url(#flowLaser)"
                strokeWidth="2.5"
                strokeDasharray="8 12"
                className="animate-laser"
                filter="url(#laserGlow)"
              />

              {/* Concentric orbital circles behind central engine core */}
              <circle
                cx="600"
                cy="380"
                r="180"
                stroke="rgba(220, 0, 40, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <circle
                cx="600"
                cy="380"
                r="260"
                stroke="rgba(255, 255, 255, 0.04)"
                strokeWidth="1"
              />
            </svg>

            {/* 3D Parallax Container */}
            <div
              className="relative z-10 transform-style-3d transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
              }}
            >
              {/* Top Row: 6 Interactive Stage Selector Cards */}
              <div className="grid grid-cols-6 gap-3 mb-10">
                {WORKFLOW_STAGES.map((stage, idx) => {
                  const isCurrent = currentActiveStage.id === stage.id;
                  const isPassed =
                    WORKFLOW_STAGES.findIndex((s) => s.id === currentActiveStage.id) >= idx;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => setActiveStageId(stage.id)}
                      onMouseEnter={() => setHoveredStageId(stage.id)}
                      onMouseLeave={() => setHoveredStageId(null)}
                      className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer transform-style-3d ${
                        isCurrent
                          ? 'bg-[#15151a] border-[#dc0028] shadow-[0_0_25px_rgba(220,0,40,0.35)] -translate-y-2'
                          : 'bg-[#0d0d10]/80 border-white/10 hover:border-white/30 hover:bg-[#121216]'
                      }`}
                      style={{
                        transform: isCurrent ? 'translateZ(35px) translateY(-8px)' : 'translateZ(10px)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease, background 0.3s ease',
                      }}
                    >
                      {/* Top Step Number & Status Indicator */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold tracking-widest ${
                            isCurrent ? 'text-[#ff4455]' : isPassed ? 'text-[#dc0028]' : 'text-white/40'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isCurrent
                              ? 'bg-[#dc0028] animate-ping'
                              : isPassed
                              ? 'bg-[#dc0028]'
                              : 'bg-white/20'
                          }`}
                        />
                      </div>

                      {/* Title */}
                      <div className="text-xs font-black tracking-wider uppercase text-white font-sans flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-sm text-[#ff4455]">
                          {stage.icon}
                        </span>
                        <span>{stage.title}</span>
                      </div>

                      {/* Short Tag */}
                      <div className="text-[9px] font-mono uppercase tracking-wider text-white/40 truncate">
                        {stage.badge}
                      </div>

                      {/* Active Underline Glow Indicator */}
                      {isCurrent && (
                        <div className="absolute -bottom-px left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#dc0028] to-transparent shadow-[0_0_10px_#dc0028]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Deep Dive Visual Screen: Split Active Detail & Central 3D Engine Core */}
              <div className="grid grid-cols-12 gap-8 items-center bg-[#09090c]/90 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-md">
                {/* Left: Detailed Stage Specification */}
                <div className="col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#dc0028] bg-[#dc0028]/10 border border-[#dc0028]/30 px-3 py-1 rounded-md uppercase">
                      STAGE {currentActiveStage.step} // {currentActiveStage.badge}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      STATUS: VERIFIED
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                    {currentActiveStage.step} — {currentActiveStage.title}: {currentActiveStage.tagline}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                    {currentActiveStage.summary}
                  </p>

                  {/* Bullet Checklist of actual technical mechanisms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {currentActiveStage.technicalDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-white/[0.03] border border-white/5 p-2.5 rounded-lg text-xs text-white/80"
                      >
                        <span className="material-symbols-outlined text-[#dc0028] text-sm shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technology Badges */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mr-1">
                      STACK / AGENTS:
                    </span>
                    {currentActiveStage.techTags.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 text-white/90 rounded uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: 3D Engine Core Visual Representation */}
                <div className="col-span-5 flex flex-col items-center justify-center p-6 border-l border-white/10 text-center">
                  <div className="relative mb-6">
                    <BuildPathLogo
                      size="xl"
                      withGlow={true}
                      className="!w-24 !h-24 shadow-[0_0_40px_rgba(220,0,40,0.5)] border-2 border-[#dc0028]"
                    />
                    <div className="absolute -inset-4 border border-[#dc0028]/30 rounded-3xl animate-ping opacity-25 pointer-events-none" />
                  </div>

                  <div className="text-sm font-black uppercase tracking-[0.25em] text-white font-mono">
                    BUILDPATH ENGINE
                  </div>
                  <div className="text-[11px] font-mono text-[#ff4455] tracking-wider mt-1 uppercase">
                    ACTIVE AGENT: {currentActiveStage.badge}
                  </div>

                  <p className="text-[11px] text-white/50 mt-3 max-w-xs leading-normal">
                    Transforming raw internet friction into verified developer roadmaps and portfolio-ready software.
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => setActiveTab('onboarding')}
                      className="px-5 py-2 rounded-full bg-[#dc0028] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#b00020] transition shadow-lg shadow-red-950/60 active:scale-95 cursor-pointer"
                    >
                      Test Matcher
                    </button>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="px-5 py-2 rounded-full bg-white/5 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition cursor-pointer"
                    >
                      View Problems
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* MOBILE RESPONSIVE INTERACTIVE TIMELINE (Visible on < md)   */}
        {/* ========================================================== */}
        <div className="block md:hidden space-y-4">
          <div className="relative pl-6 border-l-2 border-[#dc0028]/50 space-y-6">
            {WORKFLOW_STAGES.map((stage) => {
              const isCurrent = activeStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#121216] border-[#dc0028] shadow-[0_0_20px_rgba(220,0,40,0.3)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Timeline dot marker on border */}
                  <span
                    className={`absolute -left-[31px] top-6 h-3.5 w-3.5 rounded-full border-2 border-[#070709] ${
                      isCurrent ? 'bg-[#ff4455] ring-4 ring-[#dc0028]/30' : 'bg-white/40'
                    }`}
                  />

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#ff4455] tracking-widest uppercase">
                      STAGE {stage.step}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight text-white font-sans flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-base text-[#dc0028]">
                      {stage.icon}
                    </span>
                    <span>{stage.title}</span>
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed">{stage.summary}</p>

                  {/* Expanded details when active on mobile */}
                  {isCurrent && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        KEY DELIVERABLES:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-white/80">
                        {stage.technicalDetails.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-[#dc0028] text-xs mt-0.5">
                              arrow_forward
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 flex flex-wrap gap-1">
                        {stage.techTags.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[9px] font-mono bg-white/5 border border-white/10 text-white/80 rounded uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="w-full py-3.5 bg-[#dc0028] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-red-950/60"
            >
              Launch AI Matcher →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

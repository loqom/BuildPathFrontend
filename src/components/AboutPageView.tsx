import React from 'react';
import { PageTab } from '../types';
import { BuildPathLogo } from './BuildPathLogo';

interface AboutPageViewProps {
  setActiveTab: (tab: PageTab) => void;
}

export const AboutPageView: React.FC<AboutPageViewProps> = ({ setActiveTab }) => {
  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-[#dc0028]/30 selection:text-white font-sans overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 border-b border-white/10 overflow-hidden">
        {/* Subtle Geometric Laser Grid & Red Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220, 0, 40, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220, 0, 40, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#dc0028]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#dc0028]/10 border border-[#dc0028]/30 text-[#ff4455] text-xs font-mono font-bold tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(220,0,40,0.2)]">
            <BuildPathLogo size="sm" withGlow={false} className="!w-4 !h-4 !border-none !bg-transparent" />
            THE BUILDPATH PHILOSOPHY
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white drop-shadow-xl leading-[0.95] font-sans">
            BUILD WHAT <span className="text-[#dc0028]">ACTUALLY</span> MATTERS.
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed font-medium pt-2">
            BuildPath moves developers from randomly choosing arbitrary projects to engineering production-grade solutions grounded in real-world friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo(0, 0);
              }}
              className="px-8 py-3.5 bg-[#dc0028] text-white hover:bg-[#b00020] transition text-xs font-black tracking-[0.25em] uppercase rounded-full shadow-xl shadow-red-950/60 active:scale-95 cursor-pointer"
            >
              Explore Real Problems
            </button>
            <button
              onClick={() => {
                setActiveTab('onboarding');
                window.scrollTo(0, 0);
              }}
              className="px-8 py-3.5 bg-white/5 border border-white/20 text-white hover:bg-white/10 transition text-xs font-bold tracking-[0.25em] uppercase rounded-full cursor-pointer"
            >
              Execute AI Match →
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE PROBLEM: TUTORIAL HELL VS REAL PROBLEM                */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#08080a] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#dc0028]">
              PARADIGM SHIFT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-2 font-sans">
              "Most developers don't struggle to find something to code.{' '}
              <span className="text-[#ff4455]">They struggle to find something worth building."</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
              Tutorials and cookie-cutter clones fill portfolios with identical, uninspired code that fails to demonstrate real problem-solving ability.
            </p>
          </div>

          {/* Visual Comparison: Traditional vs BuildPath */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Conventional Approach */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-2 text-white/40 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <span className="h-2 w-2 rounded-full bg-white/30" />
                CONVENTIONAL TUTORIAL PARADIGM
              </div>

              <div className="space-y-4 font-mono text-xs text-white/60">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <span className="text-red-400 font-bold">01</span>
                  <span>Generic YouTube Tutorial / Medium Guide</span>
                </div>
                <div className="text-center text-white/30">↓</div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <span className="text-red-400 font-bold">02</span>
                  <span>Cookie-Cutter Clone (Todo App, Netflix Clone, Twitter Replica)</span>
                </div>
                <div className="text-center text-white/30">↓</div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <span className="text-red-400 font-bold">03</span>
                  <span>Passive Portfolio Project With Zero Real-World Utility</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-white/40 leading-relaxed">
                Result: Hiring managers glaze over predictable repositories that demonstrate copying, not independent problem-solving.
              </div>
            </div>

            {/* The BuildPath Approach */}
            <div className="p-8 rounded-2xl bg-[#0e0e13] border border-[#dc0028]/60 shadow-[0_0_30px_rgba(220,0,40,0.25)] relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#ff4455] font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <span className="h-2 w-2 rounded-full bg-[#dc0028] animate-pulse" />
                BUILDPATH AUTONOMOUS PIPELINE
              </div>

              <div className="space-y-4 font-mono text-xs text-white">
                <div className="p-4 rounded-xl bg-[#16161d] border border-[#dc0028]/30 flex items-center gap-3">
                  <span className="text-[#ff4455] font-bold">01</span>
                  <span>Live Developer Friction Mined Across GitHub & Reddit</span>
                </div>
                <div className="text-center text-[#dc0028]">↓</div>
                <div className="p-4 rounded-xl bg-[#16161d] border border-[#dc0028]/30 flex items-center gap-3">
                  <span className="text-[#ff4455] font-bold">02</span>
                  <span>Personalized Gemini Match Based on Your Stack & Goals</span>
                </div>
                <div className="text-center text-[#dc0028]">↓</div>
                <div className="p-4 rounded-xl bg-[#16161d] border border-[#dc0028]/30 flex items-center gap-3">
                  <span className="text-[#ff4455] font-bold">03</span>
                  <span>4-Week Architected Execution Roadmap & Shipped Proof-of-Work</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-emerald-400 font-mono leading-relaxed flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                Result: High-signal portfolio solving genuine problems developers actually face.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. OUR APPROACH: 6-STAGE PIPELINE                            */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#050507]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#dc0028]">
              SYSTEM METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1 font-sans">
              THE 6-STAGE EXECUTION ENGINE
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-2">
              DISCOVER → UNDERSTAND → MATCH → PLAN → BUILD → SHOWCASE
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'DISCOVER',
                tag: 'SIGNAL SCOUTING',
                desc: 'Autonomous background scrapers parse GitHub Issues, Reddit dev communities, and StackOverflow threads to extract genuine tooling pain points.',
              },
              {
                step: '02',
                title: 'UNDERSTAND',
                tag: 'SEMANTIC CLUSTERING',
                desc: 'Our vector embedding routines and ChromaDB cluster redundant complaints into verified, high-impact problem statements with noise removed.',
              },
              {
                step: '03',
                title: 'MATCH',
                tag: 'STACK COMPATIBILITY',
                desc: 'Your active programming languages, framework comfort level, weekly commitment, and career target dictate which problems best fit your profile.',
              },
              {
                step: '04',
                title: 'PLAN',
                tag: 'ARCHITECT BLUEPRINT',
                desc: 'The Architect Agent structures an actionable 4-week execution roadmap complete with MVP constraints, modular code scaffolding, and stretch goals.',
              },
              {
                step: '05',
                title: 'BUILD',
                tag: 'PROGRESSIVE DELIVERY',
                desc: 'Developers follow structured weekly checklists from environment setup to core business logic, preventing scope creep and tutorial paralysis.',
              },
              {
                step: '06',
                title: 'SHOWCASE',
                tag: 'PORTFOLIO PROOF',
                desc: 'Publish shipped repositories to the Build in Public network, recruit teammates in the Teams directory, and present tangible proof to hiring teams.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#dc0028]/60 transition group hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#dc0028] tracking-widest uppercase">
                    STAGE {item.step}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight mb-2 group-hover:text-[#ff4455] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE BUILDPATH ENGINE: REAL ARCHITECTURE ACCURACY           */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#08080b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#dc0028]">
              UNDER THE HOOD
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1 font-sans">
              THE BUILDPATH MULTI-AGENT ENGINE
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
              Ground truth system capabilities currently powering the BuildPath Python microservice and Express backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                agent: 'Scout Agent',
                endpoint: 'scraper.py & Mistral LLM',
                duty: 'Periodically crawls developer discussions, parses discussion threads, and extracts raw, genuine developer frustrations.',
                badge: 'DATA INGESTION',
              },
              {
                agent: 'Clustering Agent',
                endpoint: 'embeddings.py & ChromaDB',
                duty: 'Generates high-dimensional vector embeddings for each pain point, querying ChromaDB to group similar problems into named clusters.',
                badge: 'VECTOR MEMORY',
              },
              {
                agent: 'Match Agent',
                endpoint: 'LangChain Reasoning Graph',
                duty: 'Scores semantic problem clusters against user tech stacks, experience levels (Junior/Mid/Senior), and weekly commitment constraints.',
                badge: 'COMPATIBILITY ENGINE',
              },
              {
                agent: 'Validator Agent',
                endpoint: 'Web Search & Competitive Analysis',
                duty: 'Checks market saturation and validates whether an identified pain point has viable room for a modern open-source tool.',
                badge: 'VIABILITY VERIFICATION',
              },
              {
                agent: 'Architect Agent',
                endpoint: 'Gemini / LLM Decomposition',
                duty: 'Decomposes validated problems into Week 1 through 4 execution milestones, architectural recommendations, and MVP deliverables.',
                badge: 'ROADMAP SYNTHESIS',
              },
              {
                agent: 'Real-Time SSE Stream',
                endpoint: 'Server-Sent Events /pipeline/events',
                duty: 'Streams live agent execution thoughts, terminal logs, and milestone status directly to the developer terminal UI in real time.',
                badge: 'EVENT STREAMING',
              },
            ].map((node) => (
              <div
                key={node.agent}
                className="p-6 rounded-2xl bg-[#0e0e13] border border-white/10 hover:border-[#dc0028]/50 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#ff4455] tracking-widest uppercase">
                    {node.badge}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-tight mb-1">
                  {node.agent}
                </h3>
                <div className="text-[10px] font-mono text-white/40 mb-3 truncate">
                  {node.endpoint}
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{node.duty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FOR DEVELOPERS: VALUE PROPOSITION                          */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 border-b border-white/10 bg-[#050507]">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#dc0028]">
                DEVELOPER ADVANTAGE
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
                BUILT BY ENGINEERS FOR ENGINEERS.
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
                Whether you are aiming for your first junior role or showcasing advanced distributed systems competence, BuildPath provides the rigor and architecture you need to stand out.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Verified real-world friction eliminating artificial tutorial exercises',
                  'Personalized matches based directly on your current stack and weekly hours',
                  'Turnkey 4-week execution roadmaps with architect-grade weekly tasks',
                  'Direct path to portfolio-worthy tools, CLI apps, microservices & libraries',
                  'Build in public ecosystem to gain early feedback and find co-founders',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#dc0028] text-base shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs text-white/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Card Box */}
            <div className="lg:col-span-6 p-8 rounded-3xl bg-[#0a0a0d] border border-white/15 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <BuildPathLogo size="sm" withGlow={false} />
                  <span className="text-xs font-mono font-bold uppercase text-white">
                    SPECIFICATION BREAKDOWN
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#ff4455] uppercase bg-[#dc0028]/10 px-2 py-0.5 rounded border border-[#dc0028]/30">
                  PRODUCTION READY
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Execution Timeline:</span>
                  <span className="text-white font-bold">4 Weeks (Structured)</span>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Problem Source:</span>
                  <span className="text-white font-bold">GitHub / Reddit / StackOverflow</span>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Matching Algorithm:</span>
                  <span className="text-white font-bold">Multi-Variable Stack Scoring</span>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <span className="text-white/60">Portfolio Value:</span>
                  <span className="text-emerald-400 font-bold">Proof of Independent Execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. MISSION STATEMENT                                         */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32 bg-[#09090c] text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#dc0028]/15 rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#dc0028]">
            CORE DIRECTIVE
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight font-sans">
            "TURN DEVELOPER FRICTION INTO BUILDER OPPORTUNITY."
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-white/60 leading-relaxed font-medium">
            We believe the best software is born from genuine pain points. By bridging real community discussions with structured AI execution pipelines, we help engineers create software that matters.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FINAL CALL TO ACTION                                      */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-[#050507] text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 space-y-6">
          <BuildPathLogo size="lg" withGlow={true} className="mx-auto mb-2" />
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            READY TO BUILD SOMETHING REAL?
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto leading-relaxed">
            Stop coding trivial demos. Start with a verified engineering problem and follow a structured roadmap today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setActiveTab('explore');
                window.scrollTo(0, 0);
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/20 text-white hover:bg-white/10 transition text-xs font-black tracking-[0.2em] uppercase rounded-full cursor-pointer"
            >
              Explore Problems
            </button>
            <button
              onClick={() => {
                setActiveTab('onboarding');
                window.scrollTo(0, 0);
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#dc0028] text-white hover:bg-[#b00020] transition text-xs font-black tracking-[0.2em] uppercase rounded-full shadow-xl shadow-red-950/60 active:scale-95 cursor-pointer"
            >
              Execute AI Match →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { ProblemItem, PageTab } from '../types';

interface SubmitProblemViewProps {
  onAddProblem: (newProb: ProblemItem) => void;
  setActiveTab: (tab: PageTab) => void;
  onSelectProblem: (problem: ProblemItem) => void;
}

export const SubmitProblemView: React.FC<SubmitProblemViewProps> = ({
  onAddProblem,
  setActiveTab,
  onSelectProblem,
}) => {
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState<'DevTools' | 'AI/ML' | 'Fintech' | 'Web3' | 'Healthtech' | 'E-Commerce' | 'Security'>('DevTools');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['TypeScript', 'Node.js', 'Redis']);

  const handleAddTechTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techInput.trim()) return;
    const tag = techInput.trim();
    if (!techStack.includes(tag)) {
      setTechStack([...techStack, tag]);
    }
    setTechInput('');
  };

  const handleRemoveTechTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProblem: ProblemItem = {
      id: `prob-custom-${Date.now()}`,
      title: title.trim(),
      sector,
      difficulty,
      description: description.trim(),
      summary: summary.trim() || description.trim().slice(0, 100) + '...',
      techStack: techStack.length > 0 ? techStack : ['TypeScript', 'Node.js'],
      likes: 0,
      buildersCount: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      impactScore: 0,
      mvpRequirements: [],
      stretchGoals: [],
      roadmapWeeks: []
    };

    onAddProblem(newProblem);
    onSelectProblem(newProblem);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="inline-flex items-center gap-2 border border-[#0057ff] bg-[#0057ff]/10 px-3.5 py-1 text-xs font-mono font-bold text-[#0057ff] mb-3 uppercase tracking-widest">
        <span className="material-symbols-outlined text-base">add_circle</span>
        COMMUNITY SUBMISSION PORTAL
      </div>

      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2">
        Submit <span className="text-transparent stroke-white">Problem</span>
      </h1>
      <p className="text-xs sm:text-sm text-white/70 max-w-2xl mb-8">
        Are you facing an unsolved friction point in your stack? Index it on BuildPath so builders worldwide can create solution roadmaps.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#0057ff] uppercase tracking-[0.2em] mb-2">
                PROBLEM TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="E.G., IN-MEMORY RATE LIMITING GATEWAY FOR GRAPHQL APIs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-white/20 px-4 py-3 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
              />
            </div>

            {/* Sector & Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#0057ff] uppercase tracking-[0.2em] mb-2">
                  INDUSTRY SECTOR
                </label>
                <select
                  value={sector}
                  onChange={(e: any) => setSector(e.target.value)}
                  className="w-full bg-black border border-white/20 px-3.5 py-3 text-xs font-mono text-white focus:border-[#0057ff] focus:outline-none uppercase"
                >
                  <option value="DevTools">DevTools & Infrastructure</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Fintech">Fintech & Payments</option>
                  <option value="Web3">Web3 & Decentralized</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Security">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#0057ff] uppercase tracking-[0.2em] mb-2">
                  TARGET DIFFICULTY
                </label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full bg-black border border-white/20 px-3.5 py-3 text-xs font-mono text-white focus:border-[#0057ff] focus:outline-none uppercase"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#0057ff] uppercase tracking-[0.2em] mb-2">
                DETAILED CONTEXT & FRICTION DESCRIPTION *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe the current developer bottleneck. Why do existing tools fall short? What is the expected behavior?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-white/20 px-4 py-3 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
              />
            </div>

            {/* Tech Stack Pills Input */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#0057ff] uppercase tracking-[0.2em] mb-2">
                RECOMMENDED TECH STACK TAGS
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#0057ff] text-white px-3 py-1 text-xs font-mono font-bold uppercase"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechTag(tag)}
                      className="hover:text-black"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="TYPE TECH (E.G. GO, RUST, REDIS) & PRESS ADD..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="flex-1 bg-black border border-white/20 px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleAddTechTag}
                  className="border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-white/20 transition"
                >
                  ADD TAG
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 pt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className="border border-white/20 bg-transparent px-6 py-3 text-xs font-mono font-bold uppercase text-white/70 hover:text-white hover:bg-white/5 transition"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#0057ff] px-6 py-3 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-[#0046d5] transition shadow-lg"
              >
                <span className="material-symbols-outlined text-base">publish</span>
                SUBMIT & GENERATE ROADMAP
              </button>
            </div>
          </form>
        </div>

        {/* Right Guidelines Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-syne text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0057ff] text-xl">lightbulb</span>
              Directives
            </h3>
            <ul className="space-y-3 text-xs text-white/70 leading-relaxed font-space">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#0057ff] text-base mt-0.5">check</span>
                <span>Focus on <strong>real engineering bottlenecks</strong> rather than superficial UI features.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#0057ff] text-base mt-0.5">check</span>
                <span>Specify concrete technical metrics (latency targets, throughput, memory bounds).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#0057ff] text-base mt-0.5">check</span>
                <span>List technologies that provide realistic production solutions.</span>
              </li>
            </ul>
          </div>

          <div className="border border-white/10 bg-black p-6 text-xs text-white/50 font-mono">
            <span className="text-[#0057ff] font-bold block mb-1">AUTOMATED VERIFICATION</span>
            Once submitted, Gemini validates your report, assigns an Impact Score, and generates a 4-week execution roadmap.
          </div>
        </div>
      </div>
    </div>
  );
};

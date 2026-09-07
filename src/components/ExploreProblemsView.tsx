import React, { useState } from 'react';
import { ProblemItem, PageTab } from '../types';

interface ExploreProblemsViewProps {
  problems: ProblemItem[];
  onSelectProblem: (problem: ProblemItem) => void;
  setActiveTab: (tab: PageTab) => void;
  onLikeProblem: (problemId: string) => void;
  savedProjectIds: string[];
  onToggleSaveProject: (problemId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onLoadMoreProblems?: () => void;
  hasMoreProblems?: boolean;
  totalProblemsCount?: number;
}

const SECTORS = ['All', 'DevTools', 'AI/ML', 'Fintech', 'Web3', 'Healthtech', 'E-Commerce', 'Security'];

export const ExploreProblemsView: React.FC<ExploreProblemsViewProps> = ({
  problems,
  onSelectProblem,
  setActiveTab,
  onLikeProblem,
  savedProjectIds,
  onToggleSaveProject,
  isLoading = false,
  onRefresh,
  onLoadMoreProblems,
  hasMoreProblems = false,
  totalProblemsCount,
}) => {
  // Normalize problems to have consistent id field
  const normalizedProblems = problems.map((p) => ({
    ...p,
    id: p._id || p.id,
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [sortBy, setSortBy] = useState<'likes' | 'newest' | 'impact'>('likes');

  // Collect unique tech stack items across all problems
  const allTechs = Array.from(new Set(normalizedProblems.flatMap((p) => p.techStack)));

  const filteredProblems = normalizedProblems.filter((p) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTech = p.techStack.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTech) return false;
    }

    // Sector match
    if (selectedSector !== 'All' && p.sector !== selectedSector) return false;

    // Difficulty match
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;

    // Tech match
    if (selectedTech !== 'All' && !p.techStack.includes(selectedTech)) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'likes') return b.likes - a.likes;
    if (sortBy === 'impact') return (b.impactScore || 0) - (a.impactScore || 0);
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-6">
        <div>
          <span className="text-[#0057ff] text-xs font-mono font-bold tracking-[0.3em] uppercase">Phase 02 // Directory Query</span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
            Indexed <span className="text-transparent stroke-white">Problems</span>
          </h1>
          <p className="text-xs text-white/60 mt-2 max-w-xl">
            Continuously parsed friction targets extracted from active GitHub issues, StackOverflow threads, and developer communities.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit-problem')}
          className="flex items-center gap-2 bg-[#0057ff] px-6 py-3 text-xs font-black tracking-[0.2em] uppercase text-white hover:bg-[#0046d5] transition shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Submit New Friction Signal
        </button>
      </div>

      {/* Search Input & Filtering Bar */}
      <div className="border border-white/10 bg-white/[0.02] p-6 mb-8">
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search problems by keywords (e.g. Rust, RAG, WebAssembly, rate limiting)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-white/20 pl-12 pr-4 py-3.5 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase tracking-wider"
          />
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar border-b border-white/10 mb-6">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition whitespace-nowrap ${
                selectedSector === sector
                  ? 'bg-[#0057ff] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Difficulty & Tech Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-white/40 uppercase tracking-wider text-[10px]">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-black border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none font-mono uppercase"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white/40 uppercase tracking-wider text-[10px]">Tech Stack:</span>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="bg-black border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none font-mono uppercase"
              >
                <option value="All">All Tech Stack</option>
                {allTechs.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/40 uppercase tracking-wider text-[10px]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-black border border-[#0057ff] px-3 py-1.5 text-xs text-[#0057ff] font-bold focus:outline-none font-mono uppercase"
            >
              <option value="likes">Most Upvoted</option>
              <option value="impact">Highest Impact Score</option>
              <option value="newest">Recently Scraped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-6 uppercase tracking-wider">
        <span>Displaying {filteredProblems.length} of {totalProblemsCount || problems.length} indexed directives</span>
        {(selectedSector !== 'All' || selectedDifficulty !== 'All' || selectedTech !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSector('All');
              setSelectedDifficulty('All');
              setSelectedTech('All');
              setSearchQuery('');
            }}
            className="text-[#0057ff] hover:underline font-bold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0057ff] border-t-transparent"></div>
        </div>
      )}

      {!isLoading && filteredProblems.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <span className="material-symbols-outlined text-4xl mb-2 block">filter_alt</span>
          <p className="text-xs font-mono uppercase">No problems found</p>
          {onRefresh && (
            <button onClick={onRefresh} className="mt-2 text-[#0057ff] hover:underline text-xs font-mono uppercase">
              Refresh
            </button>
          )}
        </div>
      )}

      {!isLoading && filteredProblems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => {
              const isSaved = savedProjectIds.includes(problem.id);

              return (
                <div
                  key={problem.id}
                  className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-6 flex flex-col justify-between transition relative group"
                >
                  <div>
                    {/* Sector & Verified Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0057ff]/20 text-[#0057ff] border border-[#0057ff]/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                          {problem.sector}
                        </span>
                        <span className="bg-white/5 text-white/60 border border-white/10 px-2 py-0.5 text-[10px] font-mono uppercase">
                          {problem.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleSaveProject(problem.id)}
                        className={`p-1.5 border transition ${
                          isSaved
                            ? 'bg-[#0057ff] border-[#0057ff] text-white'
                            : 'border-white/10 text-white/40 hover:text-white'
                        }`}
                        title={isSaved ? "Remove from saved" : "Save project"}
                      >
                        <span className="material-symbols-outlined text-base">
                          {isSaved ? 'bookmark_added' : 'bookmark'}
                        </span>
                      </button>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProblem(problem)}
                      className="text-base font-bold text-white uppercase tracking-tight mb-2 line-clamp-2 hover:text-[#0057ff] transition cursor-pointer"
                    >
                      {problem.title}
                    </h3>

                    <p className="text-xs text-white/70 line-clamp-3 mb-5 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5 border-t border-white/10 pt-4">
                      {problem.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/80 uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <button
                          onClick={() => onLikeProblem(problem.id)}
                          className="flex items-center gap-1 text-white/80 hover:text-[#0057ff] transition"
                        >
                          <span>♥ {problem.likes}</span>
                        </button>

                        <span className="text-white/40">
                          {problem.buildersCount} BUILDERS
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectProblem(problem)}
                        className="flex items-center gap-1 font-bold text-[10px] tracking-widest uppercase text-white hover:text-[#0057ff] transition"
                      >
                        ROADMAP
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMoreProblems && onLoadMoreProblems && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={onLoadMoreProblems}
                className="flex items-center gap-2 border border-[#0057ff] bg-[#0057ff]/10 hover:bg-[#0057ff] text-[#0057ff] hover:text-white px-8 py-3 text-xs font-mono font-bold uppercase tracking-widest transition shadow-lg"
              >
                <span className="material-symbols-outlined text-base">expand_more</span>
                Load More Indexed Problems ({problems.length} of {totalProblemsCount || 'more'})
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
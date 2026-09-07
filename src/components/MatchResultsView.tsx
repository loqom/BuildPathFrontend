import React, { useState } from 'react';
import { UserProfile, PageTab, Project } from '../types';

interface MatchResultsViewProps {
  matches: Project[];
  userProfile: UserProfile;
  setActiveTab: (tab: PageTab) => void;
  onSelectProjectMatch: (match: Project) => void;
  savedProjectIds: string[];
  onToggleSaveProject: (problemId: string) => void;
}

const complexityOrder = { easy: 1, medium: 2, hard: 3 };

export const MatchResultsView: React.FC<MatchResultsViewProps> = ({
  matches,
  userProfile,
  setActiveTab,
  onSelectProjectMatch,
  savedProjectIds,
  onToggleSaveProject,
}) => {
  const [complexityFilter, setComplexityFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMatches = matches
    .filter((m) => {
      if (complexityFilter !== 'All' && m.complexity !== complexityFilter.toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => complexityOrder[a.complexity] - complexityOrder[b.complexity]);

  const formatComplexity = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400 mb-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-base">verified</span>
            MATCH PIPELINE COMPLETED
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
            Matched <span className="text-transparent stroke-white">Projects</span>
          </h1>
          <p className="text-xs text-white/60 mt-2">
            Tailored profile: <span className="text-[#0057ff] font-mono uppercase font-bold">{userProfile.techStack.join(', ') || 'Not specified'}</span> • <span className="text-white uppercase font-mono">{userProfile.experienceLevel}</span> • <span className="text-white uppercase font-mono">{userProfile.primaryGoal}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('onboarding')}
            className="flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-xs font-mono font-bold uppercase text-white hover:bg-white/10 transition"
          >
            <span className="material-symbols-outlined text-base text-[#0057ff]">tune</span>
            Edit Profile & Re-Match
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-black p-4 border border-white/10 font-mono text-xs uppercase">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <span className="text-white/40 tracking-wider">Complexity:</span>
          {['All', 'Easy', 'Medium', 'Hard'].map((comp) => (
            <button
              key={comp}
              onClick={() => setComplexityFilter(comp)}
              className={`px-3 py-1.5 font-bold transition ${
                complexityFilter === comp
                  ? 'bg-[#0057ff] text-white'
                  : 'text-white/60 hover:text-white border border-white/5 bg-white/5'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 border ${viewMode === 'grid' ? 'bg-[#0057ff] border-[#0057ff] text-white' : 'border-white/10 text-white/40'}`}
            title="Grid View"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 border ${viewMode === 'list' ? 'bg-[#0057ff] border-[#0057ff] text-white' : 'border-white/10 text-white/40'}`}
            title="List View"
          >
            <span className="material-symbols-outlined text-base">view_list</span>
          </button>
        </div>
      </div>

      {/* Match Cards List / Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredMatches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/50">
            <span className="material-symbols-outlined text-4xl mb-2 block">filter_alt</span>
            No projects match the selected filter.
          </div>
        ) : (
          filteredMatches.map((match) => {
            const isBookmarked = savedProjectIds.includes(match._id);

            return (
              <div
                key={match._id}
                className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-6 flex flex-col justify-between transition relative group"
              >
                <div>
                  {/* Score Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0057ff] text-white px-3 py-1 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        {match.matchScore}% MATCH
                      </span>
                      <span className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase">
                        {formatComplexity(match.complexity)}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleSaveProject(match._id)}
                      className={`p-1.5 border transition ${
                        isBookmarked
                          ? 'bg-[#0057ff] border-[#0057ff] text-white'
                          : 'border-white/10 text-white/40 hover:text-white'
                      }`}
                      title={isBookmarked ? "Remove from saved" : "Bookmark project"}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isBookmarked ? 'bookmark_added' : 'bookmark'}
                      </span>
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectProjectMatch(match)}
                    className="text-lg font-bold text-white uppercase tracking-tight mb-2 line-clamp-2 hover:text-[#0057ff] transition cursor-pointer"
                  >
                    {match.title}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                    {match.problemStatement}
                  </p>

                  {/* AI Rationale Box */}
                  <div className="bg-black border border-white/10 p-3.5 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#0057ff] uppercase tracking-wider mb-1">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      RATIONALE // VECTOR MATCH
                    </div>
                    <p className="text-xs text-white/80 leading-snug">
                      {match.proposedSolution}
                    </p>
                  </div>

                  {/* Requirements List */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 block mb-1">
                      Core MVP Directives:
                    </span>
                    {match.features.mvp.slice(0, 3).map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-white/80">
                        <span className="material-symbols-outlined text-sm text-[#0057ff] mt-0.5">check_circle</span>
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase">
                    {match.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-white/5 border border-white/10 px-2 py-0.5 text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectProjectMatch(match)}
                    className="w-full flex items-center justify-center gap-2 bg-[#0057ff] px-4 py-3 text-xs font-black tracking-[0.2em] uppercase text-white hover:bg-[#0046d5] transition active:scale-95 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-base">map</span>
                    View {match.roadmap.length}-Week Execution Roadmap
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
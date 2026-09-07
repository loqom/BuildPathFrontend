import React from 'react';
import { Project, PageTab } from '../types';

interface SavedProjectsViewProps {
  savedProblems: Project[];
  setActiveTab: (tab: PageTab) => void;
  onSelectProblem: (problem: Project) => void;
  onRemoveSavedProject: (problemId: string) => void;
}

export const SavedProjectsView: React.FC<SavedProjectsViewProps> = ({
  savedProblems,
  setActiveTab,
  onSelectProblem,
  onRemoveSavedProject,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-2">
            <span className="material-symbols-outlined text-base">bookmark</span>
            MY ACTIVE BUILD ROADMAPS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Saved Projects ({savedProblems.length})
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Track your 4-week execution progress across your active engineering portfolio targets.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Find More Projects
        </button>
      </div>

      {savedProblems.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 my-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">bookmark_border</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Saved Projects Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Run the AI Match Pipeline or explore indexed problems to save roadmaps to your active dashboard.
          </p>
          <button
            onClick={() => setActiveTab('onboarding')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Run AI Match Pipeline
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedProblems.map((problem) => (
            <div
              key={problem._id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-cyan-950/80 px-2.5 py-1 text-[11px] font-mono text-cyan-300 border border-cyan-800/40">
                    {problem.techStack[0] || 'DevTools'}
                  </span>
                  <button
                    onClick={() => onRemoveSavedProject(problem._id)}
                    className="text-slate-400 hover:text-red-400 transition"
                    title="Remove project"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>

                <h3
                  onClick={() => onSelectProblem(problem)}
                  className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-cyan-300 transition cursor-pointer"
                >
                  {problem.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {problem.problemStatement || problem.oneLiner || ''}
                </p>

                {/* Progress bar */}
                <div className="mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>PROGRESS: WEEK 1/4</span>
                    <span className="text-cyan-400 font-bold">25%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>

              <div>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5 border-t border-slate-800/80 pt-4">
                  {problem.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectProblem(problem)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  Open Execution Roadmap
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

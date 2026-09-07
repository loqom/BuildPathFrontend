import React, { useState } from 'react';
import { Project, PageTab } from '../types';

interface RoadmapViewProps {
  problem: Project;
  setActiveTab: (tab: PageTab) => void;
  onSaveToMyProjects: (problem: Project) => void;
  isSavedInMyProjects: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  problem,
  setActiveTab,
  onSaveToMyProjects,
  isSavedInMyProjects,
}) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const currentRoadmapWeeks = problem.roadmap || [];
  const currentMvpReqs = problem.features?.mvp || [];
  const currentStretchGoals = problem.features?.stretch || [];

  const allTaskIds = (currentRoadmapWeeks || []).flatMap((w: any) =>
    (w.tasks || []).map((t: string, idx: number) => `w${w.week}-t${idx}`)
  );
  const completedCount = allTaskIds.filter((id: string) => completedTasks[id]).length;
  const progressPercent = allTaskIds.length > 0 ? Math.round((completedCount / allTaskIds.length) * 100) : 0;

  const formatComplexity = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('match-results')}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-white/60 hover:text-white transition mb-6"
      >
        <span className="material-symbols-outlined text-base text-[#0057ff]">arrow_back</span>
        BACK TO MATCHED PROJECTS
      </button>

      {/* Main Roadmap Header Card */}
      <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs uppercase">
          <span className="bg-[#0057ff] text-white px-3 py-1 font-bold">
            AI MATCHED
          </span>
          <span className="bg-white/5 border border-white/10 px-3 py-1 text-white/70">
            {formatComplexity(problem.complexity)}
          </span>
          <span className="inline-flex items-center gap-1 border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-emerald-400 font-bold">
            <span className="material-symbols-outlined text-sm">verified</span>
            VALIDATED
          </span>
          <span className="ml-auto text-white/80 bg-black px-3 py-1 border border-white/10">
            MATCH: {problem.matchScore}%
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
          {problem.title}
        </h1>

        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
          {problem.oneLiner}
        </p>

        <div className="text-xs text-white/60 mb-2">
          <strong>Problem:</strong> {problem.problemStatement}
        </div>
        <div className="text-xs text-white/60 mb-6">
          <strong>Solution:</strong> {problem.proposedSolution}
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6 font-mono text-xs uppercase">
          <span className="text-white/40 mr-2">Tech Stack:</span>
          {problem.techStack.map((tech) => (
            <span
              key={tech}
              className="bg-black border border-white/10 px-3 py-1 text-white/90"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Progress Summary Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex-1 w-full sm:w-auto font-mono text-xs uppercase">
            <div className="flex justify-between text-white/70 mb-2">
              <span>BUILD PROGRESS: {completedCount}/{allTaskIds.length} TASKS</span>
              <span className="text-[#0057ff] font-bold">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-black border border-white/10 overflow-hidden">
              <div
                className="h-full bg-[#0057ff] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => onSaveToMyProjects(problem)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold uppercase transition ${
                isSavedInMyProjects
                  ? 'border border-emerald-500/50 bg-emerald-950/40 text-emerald-400'
                  : 'bg-[#0057ff] text-white hover:bg-[#0046d5] shadow-lg'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isSavedInMyProjects ? 'bookmark_added' : 'bookmark_add'}
              </span>
              {isSavedInMyProjects ? 'SAVED TO MY PROJECTS' : 'START BUILDING THIS'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column (MVP & Stretch), Right Column (Roadmap Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requirements */}
        <div className="lg:col-span-1 space-y-6">
          {/* MVP Requirements Card */}
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0057ff] text-xl">fact_check</span>
              MVP Directives
            </h3>
            <div className="space-y-3">
              {currentMvpReqs.map((req: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                  <span className="material-symbols-outlined text-base text-[#0057ff] mt-0.5">check_circle</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stretch Goals Card */}
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-xl">rocket_launch</span>
              Stretch Objectives
            </h3>
            <div className="space-y-3">
              {currentStretchGoals.map((goal: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                  <span className="material-symbols-outlined text-base text-purple-400 mt-0.5">stars</span>
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* External Links / Github Setup */}
          <div className="border border-white/10 bg-black p-6 text-xs text-white/70">
            <h4 className="font-bold uppercase text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0057ff] text-base">folder_zip</span>
              Repository Starter
            </h4>
            <p className="text-white/50 mb-4">
              Initialize your codebase with pre-configured CI/CD workflows and linting rules.
            </p>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono font-bold uppercase text-[#0057ff] hover:underline"
            >
              CREATE GITHUB REPO
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Right Column: Execution Plan Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0057ff]">calendar_month</span>
              {currentRoadmapWeeks.length}-Week Execution Milestone Roadmap
            </h2>
            <span className="text-xs font-mono uppercase text-white/40">
              Estimated: {problem.estimatedTime}
            </span>
          </div>

          <div className="space-y-4">
            {currentRoadmapWeeks.length === 0 ? (
              <div className="border border-white/10 bg-white/[0.02] p-8 text-center text-white/50">
                <span className="material-symbols-outlined text-4xl mb-2 block text-[#0057ff]">map</span>
                <p className="text-xs font-mono uppercase">No roadmap data available</p>
                <p className="text-[10px] mt-1">Run the pipeline to generate a roadmap</p>
              </div>
            ) : (
              currentRoadmapWeeks.map((weekData: any) => (
                <div
                  key={weekData.week}
                  className="border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 transition"
                >
                  <div className="flex items-center justify-between mb-3 font-mono text-xs uppercase">
                    <span className="bg-[#0057ff] text-white px-3 py-1 font-bold">
                      WEEK 0{weekData.week}
                    </span>
                    <span className="text-white/40">
                      {weekData.tasks.filter((_: any, idx: number) => completedTasks[`w${weekData.week}-t${idx}`]).length} / {weekData.tasks.length} COMPLETED
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase text-white mb-1">
                    {weekData.title}
                  </h3>
                  <p className="text-xs text-white/70 mb-5 leading-relaxed">
                    {weekData.description || `Week ${weekData.week} milestone`}
                  </p>

                  {/* Task Checklist */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {weekData.tasks.map((task: string, taskIdx: number) => {
                      const taskId = `w${weekData.week}-t${taskIdx}`;
                      const isChecked = !!completedTasks[taskId];

                      return (
                        <label
                          key={taskId}
                          className={`flex items-start gap-3 p-3 border cursor-pointer transition select-none ${
                            isChecked
                              ? 'bg-black border-white/5 text-white/30 line-through'
                              : 'bg-black/60 border-white/10 text-white hover:border-white/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTask(taskId)}
                            className="mt-0.5 border-white/20 bg-black text-[#0057ff] focus:ring-0 h-4 w-4"
                          />
                          <span className="text-xs leading-relaxed">{task}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
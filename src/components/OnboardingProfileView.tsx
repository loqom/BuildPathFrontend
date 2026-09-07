import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, CommitmentLevel, PrimaryGoal, SkillLevel, Goal } from '../types';
import { pipelineService } from '../services/pipeline.service';

interface OnboardingProfileViewProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onStartPipeline: (sessionId: string) => void;
  openAuthModal?: () => void;
}

const PRESET_TECH_STACKS = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Rust', 'Go', 
  'PostgreSQL', 'Redis', 'Docker', 'WebAssembly', 'Gemini API', 
  'Next.js', 'GraphQL', 'Kubernetes', 'Tailwind', 'Solidity'
];

const EXPERIENCE_TO_SKILL: Record<ExperienceLevel, SkillLevel> = {
  'Junior': 'beginner',
  'Mid': 'intermediate',
  'Senior': 'advanced',
  'Staff/Lead': 'advanced',
};

const GOAL_MAP: Record<PrimaryGoal, Goal> = {
  'Portfolio Building': 'learning',
  'Startup MVP': 'startup',
  'Skill Mastery': 'learning',
  'Open Source Contribution': 'freelance',
};

const COMMITMENT_TO_TIME: Record<CommitmentLevel, string> = {
  'Casual (< 5 hrs/wk)': '5 hours/week',
  'Moderate (5-15 hrs/wk)': '10 hours/week',
  'Dedicated (15+ hrs/wk)': '20 hours/week',
};

export const OnboardingProfileView: React.FC<OnboardingProfileViewProps> = ({
  userProfile,
  setUserProfile,
  onStartPipeline,
  openAuthModal,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTech = (tech: string) => {
    if (userProfile.techStack.includes(tech)) {
      setUserProfile((prev) => ({
        ...prev,
        techStack: prev.techStack.filter((t) => t !== tech),
      }));
    } else {
      setUserProfile((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tech],
      }));
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const clean = customInput.trim();
    if (!userProfile.techStack.includes(clean)) {
      setUserProfile((prev) => ({
        ...prev,
        techStack: [...prev.techStack, clean],
      }));
    }
    setCustomInput('');
  };

  const handleResetTechStack = () => {
    setUserProfile((prev) => ({
      ...prev,
      techStack: [],
    }));
  };

  const handleStartPipeline = async () => {
    if (userProfile.techStack.length === 0) {
      setError('Please select at least one technology');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const skillLevel = EXPERIENCE_TO_SKILL[userProfile.experienceLevel];
      const goal = GOAL_MAP[userProfile.primaryGoal];
      const timeAvailable = COMMITMENT_TO_TIME[userProfile.commitment];

      const response = await pipelineService.startPipeline({
        techStack: userProfile.techStack,
        skillLevel,
        timeAvailable,
        goal,
      });

      if (response.success && response.sessionId) {
        onStartPipeline(response.sessionId);
      } else {
        setError(response.message || 'Failed to start pipeline');
      }
    } catch (err: any) {
      const serverMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message;
      setError(serverMsg || 'Failed to start pipeline. Please ensure you are signed in.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      {/* Header */}
      <div className="text-center mb-10 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 border border-[#0057ff]/40 bg-[#0057ff]/10 px-3.5 py-1 text-xs font-mono font-bold text-[#0057ff] mb-3 uppercase tracking-widest">
          <span className="material-symbols-outlined text-base">tune</span>
          STEP 01 // PROFILE CONFIGURATION
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2">
          Target <span className="text-transparent stroke-white">Stack</span> & Profile
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
          Configure your engineering stack. Our AI pipeline will compute vector distances against indexed developer friction targets.
        </p>
      </div>

      <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 space-y-8">
        {/* 1. Tech Stack Selection */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0057ff] mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center bg-[#0057ff] text-white text-[10px] font-mono">01</span>
              Primary Tech Stack & Tools
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/40">
                {userProfile.techStack.length} SELECTED
              </span>
              {userProfile.techStack.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetTechStack}
                  className="text-[10px] font-mono uppercase text-red-400 hover:text-red-300 transition flex items-center gap-1 border border-red-500/30 bg-red-950/30 px-2 py-0.5 hover:bg-red-950/50"
                  title="Reset selected tech stack"
                >
                  <span className="material-symbols-outlined text-[12px] leading-none">restart_alt</span>
                  RESET
                </button>
              )}
            </div>
          </label>

          <p className="text-xs text-white/60 mb-4">
            Select the languages, frameworks, and storage layers you want to deploy in your next project.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {PRESET_TECH_STACKS.map((tech) => {
              const isSelected = userProfile.techStack.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase border transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#0057ff] border-[#0057ff] text-white'
                      : 'bg-black border-white/10 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {isSelected ? 'check' : 'add'}
                  </span>
                  {tech}
                </button>
              );
            })}
          </div>

          {/* Add custom stack tag */}
          <form onSubmit={handleAddCustom} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="ADD CUSTOM STACK (E.G. CLICKHOUSE, PYTORCH)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-black border border-white/20 px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
            />
            <button
              type="submit"
              className="border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-white/20 transition"
            >
              ADD
            </button>
          </form>
        </div>

        <div className="border-t border-white/10 pt-8">
          {/* 2. Experience Level */}
          <label className="block text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0057ff] mb-3 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center bg-[#0057ff] text-white text-[10px] font-mono">02</span>
            ENGINEERING LEVEL
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {(['Junior', 'Mid', 'Senior', 'Staff/Lead'] as ExperienceLevel[]).map((level) => {
              const isSelected = userProfile.experienceLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUserProfile((prev) => ({ ...prev, experienceLevel: level }))}
                  className={`p-4 text-left border transition ${
                    isSelected
                      ? 'bg-[#0057ff]/20 border-[#0057ff] text-white'
                      : 'bg-black border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <div className="text-sm font-bold uppercase mb-1">{level}</div>
                  <div className="text-[10px] text-white/50 uppercase">
                    {level === 'Junior' && 'Foundational skills'}
                    {level === 'Mid' && 'Independent builder'}
                    {level === 'Senior' && 'Production architecture'}
                    {level === 'Staff/Lead' && 'System design expert'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* 3. Commitment Level */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0057ff] mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center bg-[#0057ff] text-white text-[10px] font-mono">03</span>
              WEEKLY COMMITMENT
            </label>
            <div className="space-y-2.5 mt-4">
              {([
                'Casual (< 5 hrs/wk)',
                'Moderate (5-15 hrs/wk)',
                'Dedicated (15+ hrs/wk)'
              ] as CommitmentLevel[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setUserProfile((prev) => ({ ...prev, commitment: c }))}
                  className={`w-full px-4 py-3 text-xs font-mono uppercase text-left border transition flex items-center justify-between ${
                    userProfile.commitment === c
                      ? 'bg-[#0057ff]/20 border-[#0057ff] text-white font-bold'
                      : 'bg-black border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <span>{c}</span>
                  {userProfile.commitment === c && (
                    <span className="material-symbols-outlined text-sm text-[#0057ff]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Primary Goal */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#0057ff] mb-3 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center bg-[#0057ff] text-white text-[10px] font-mono">04</span>
              PRIMARY DIRECTIVE
            </label>
            <div className="space-y-2.5 mt-4">
              {([
                'Portfolio Building',
                'Startup MVP',
                'Skill Mastery',
                'Open Source Contribution'
              ] as PrimaryGoal[]).map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setUserProfile((prev) => ({ ...prev, primaryGoal: goal }))}
                  className={`w-full px-4 py-3 text-xs font-mono uppercase text-left border transition flex items-center justify-between ${
                    userProfile.primaryGoal === goal
                      ? 'bg-[#0057ff]/20 border-[#0057ff] text-white font-bold'
                      : 'bg-black border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <span>{goal}</span>
                  {userProfile.primaryGoal === goal && (
                    <span className="material-symbols-outlined text-sm text-[#0057ff]">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#0057ff]">bolt</span>
            AI Pipeline execution ~2 min
          </div>

          {error && (
            <div className="w-full sm:w-auto p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs text-center flex flex-col sm:flex-row items-center gap-2">
              <span>{error}</span>
              {openAuthModal && error.toLowerCase().includes('sign in') && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-3 py-1 bg-red-500 text-white font-bold text-[10px] uppercase rounded hover:bg-red-400 transition"
                >
                  Sign In Now
                </button>
              )}
            </div>
          )}

          <button
            id="start-ai-pipeline-btn"
            onClick={handleStartPipeline}
            disabled={isStarting || userProfile.techStack.length === 0}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-xs font-black tracking-[0.25em] uppercase text-white transition shadow-xl active:scale-95 ${
              isStarting || userProfile.techStack.length === 0
                ? 'bg-white/10 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-[#0057ff] hover:bg-[#0046d5]'
            }`}
          >
            <span className="material-symbols-outlined text-base">{isStarting ? 'sync' : 'memory'}</span>
            {isStarting ? 'Starting Pipeline...' : 'Execute AI Match Pipeline'}
          </button>
        </div>
      </div>
    </div>
  );
};
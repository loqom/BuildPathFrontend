import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  SkillLevel,
  Goal,
  ExperienceLevel,
  CommitmentLevel,
  PrimaryGoal,
} from '../types';

import { authService } from '../services/auth.service';
import { projectService } from '../services/project.service';
import { getAvatar, handleAvatarError } from '../utils/avatar';

// ============================================================
// CONSTANTS
// ============================================================

const EXPERIENCE_TO_SKILL: Record<
  ExperienceLevel,
  SkillLevel
> = {
  Junior: 'beginner',
  Mid: 'intermediate',
  Senior: 'advanced',
  'Staff/Lead': 'advanced',
};

const GOAL_MAP: Record<PrimaryGoal, Goal> = {
  'Portfolio Building': 'learning',
  'Startup MVP': 'startup',
  'Skill Mastery': 'learning',
  'Open Source Contribution': 'freelance',
};

const PRESET_TECH_STACKS = [
  'Node.js',
  'React',
  'Python',
  'MongoDB',
  'PostgreSQL',
  'FastAPI',
  'Express',
  'Vue',
  'Angular',
  'NextJS',
  'LangChain',
  'Docker',
  'AWS',
  'TypeScript',
  'GraphQL',
];

const EXPERIENCE_OPTIONS: ExperienceLevel[] = [
  'Junior',
  'Mid',
  'Senior',
  'Staff/Lead',
];

const GOAL_OPTIONS: PrimaryGoal[] = [
  'Portfolio Building',
  'Startup MVP',
  'Skill Mastery',
  'Open Source Contribution',
];

const COMMITMENT_OPTIONS: CommitmentLevel[] = [
  'Casual (< 5 hrs/wk)',
  'Moderate (5-15 hrs/wk)',
  'Dedicated (15+ hrs/wk)',
];

const DNA_COLORS = [
  '#10B981',
  '#3B82F6',
  '#F59E0B',
  '#6C63FF',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#EF4444',
];

const SKILL_DOTS: Record<
  ExperienceLevel,
  boolean[]
> = {
  Junior: [true, false, false, false, false],
  Mid: [true, true, true, false, false],
  Senior: [true, true, true, true, false],
  'Staff/Lead': [true, true, true, true, true],
};

// ============================================================
// HELPERS
// ============================================================

const getGithubAvatar = (handle?: string) => getAvatar(undefined, handle);

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) => (
  <div className="bg-black/30 border border-white/10 rounded-xl p-4 hover:border-violet-500/30 transition">
    <div className="flex items-center justify-between mb-3">
      <span className="material-symbols-outlined text-violet-400">
        {icon}
      </span>

      <span className="text-[10px] font-mono text-violet-400 uppercase">
        View all →
      </span>
    </div>

    <div className="text-2xl font-syne font-bold text-white">
      {value}
    </div>

    <div className="text-[10px] font-mono uppercase text-white/40 mt-1">
      {label}
    </div>
  </div>
);

// ============================================================
// STAT ROW
// ============================================================

const StatRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-mono uppercase text-white/40">
      {label}
    </span>

    <span className="text-sm font-syne font-bold text-white">
      {value}
    </span>
  </div>
);

// ============================================================
// INPUT FIELD
// ============================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  icon,
  prefix,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => void;
  disabled?: boolean;
  icon?: string;
  prefix?: ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-mono uppercase tracking-wider text-white/40">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/30 text-sm">
          {icon}
        </span>
      )}

      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono">
          {prefix}
        </span>
      )}

      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-10 bg-black/40 border border-white/10 rounded-lg px-3 text-xs font-mono text-white placeholder-white/20 focus:border-violet-500/60 focus:outline-none transition ${
          icon ? 'pl-9' : ''
        } ${
          prefix ? 'pl-24' : ''
        } ${
          disabled
            ? 'opacity-70 cursor-not-allowed'
            : ''
        }`}
      />
    </div>
  </div>
);

// ============================================================
// TECH STACK CARD
// ============================================================

const TechStackCard = ({
  techStack,
  isEditMode,
  onToggle,
  onCustomTech,
}: {
  techStack: string[];
  isEditMode: boolean;
  onToggle: (tech: string) => void;
  onCustomTech: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
}) => (
  <div className="glass rounded-2xl p-6 border border-white/10 h-full">

    <div className="flex items-center justify-between mb-2">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2">

        <span className="material-symbols-outlined text-violet-400">
          layers
        </span>

        YOUR TECH STACK

      </h3>

      {isEditMode && (
        <span className="text-[9px] font-mono uppercase text-white/30">
          Editing
        </span>
      )}

    </div>

    <p className="text-[10px] text-white/40 mb-5">
      Select the technologies you work with
    </p>

    <div className="flex flex-wrap gap-3">

      {PRESET_TECH_STACKS.map((tech) => {
        const selected =
          techStack.includes(tech);

        return (
          <button
            key={tech}
            type="button"
            disabled={!isEditMode}
            onClick={() =>
              onToggle(tech)
            }
            className={`px-4 py-2.5 rounded-lg text-xs font-mono border transition-all ${
              selected
                ? 'border-violet-500 bg-violet-500/15 text-white shadow-[0_0_15px_rgba(108,99,255,0.15)]'
                : 'border-white/10 bg-black/20 text-white/60 hover:border-white/30'
            }`}
          >
            {tech}

            <span className="ml-1.5">
              {selected ? '✓' : '+'}
            </span>
          </button>
        );
      })}

    </div>

    {isEditMode && (
      <form
        onSubmit={onCustomTech}
        className="mt-6"
      >

        <p className="text-[10px] text-white/40 mb-2">
          Don't see your tech? Add custom technology
        </p>

        <div className="flex gap-2">

          <input
            name="customTech"
            placeholder="Type tech name..."
            className="flex-1 h-10 bg-black/40 border border-white/10 rounded-lg px-3 text-xs font-mono text-white placeholder-white/20 focus:border-violet-500 focus:outline-none"
          />

          <button
            type="submit"
            className="px-6 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold transition"
          >
            Add
          </button>

        </div>

      </form>
    )}

  </div>
);

// ============================================================
// EXPERIENCE CARD
// ============================================================

const ExperienceCard = ({
  value,
  onChange,
  disabled,
}: {
  value: ExperienceLevel;
  onChange: (value: ExperienceLevel) => void;
  disabled: boolean;
}) => (
  <div className="glass rounded-2xl p-5 border border-white/10">

    <div className="flex items-center justify-between mb-4">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2">

        <span className="material-symbols-outlined text-violet-400">
          monitoring
        </span>

        EXPERIENCE LEVEL

      </h3>

      <button
        type="button"
        className="text-[9px] font-mono border border-white/10 px-3 py-1.5 rounded-lg text-white/50"
      >
        Guide me
      </button>

    </div>

    <div className="grid grid-cols-3 gap-3">

      {(
        [
          'Junior',
          'Mid',
          'Senior',
        ] as ExperienceLevel[]
      ).map((level) => {

        const selected =
          value === level;

        return (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange(level)
            }
            className={`relative rounded-xl border p-4 text-center transition ${
              selected
                ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(108,99,255,0.15)]'
                : 'border-white/10 bg-black/20'
            }`}
          >

            {selected && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs">
                ★
              </span>
            )}

            <div className="w-3 h-3 rounded-full border border-white/30 mx-auto mb-3 flex items-center justify-center">
              {selected && (
                <div className="w-2 h-2 rounded-full bg-violet-400" />
              )}
            </div>

            <div className="text-xs text-white">
              {level === 'Junior'
                ? 'Beginner'
                : level === 'Mid'
                ? 'Intermediate'
                : 'Advanced'}
            </div>

            <div className="flex justify-center gap-1 mt-4">

              {SKILL_DOTS[level].map(
                (filled, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full border ${
                      filled
                        ? 'bg-violet-400 border-violet-400'
                        : 'border-white/30'
                    }`}
                  />
                )
              )}

            </div>

          </button>
        );
      })}

    </div>

  </div>
);

// ============================================================
// PRIMARY GOAL CARD
// ============================================================

const PrimaryGoalCard = ({
  value,
  onChange,
  disabled,
}: {
  value: PrimaryGoal;
  onChange: (value: PrimaryGoal) => void;
  disabled: boolean;
}) => {

  const goals = [
    {
      value: 'Portfolio Building' as PrimaryGoal,
      label: 'Portfolio',
      icon: 'work',
    },
    {
      value: 'Startup MVP' as PrimaryGoal,
      label: 'Startup',
      icon: 'rocket_launch',
    },
    {
      value: 'Skill Mastery' as PrimaryGoal,
      label: 'Learning',
      icon: 'menu_book',
    },
    {
      value: 'Open Source Contribution' as PrimaryGoal,
      label: 'Open Source',
      icon: 'groups',
    },
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2 mb-4">

        <span className="material-symbols-outlined text-violet-400">
          track_changes
        </span>

        PRIMARY GOAL

      </h3>

      <div className="grid grid-cols-4 gap-2">

        {goals.map((goal) => {

          const selected =
            value === goal.value;

          return (
            <button
              key={goal.value}
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange(goal.value)
              }
              className={`rounded-xl border py-4 px-2 text-center transition ${
                selected
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-white/10 bg-black/20'
              }`}
            >

              <span className="material-symbols-outlined text-xl mb-2">
                {goal.icon}
              </span>

              <div className="text-[10px] text-white">
                {goal.label}
              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
};

// ============================================================
// AVAILABILITY CARD
// ============================================================

const AvailabilityCard = ({
  value,
  onChange,
  disabled,
}: {
  value: CommitmentLevel;
  onChange: (
    value: CommitmentLevel
  ) => void;
  disabled: boolean;
}) => {

  const options = [
    'Casual (< 5 hrs/wk)',
    'Moderate (5-15 hrs/wk)',
    'Dedicated (15+ hrs/wk)',
  ] as CommitmentLevel[];

  const labels = [
    '< 5 hrs',
    '5-15 hrs',
    '15-30 hrs',
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-white/10">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2 mb-4">

        <span className="material-symbols-outlined text-violet-400">
          schedule
        </span>

        WEEKLY AVAILABILITY

      </h3>

      <div className="grid grid-cols-3 gap-2">

        {options.map(
          (option, index) => {

            const selected =
              value === option;

            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange(option)
                }
                className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[10px] font-mono transition ${
                  selected
                    ? 'border-violet-500 bg-violet-500/10 text-white'
                    : 'border-white/10 text-white/60'
                }`}
              >

                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selected
                      ? 'border-violet-400'
                      : 'border-white/30'
                  }`}
                >
                  {selected && (
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                  )}
                </span>

                {labels[index]}

              </button>
            );
          }
        )}

      </div>

    </div>
  );
};

// ============================================================
// ACCOUNT DETAILS
// ============================================================

const AccountDetails = ({
  form,
  isEditMode,
  handleChange,
  handleLogout,
}: {
  form: any;
  isEditMode: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => void;
  handleLogout: () => void;
}) => (
  <div className="glass rounded-2xl p-6 border border-white/10">

    <div className="flex items-center justify-between mb-6">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2">

        <span className="material-symbols-outlined text-violet-400">
          person
        </span>

        ACCOUNT DETAILS

      </h3>

      <span className="text-[9px] font-mono text-white/30">
        {isEditMode
          ? 'EDITING'
          : 'PROFILE'}
      </span>

    </div>

    <div className="space-y-5">

      <InputField
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        disabled={!isEditMode}
      />

      <InputField
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        disabled={!isEditMode}
      />

      <InputField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        disabled
        icon="lock"
      />

      <InputField
        label="GitHub Handle"
        name="githubHandle"
        value={form.githubHandle}
        onChange={handleChange}
        disabled={!isEditMode}
        prefix={
          <span className="text-violet-400">
            github.com/
          </span>
        }
      />

      {form.githubHandle && (
        <div className="flex items-center gap-3">

          <img
            src={getGithubAvatar(
              form.githubHandle
            )}
            onError={handleAvatarError}
            alt="GitHub"
            className="w-10 h-10 rounded-full border border-violet-500/30"
          />

          <div>
            <p className="text-xs text-white">
              @{form.githubHandle}
            </p>

            <p className="text-[9px] text-emerald-400">
              GitHub connected
            </p>
          </div>

        </div>
      )}

      <InputField
        label="LinkedIn URL"
        name="linkedin"
        value={form.linkedin}
        onChange={handleChange}
        disabled={!isEditMode}
        prefix={
          <span className="text-blue-400">
            in/
          </span>
        }
      />

    </div>

    <button
      onClick={handleLogout}
      className="mt-6 w-full py-2.5 rounded-lg border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase hover:bg-violet-500/10 transition"
    >
      Logout
    </button>

  </div>
);

// ============================================================
// BUILD HISTORY
// ============================================================

const BuildHistory = ({
  savedProjects,
  loadingProjects,
  navigate,
  setActiveTab,
}: {
  savedProjects: any[];
  loadingProjects: boolean;
  navigate: (path: string) => void;
  setActiveTab?: (tab: string) => void;
}) => (
  <div className="glass rounded-2xl p-6 border border-white/10">

    <div className="flex items-center justify-between mb-5">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2">

        <span className="material-symbols-outlined text-violet-400">
          bookmark
        </span>

        SAVED PROJECTS

      </h3>

      <button
        onClick={() =>
          setActiveTab?.(
            'saved-projects'
          )
        }
        className="text-[10px] font-mono text-violet-400 hover:text-violet-300"
      >
        View All Saved →
      </button>

    </div>

    {loadingProjects ? (

      <div className="flex justify-center py-12">

        <div className="animate-spin w-7 h-7 rounded-full border-2 border-violet-500 border-t-transparent" />

      </div>

    ) : savedProjects.length === 0 ? (

      <div className="text-center py-12 text-white/40">

        <span className="material-symbols-outlined text-4xl mb-2">
          bookmark_border
        </span>

        <p className="text-xs font-mono">
          No saved projects yet.
        </p>

        <p className="text-[10px] text-white/30 mt-1">
          Run the AI Match Pipeline or browse directory to save roadmaps.
        </p>

      </div>

    ) : (

      <div className="space-y-2">

        {savedProjects.slice(0, 5).map(
          (proj) => {

            return (
              <button
                key={proj._id}
                type="button"
                onClick={() =>
                  setActiveTab?.(
                    'saved-projects'
                  )
                }
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-violet-500/30 transition text-left"
              >

                <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(108,99,255,0.8)]" />

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-syne font-bold text-white">
                      {proj.title || 'Saved Project'}
                    </span>

                    <span className="text-[9px] font-mono text-white/30">
                      {proj.createdAt
                        ? new Date(
                            proj.createdAt
                          ).toLocaleDateString()
                        : '—'}
                    </span>

                  </div>

                  <div className="mt-2 flex items-center gap-3">

                    <span className="text-[9px] px-2 py-1 rounded bg-violet-500/10 text-violet-300 font-mono uppercase">
                      {proj.complexity || 'Plan'}
                    </span>

                    <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Roadmap
                    </span>

                  </div>

                </div>

                <span className="material-symbols-outlined text-white/30">
                  chevron_right
                </span>

              </button>
            );
          }
        )}

      </div>

    )}

  </div>
);

// ============================================================
// PROFILE INSIGHTS
// ============================================================

const ProfileInsights = ({
  techStackCount,
  savedProjectsCount,
}: {
  techStackCount: number;
  savedProjectsCount: number;
}) => (
  <div className="glass rounded-2xl p-6 border border-white/10">

    <div className="flex items-center justify-between mb-5">

      <h3 className="text-sm font-bold uppercase text-violet-300 flex items-center gap-2">

        <span className="material-symbols-outlined text-violet-400">
          insights
        </span>

        PROFILE INSIGHTS

      </h3>

      <span className="text-[9px] font-mono border border-white/10 px-3 py-1.5 rounded-lg text-white/40">
        Current
      </span>

    </div>

    <div className="grid grid-cols-2 gap-3">

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

        <span className="material-symbols-outlined text-emerald-400">
          data_usage
        </span>

        <div className="text-2xl font-bold mt-2">
          {techStackCount}
        </div>

        <p className="text-[9px] font-mono text-white/40 uppercase">
          Technologies
        </p>

      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

        <span className="material-symbols-outlined text-blue-400">
          bookmark
        </span>

        <div className="text-2xl font-bold mt-2">
          {savedProjectsCount}
        </div>

        <p className="text-[9px] font-mono text-white/40 uppercase">
          Saved Projects
        </p>

      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

        <span className="material-symbols-outlined text-violet-400">
          bolt
        </span>

        <div className="text-2xl font-bold mt-2">
          —
        </div>

        <p className="text-[9px] font-mono text-white/40 uppercase">
          Pipeline History
        </p>

      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

        <span className="material-symbols-outlined text-amber-400">
          verified
        </span>

        <div className="text-2xl font-bold mt-2">
          {techStackCount > 0
            ? 'Ready'
            : 'Setup'}
        </div>

        <p className="text-[9px] font-mono text-white/40 uppercase">
          Profile Status
        </p>

      </div>

    </div>

  </div>
);

// ============================================================
// SET PASSWORD
// ============================================================

const PasswordSection = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleSetPassword,
  isPasswordSaving,
  isPasswordOpen,
  onClose,
}: {
  newPassword: string;
  setNewPassword: (
    value: string
  ) => void;
  confirmPassword: string;
  setConfirmPassword: (
    value: string
  ) => void;
  handleSetPassword: () => void;
  isPasswordSaving: boolean;
  isPasswordOpen: boolean;
  onClose: () => void;
}) => {
  if (!isPasswordOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl p-6 border border-slate-800 bg-[#0b0b12] text-white shadow-2xl">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <span className="material-symbols-outlined text-cyan-400">
              lock
            </span>

            <h3 className="text-sm font-bold uppercase">
              Create / Reset Password
            </h3>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white transition"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-lg">
              close
            </span>
          </button>

        </div>

        <p className="text-xs leading-relaxed text-white/50 mb-5">
          Set a password to also sign in with email and password. You can
          still sign in with Google.
        </p>

        <div className="space-y-3">

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="Min 6 characters"
              className="w-full h-10 bg-black/50 border border-slate-700 rounded-lg px-3 text-xs font-mono text-white placeholder-white/20 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Re-enter password"
              className="w-full h-10 bg-black/50 border border-slate-700 rounded-lg px-3 text-xs font-mono text-white placeholder-white/20 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSetPassword}
            disabled={
              isPasswordSaving
            }
            className="w-full h-10 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase transition"
          >
            {isPasswordSaving
              ? 'Saving...'
              : 'Set Password'}
          </button>

        </div>

      </div>

    </div>
  );
};

// ============================================================
// DANGER ZONE
// ============================================================

const DangerZone = ({
  deleteConfirmation,
  setDeleteConfirmation,
  handleDeleteAccount,
  isSaving,
}: {
  deleteConfirmation: string;
  setDeleteConfirmation: (
    value: string
  ) => void;
  handleDeleteAccount: () => void;
  isSaving: boolean;
}) => (
  <div className="rounded-2xl p-6 border border-red-500/50 bg-red-500/5">

    <div className="flex items-center gap-2 mb-5">

      <span className="material-symbols-outlined text-red-400">
        warning
      </span>

      <h3 className="text-sm font-bold uppercase text-red-400">
        DANGER ZONE
      </h3>

    </div>

    <div className="border border-red-500/20 rounded-xl bg-red-500/5 p-4">

      <div className="flex items-center justify-between mb-3">

        <span className="text-xs font-syne font-bold text-red-300">
          Delete Account
        </span>

        <span className="material-symbols-outlined text-red-400 text-sm">
          expand_less
        </span>

      </div>

      <p className="text-[10px] leading-relaxed text-white/50 mb-4">
        This action cannot be undone. This
        will permanently delete your
        account and all data.
      </p>

      <div className="flex gap-3">

        <input
          type="text"
          value={deleteConfirmation}
          onChange={(e) =>
            setDeleteConfirmation(
              e.target.value
            )
          }
          placeholder="Type DELETE"
          className="flex-1 h-10 bg-black/50 border border-red-500/20 rounded-lg px-3 text-xs font-mono text-white placeholder-white/20 focus:border-red-500 focus:outline-none uppercase"
        />

        <button
          onClick={handleDeleteAccount}
          disabled={
            deleteConfirmation !==
              'DELETE' ||
            isSaving
          }
          className="px-5 h-10 rounded-lg bg-red-500 hover:bg-red-400 disabled:bg-red-500/10 disabled:text-red-400/30 text-white text-xs font-mono font-bold uppercase transition"
        >
          <span className="material-symbols-outlined text-sm align-middle mr-1">
            delete
          </span>

          Delete Account
        </button>

      </div>

    </div>

  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

interface UserProfilePageProps {
  setActiveTab?: (tab: string) => void;
  onLogout?: () => void;
}

export const UserProfilePage: React.FC<
  UserProfilePageProps
> = ({ setActiveTab, onLogout }) => {

  const navigate = (path: string) => {
    if (setActiveTab) {
      setActiveTab(path === '/' || path === '' ? 'home' : path.replace(/^\//, ''));
    } else {
      window.location.href = path;
    }
  };

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    deleteConfirmation,
    setDeleteConfirmation,
  ] = useState('');

  const [toast, setToast] =
    useState<{
      message: string;
      type: 'success' | 'error';
    } | null>(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [form, setForm] =
    useState<{
      firstName: string;
      lastName: string;
      email: string;
      githubHandle: string;
      linkedin: string;
      bio: string;
      techStack: string[];
      experienceLevel: ExperienceLevel;
      primaryGoal: PrimaryGoal;
      commitment: CommitmentLevel;
      avatar: string;
    }>({
      firstName: '',
      lastName: '',
      email: '',
      githubHandle: '',
      linkedin: '',
      bio: '',
      techStack: [],
      experienceLevel: 'Junior',
      primaryGoal: 'Portfolio Building',
      commitment:
        'Moderate (5-15 hrs/wk)',
      avatar: '',
    });

  const [
    initialForm,
    setInitialForm,
  ] = useState(form);

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    isPasswordSaving,
    setIsPasswordSaving,
  ] = useState(false);

  const [
    isPasswordOpen,
    setIsPasswordOpen,
  ] = useState(false);

  const [
    savedProjects,
    setSavedProjects,
  ] = useState<any[]>([]);

  const [
    loadingProjects,
    setLoadingProjects,
  ] = useState(false);

  // ==========================================================
  // UNSAVED CHANGES
  // ==========================================================

  const hasUnsavedChanges =
    JSON.stringify(form) !==
    JSON.stringify(initialForm);

  // ==========================================================
  // MAPPERS
  // ==========================================================

  const mapSkillToExperience = (
    skill: string
  ): ExperienceLevel => {

    switch (skill) {

      case 'beginner':
        return 'Junior';

      case 'intermediate':
        return 'Mid';

      case 'advanced':
        return 'Senior';

      default:
        return 'Junior';
    }
  };

  const mapGoalToPrimaryGoal = (
    goal: string
  ): PrimaryGoal => {

    switch (goal) {

      case 'placement':
        return 'Skill Mastery';

      case 'freelance':
        return 'Open Source Contribution';

      case 'startup':
        return 'Startup MVP';

      case 'learning':
        return 'Portfolio Building';

      default:
        return 'Portfolio Building';
    }
  };

  // ==========================================================
  // FETCH PROFILE
  // ==========================================================

  useEffect(() => {

    const fetchProfile =
      async () => {

        let stored: any = null;
        try {
          stored = JSON.parse(localStorage.getItem('buildpath_user_profile') || 'null');
        } catch {
          // ignore
        }
        if (!stored?.isLoggedIn) {
          if (onLogout) {
            onLogout();
          } else {
            navigate('/');
          }
          return;
        }

        try {

          const res =
            await authService.getMe();

          if (
            res.success &&
            res.data
          ) {

            const u =
              res.data;

            const newForm = {

              firstName:
                u.firstName || '',

              lastName:
                u.lastName || '',

              email:
                u.email || '',

              githubHandle:
                u.githubHandle ||
                '',

              linkedin:
                u.linkedin || '',

              bio:
                u.bio || '',

              techStack:
                u.techStack || [],

              experienceLevel:
                mapSkillToExperience(
                  u.skillLevel
                ),

              primaryGoal:
                mapGoalToPrimaryGoal(
                  u.goal
                ),

              commitment:
                u.commitment ||
                'Moderate (5-15 hrs/wk)',

              avatar:
                u.avatar || '',
            };

            setForm(newForm);
            setInitialForm(
              newForm
            );
          }

        } catch (error: any) {

          console.error(
            'Failed to fetch profile',
            error
          );
          if (error?.response?.status === 400 || error?.response?.status === 401) {
            if (onLogout) {
              onLogout();
            } else {
              navigate('/');
            }
          }

        }

      };

    fetchProfile();

  }, []);

  // ==========================================================
  // FETCH SAVED PROJECTS
  // ==========================================================

  useEffect(() => {

    if (isEditMode) {
      return;
    }

    let stored: any = null;
    try {
      stored = JSON.parse(localStorage.getItem('buildpath_user_profile') || 'null');
    } catch {
      // ignore
    }
    if (!stored?.isLoggedIn) {
      return;
    }

    const fetchProjects =
      async () => {

        setLoadingProjects(true);

        try {

          const res =
            await projectService.getAllProjects();

          if (
            res.success &&
            res.data
          ) {

            setSavedProjects(
              res.data
            );
          }

        } catch (error) {

          console.error(
            'Failed to fetch saved projects',
            error
          );

        } finally {

          setLoadingProjects(false);

        }

      };

    fetchProjects();

  }, [isEditMode]);

  // ==========================================================
  // DNA SEGMENTS
  // ==========================================================

  const dnaSegments =
    useMemo(() => {

      const total =
        form.techStack.length ||
        1;

      return form.techStack.map(
        (tech, index) => ({
          tech,
          percent: Math.round(
            100 / total
          ),
          color:
            DNA_COLORS[
              index %
                DNA_COLORS.length
            ],
        })
      );

    }, [form.techStack]);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // TECH TOGGLE
  // ==========================================================

  const handleTechToggle = (
    tech: string
  ) => {

    setForm((previous) => ({

      ...previous,

      techStack:
        previous.techStack.includes(
          tech
        )
          ? previous.techStack.filter(
              (item) =>
                item !== tech
            )
          : [
              ...previous.techStack,
              tech,
            ],
    }));
  };

  // ==========================================================
  // CUSTOM TECH
  // ==========================================================

  const handleCustomTech = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const input =
      e.currentTarget.elements.namedItem(
        'customTech'
      ) as HTMLInputElement;

    const value =
      input.value.trim();

    if (
      value &&
      !form.techStack.includes(
        value
      )
    ) {

      setForm((previous) => ({
        ...previous,

        techStack: [
          ...previous.techStack,
          value,
        ],
      }));

      input.value = '';
    }
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSave =
    async () => {

      if (!hasUnsavedChanges) {

        setIsEditMode(false);
        return;
      }

      setIsSaving(true);

      try {

        const payload = {

          firstName:
            form.firstName,

          lastName:
            form.lastName,

          githubHandle:
            form.githubHandle,

          linkedin:
            form.linkedin,

          bio:
            form.bio,

          avatar:
            form.avatar,

          techStack:
            form.techStack,

          skillLevel:
            EXPERIENCE_TO_SKILL[
              form.experienceLevel
            ],

          goal:
            GOAL_MAP[
              form.primaryGoal
            ],

          commitment:
            form.commitment,
        };

        const res =
          await authService.updateProfile(
            payload
          );

        if (res.success) {

          setInitialForm(form);
          setIsEditMode(false);

          showToast(
            'Profile saved successfully',
            'success'
          );

        } else {

          showToast(
            res.message ||
              'Failed to save',
            'error'
          );
        }

      } catch (error: any) {

        showToast(
          error.response?.data
            ?.message ||
            'Failed to save',
          'error'
        );

      } finally {

        setIsSaving(false);

      }
    };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDeleteAccount =
    async () => {

      if (
        deleteConfirmation !==
        'DELETE'
      ) {
        return;
      }

      try {

        const res =
          await authService.deleteAccount(
            'DELETE'
          );

        if (res.success) {

          try {
            localStorage.removeItem('buildpath_user_profile');
          } catch {
            // ignore
          }

          if (onLogout) {
            onLogout();
          } else {
            navigate('/');
          }

        } else {

          showToast(
            res.message ||
              'Failed to delete account',
            'error'
          );

        }

      } catch (error: any) {

        showToast(
          error.response?.data
            ?.message ||
            'Failed to delete',
          'error'
        );

      }
    };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout =
    async () => {

      try {

        const res =
          await authService.logout();

        if (res.success) {

          try {
            localStorage.removeItem('buildpath_user_profile');
          } catch {
            // ignore
          }

          if (onLogout) {
            onLogout();
          } else {
            navigate('/');
          }

        } else {

          showToast(
            res.message ||
              'Failed to logout',
            'error'
          );

        }

      } catch (error: any) {

        // Even if the logout API fails or session is already expired/cleared,
        // clear local auth state and navigate out
        try {
          localStorage.removeItem('buildpath_user_profile');
        } catch {
          // ignore
        }

        if (onLogout) {
          onLogout();
        } else {
          navigate('/');
        }

      }
    };

  // ==========================================================
  // SET PASSWORD
  // ==========================================================

  const handleSetPassword =
    async () => {
      if (
        newPassword.length < 6
      ) {
        showToast(
          'Password must be at least 6 characters',
          'error'
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        showToast(
          'Passwords do not match',
          'error'
        );
        return;
      }

      setIsPasswordSaving(true);

      try {

        const res =
          await authService.setPassword(
            newPassword
          );

        if (res.success) {

          showToast(
            'Password set successfully. You can now sign in with email/password.',
            'success'
          );

          setNewPassword('');
          setConfirmPassword('');
          setIsPasswordOpen(false);

        } else {

          showToast(
            res.message ||
              'Failed to set password',
            'error'
          );

        }

      } catch (error: any) {

        showToast(
          error.response?.data
            ?.message ||
            'Failed to set password',
          'error'
        );

      } finally {

        setIsPasswordSaving(
          false
        );

      }
    };

  // ==========================================================
  // DISCARD
  // ==========================================================

  const handleDiscard =
    () => {

      setForm(initialForm);
      setIsEditMode(false);

    };

  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = (
    message: string,
    type: 'success' | 'error'
  ) => {

    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen bg-[#050509] text-white font-sans">

      {/* ================================================== */}
      {/* TOAST */}
      {/* ================================================== */}

      {toast && (

        <div
          className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl text-xs font-mono border backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}
        >
          {toast.message}
        </div>

      )}

      {/* ================================================== */}
      {/* CREATE / RESET PASSWORD MODAL */}
      {/* ================================================== */}

      <PasswordSection
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSetPassword={handleSetPassword}
        isPasswordSaving={isPasswordSaving}
        isPasswordOpen={isPasswordOpen}
        onClose={() =>
          setIsPasswordOpen(false)
        }
      />

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <main className="max-w-[1400px] mx-auto px-5 py-6 pb-28 space-y-5">

        {/* ================================================= */}
        {/* DEVELOPER IDENTITY */}
        {/* ================================================= */}

        <section>

          <div className="glass rounded-2xl border border-violet-500/30 p-6 lg:p-8 relative overflow-hidden">

            {/* Background glow */}

            <div className="absolute -top-32 -left-20 w-72 h-72 bg-violet-600/10 blur-3xl rounded-full pointer-events-none" />

            <div className="absolute top-0 right-1/3 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Edit */}

           <div className="relative z-30 flex flex-wrap justify-end gap-2 mb-5">

          <button
            type="button"
            onClick={() =>
              setIsPasswordOpen(true)
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all border-cyan-500/50 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
          >

            <span className="material-symbols-outlined text-sm">
              lock_reset
            </span>

            Create / Reset Password

          </button>

          <button
            type="button"
            onClick={() =>
              setIsEditMode((prev) => !prev)
            }
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all ${
              isEditMode
                ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                : 'border-violet-500/50 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20'
            }`}
          >

            <span className="material-symbols-outlined text-sm">
              {isEditMode ? 'close' : 'edit'}
            </span>

            {isEditMode
              ? 'Exit Edit'
              : 'Edit Profile'}

          </button>

        </div>

            <div className="grid lg:grid-cols-12 gap-7">

              {/* ========================================= */}
              {/* AVATAR */}
              {/* ========================================= */}

              <div className="lg:col-span-2 flex justify-center lg:justify-start">

                <div className="relative">

                  <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full p-1 bg-gradient-to-br from-violet-400 via-violet-600 to-blue-500 shadow-[0_0_35px_rgba(108,99,255,0.35)]">

                    <img
                      src={
                        form.avatar ||
                        getGithubAvatar(
                          form.githubHandle
                        )
                      }
                      onError={handleAvatarError}
                      alt={
                        form.firstName
                      }
                      className="w-full h-full rounded-full object-cover"
                    />

                  </div>

                  {isEditMode && (

                    <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#08080d] border border-violet-500/60 flex items-center justify-center cursor-pointer text-violet-300">

                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {

                          const file =
                            e.target.files?.[0];

                          if (!file)
                            return;

                          if (file.size > 200 * 1024) {
                            showToast('Avatar image must be under 200KB', 'error');
                            return;
                          }

                          const reader =
                            new FileReader();

                          reader.onload =
                            () => {

                              setForm(
                                (previous) => ({
                                  ...previous,
                                  avatar:
                                    reader.result as string,
                                })
                              );

                            };

                          reader.readAsDataURL(
                            file
                          );

                        }}
                      />

                    </label>

                  )}

                </div>

              </div>

              {/* ========================================= */}
              {/* IDENTITY */}
              {/* ========================================= */}

              <div className="lg:col-span-4">

                <div className="flex items-center gap-2">

                  {isEditMode ? (

                    <input
                      name="firstName"
                      value={
                        form.firstName
                      }
                      onChange={
                        handleChange
                      }
                      className="text-3xl font-black uppercase tracking-tight bg-transparent border-b border-white/20 focus:border-violet-500 outline-none w-full"
                    />

                  ) : (

                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                      {form.firstName ||
                        'Developer'}{' '}

                      {form.lastName}
                    </h1>

                  )}

                </div>

                <div className="flex items-center gap-3 mt-2">

                  <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                    ● Verified
                  </span>

                  <span className="text-xs text-white/40 font-mono">
                    @{form.githubHandle ||
                      'username'}
                  </span>

                </div>

                {isEditMode ? (

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={
                      handleChange
                    }
                    rows={3}
                    className="mt-5 w-full bg-black/30 border border-white/10 rounded-xl p-4 text-xs text-white/70 resize-none focus:border-violet-500 outline-none"
                    placeholder="Tell people about yourself..."
                  />

                ) : (

                  <p className="mt-5 text-xs leading-6 text-white/50">
                    {form.bio ||
                      'No bio yet. Add one in edit mode.'}
                  </p>

                )}

                <div className="flex flex-wrap gap-2 mt-5">

                  <span className="px-3 py-2 rounded-lg border border-white/10 bg-black/20 text-[9px] font-mono text-white/50">
                    📍 Kanpur, India
                  </span>

                  <span className="px-3 py-2 rounded-lg border border-white/10 bg-black/20 text-[9px] font-mono text-violet-300">
                    🔗 BuildPath
                  </span>

                  <span className="px-3 py-2 rounded-lg border border-white/10 bg-black/20 text-[9px] font-mono text-white/50">
                    Joined
                  </span>

                </div>

              </div>

              {/* ========================================= */}
              {/* DEVELOPER DNA + STATS */}
              {/* ========================================= */}

              <div className="lg:col-span-6">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="text-xs font-bold uppercase text-violet-300">
                    🧬 Developer DNA
                  </h3>

                  <span className="text-[9px] font-mono text-white/30">
                    Auto-calculated from your stack
                  </span>

                </div>

                {/* DNA */}

                <div className="h-9 rounded-lg overflow-hidden flex bg-black/40">

                  {dnaSegments.length >
                  0 ? (

                    dnaSegments.map(
                      (segment) => (

                        <div
                          key={
                            segment.tech
                          }
                          className="flex items-center justify-center text-[10px] font-bold text-black"
                          style={{
                            width: `${segment.percent}%`,
                            backgroundColor:
                              segment.color,
                          }}
                        >
                          {segment.percent}%
                        </div>

                      )
                    )

                  ) : (

                    <div className="w-full flex items-center justify-center text-[9px] font-mono text-white/20">
                      ADD TECHNOLOGIES TO GENERATE DNA
                    </div>

                  )}

                </div>

                <div className="flex flex-wrap gap-5 mt-3">

                  {dnaSegments
                    .slice(0, 4)
                    .map(
                      (segment) => (

                        <div
                          key={
                            segment.tech
                          }
                          className="flex items-center gap-2 text-[10px] text-white/60"
                        >

                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                segment.color,
                            }}
                          />

                          {segment.tech}

                        </div>

                      )
                    )}

                </div>

                {/* Stats */}

                <div className="grid grid-cols-3 gap-3 mt-6">

                  <StatCard
                    icon="folder"
                    value={
                      savedProjects.length
                    }
                    label="Projects Built"
                  />

                  <StatCard
                    icon="bookmark"
                    value={
                      savedProjects.length
                    }
                    label="Ideas Saved"
                  />

                  <StatCard
                    icon="bolt"
                    value="—"
                    label="Pipeline History"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* TECHNICAL PROFILE */}
        {/* ================================================= */}

        <section className="grid lg:grid-cols-3 gap-5">

          {/* TECH STACK */}

          <div className="lg:col-span-2">

            <TechStackCard
              techStack={
                form.techStack
              }
              isEditMode={
                isEditMode
              }
              onToggle={
                handleTechToggle
              }
              onCustomTech={
                handleCustomTech
              }
            />

          </div>

          {/* RIGHT CONFIGURATION */}

          <div className="space-y-5">

            <ExperienceCard
              value={
                form.experienceLevel
              }
              onChange={(value) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    experienceLevel:
                      value,
                  })
                )
              }
              disabled={
                !isEditMode
              }
            />

            <PrimaryGoalCard
              value={
                form.primaryGoal
              }
              onChange={(value) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    primaryGoal:
                      value,
                  })
                )
              }
              disabled={
                !isEditMode
              }
            />

            <AvailabilityCard
              value={
                form.commitment
              }
              onChange={(value) =>
                setForm(
                  (previous) => ({
                    ...previous,
                    commitment:
                      value,
                  })
                )
              }
              disabled={
                !isEditMode
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* ACCOUNT + BUILD HISTORY */}
        {/* ================================================= */}

        <section className="grid lg:grid-cols-2 gap-5">

          {/* ACCOUNT */}

          <AccountDetails
            form={form}
            isEditMode={
              isEditMode
            }
            handleChange={
              handleChange
            }
            handleLogout={
              handleLogout
            }
          />

          {/* BUILD HISTORY */}

          <BuildHistory
            savedProjects={
              savedProjects
            }
            loadingProjects={
              loadingProjects
            }
            navigate={
              navigate
            }
            setActiveTab={
              setActiveTab
            }
          />

        </section>

        {/* ================================================= */}
        {/* INSIGHTS + DANGER */}
        {/* ================================================= */}

        <section className="grid lg:grid-cols-2 gap-5">

          <ProfileInsights
            techStackCount={
              form.techStack.length
            }
            savedProjectsCount={
              savedProjects.length
            }
          />

          <DangerZone
            deleteConfirmation={
              deleteConfirmation
            }
            setDeleteConfirmation={
              setDeleteConfirmation
            }
            handleDeleteAccount={
              handleDeleteAccount
            }
            isSaving={
              isSaving
            }
          />

        </section>

      </main>

      {/* ================================================== */}
      {/* STICKY SAVE BAR */}
      {/* ================================================== */}

      {isEditMode && (

        <div className="fixed bottom-0 left-0 right-0 z-50 px-5 py-3 bg-[#06060a]/90 backdrop-blur-xl border-t border-violet-500/20">

          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  hasUnsavedChanges
                    ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                    : 'bg-white/20'
                }`}
              />

              <span
                className={`text-xs font-mono ${
                  hasUnsavedChanges
                    ? 'text-amber-400'
                    : 'text-white/30'
                }`}
              >
                {hasUnsavedChanges
                  ? 'Unsaved changes'
                  : 'No changes'}
              </span>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={
                  handleDiscard
                }
                disabled={
                  !hasUnsavedChanges
                }
                className="px-7 py-2.5 rounded-lg border border-white/20 text-xs font-mono uppercase text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Discard Changes
              </button>

              <button
                onClick={
                  handleSave
                }
                disabled={
                  isSaving ||
                  !hasUnsavedChanges
                }
                className="px-8 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold uppercase transition shadow-[0_0_20px_rgba(108,99,255,0.25)]"
              >

                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  save
                </span>

                {isSaving
                  ? 'Saving...'
                  : 'Save Profile'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default UserProfilePage;
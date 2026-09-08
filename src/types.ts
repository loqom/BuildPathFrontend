export type PageTab = 
  | 'home' 
  | 'about'
  | 'onboarding' 
  | 'pipeline' 
  | 'match-results' 
  | 'explore' 
  | 'roadmap' 
  | 'submit-problem' 
  | 'build-in-public' 
  | 'teams' 
  | 'saved-projects' 
  | 'profile';

export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Staff/Lead';
export type CommitmentLevel = 'Casual (< 5 hrs/wk)' | 'Moderate (5-15 hrs/wk)' | 'Dedicated (15+ hrs/wk)';
export type PrimaryGoal = 'Portfolio Building' | 'Startup MVP' | 'Skill Mastery' | 'Open Source Contribution';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'placement' | 'freelance' | 'startup' | 'learning';

export interface UserProfile {
  techStack: string[];
  experienceLevel: ExperienceLevel;
  commitment: CommitmentLevel;
  primaryGoal: PrimaryGoal;
  discoveryMode: 'AI Match' | 'Browse';
  githubHandle?: string;
  isLoggedIn?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  _id?: string;
  linkedin?: string;
  avatar?: string;
  bio?: string;
}

export interface BackendUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  techStack: string[];
  skillLevel: SkillLevel;
  goal: Goal;
}

export interface AgentLog {
  agentName: string;
  status: 'running' | 'completed' | 'failed';
  message: string;
  output?: string;
  finishedAt: string | Date;
}

export interface PipelineSession {
  _id: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: {
    techStack: string[];
    skillLevel: SkillLevel;
    timeAvailable: string;
    goal: Goal;
  };
  agentLogs: AgentLog[];
  results: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  sessionId: string;
  userId: string;
  title: string;
  oneLiner: string;
  problemStatement: string;
  proposedSolution: string;
  techStack: string[];
  matchScore: number;
  complexity: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  features: {
    mvp: string[];
    stretch: string[];
  };
  roadmap: {
    week: number;
    title: string;
    tasks: string[];
  }[];
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemItem {
  id: string;
  title: string;
  sector: 'Fintech' | 'Healthtech' | 'AI/ML' | 'E-Commerce' | 'Web3' | 'DevTools' | 'Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  techStack: string[];
  likes: number;
  buildersCount: number;
  verified: boolean;
  createdAt: string;
  sourceUrl?: string;
  summary: string;
  impactScore?: number;
  mvpRequirements: string[];
  stretchGoals: string[];
  roadmapWeeks: {
    week: number;
    title: string;
    description: string;
    tasks: string[];
  }[];
}

export interface PipelineStage {
  id: number;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
}

export interface PublicFeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timeAgo: string;
  badgeText?: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  repoUrl?: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface TeamApplication {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
    githubHandle?: string;
    techStack?: string[];
  };
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  appliedAt: string | Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  techStack: string[];
  availability: string;
  lookingFor: string[];
  matchCompatibility?: number;
  _id?: string;
  user?: string;
  githubHandle?: string;
  status?: 'pending' | 'active' | 'rejected';
  applications?: TeamApplication[];
  myStatus?: 'pending' | 'accepted' | 'rejected' | 'none';
  myMessage?: string;
}

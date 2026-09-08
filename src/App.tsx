import React, { useState, useEffect } from 'react';
import { UserProfile, PageTab, Project, ProblemItem, PublicFeedPost, TeamMember } from './types';
import { Navbar } from './components/Navbar';
import { HeroLandingView } from './components/HeroLandingView';
import { OnboardingProfileView } from './components/OnboardingProfileView';
import { PipelineExecutionView } from './components/PipelineExecutionView';
import { MatchResultsView } from './components/MatchResultsView';
import { ExploreProblemsView } from './components/ExploreProblemsView';
import { RoadmapView } from './components/RoadmapView';
import { SubmitProblemView } from './components/SubmitProblemView';
import { BuildInPublicFeedView } from './components/BuildInPublicFeedView';
import { TeamsView } from './components/TeamsView';
import { SavedProjectsView } from './components/SavedProjectsView';
import { UserProfilePage } from './components/UserProfilePage';
import { AuthPageView } from './components/AuthPageView';
import { AboutPageView } from './components/AboutPageView';
import { BuildPathLogo } from './components/BuildPathLogo';
import { Footer } from './components/Footer';
import { problemService } from './services/problem.service';
import { teamsService } from './services/teams.service';
import { projectService } from './services/project.service';
import { feedService } from './services/feed.service';
import { authService } from './services/auth.service';
import { getAvatar } from './utils/avatar';

const DEFAULT_PROFILE: UserProfile = {
  techStack: [],
  experienceLevel: 'Mid',
  commitment: 'Moderate (5-15 hrs/wk)',
  primaryGoal: 'Portfolio Building',
  discoveryMode: 'AI Match',
  isLoggedIn: false,
};

const SKILL_TO_EXPERIENCE: Record<string, UserProfile['experienceLevel']> = {
  beginner: 'Junior',
  intermediate: 'Mid',
  advanced: 'Senior',
};

const GOAL_TO_PRIMARY: Record<string, UserProfile['primaryGoal']> = {
  placement: 'Portfolio Building',
  freelance: 'Open Source Contribution',
  startup: 'Startup MVP',
  learning: 'Skill Mastery',
};

const toProblemItem = (p: any): ProblemItem => ({
  id: p._id || p.id,
  title: p.title,
  sector: p.sector,
  difficulty: p.difficulty,
  description: p.description,
  summary: p.summary || p.description,
  techStack: p.techStack || [],
  likes: p.likes ?? 0,
  buildersCount: p.buildersCount ?? 0,
  verified: p.verified ?? false,
  createdAt: p.createdAt,
  sourceUrl: p.sourceUrl,
  impactScore: p.impactScore ?? 0,
  mvpRequirements: p.mvpRequirements || [],
  stretchGoals: p.stretchGoals || [],
  roadmapWeeks: p.roadmapWeeks || [],
});

const toProjectFromProblemItem = (problem: ProblemItem): Project => ({
  _id: problem.id,
  sessionId: 'explore',
  userId: 'user',
  title: problem.title,
  oneLiner: problem.summary,
  problemStatement: problem.description,
  proposedSolution: problem.summary,
  techStack: problem.techStack,
  matchScore: problem.impactScore ?? 0,
  complexity: problem.difficulty === 'Beginner' ? 'easy' : problem.difficulty === 'Intermediate' ? 'medium' : 'hard',
  estimatedTime: '4 weeks',
  features: {
    mvp: problem.mvpRequirements,
    stretch: problem.stretchGoals,
  },
  roadmap: problem.roadmapWeeks.map((w) => ({
    week: w.week,
    title: w.title,
    tasks: w.tasks,
  })),
  isSaved: false,
  createdAt: problem.createdAt,
  updatedAt: problem.createdAt,
});

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'just now';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

const toFeedPost = (p: any): PublicFeedPost => {
  const cleanHandle = p.authorHandle ? p.authorHandle.replace(/^@/, '') : '';

  return {
    id: p._id || p.id,
    authorName: p.authorName || 'Developer',
    authorHandle: p.authorHandle ? (p.authorHandle.startsWith('@') ? p.authorHandle : `@${p.authorHandle}`) : '@builder',
    authorAvatar: getAvatar(p.authorAvatar, cleanHandle),
    timeAgo: formatTimeAgo(p.createdAt),
    badgeText: p.badgeText,
    content: p.content,
    codeSnippet: p.codeSnippet,
    repoUrl: p.repoUrl,
    likes: p.likesCount ?? p.likes ?? 0,
    commentsCount: p.commentsCount ?? 0,
    isLiked: p.isLiked ?? false,
  };
};

const toTeamMember = (t: any): TeamMember => ({
  id: t._id || t.id,
  name: t.name,
  role: t.role,
  avatar: t.avatar,
  bio: t.bio || '',
  techStack: t.techStack || [],
  availability: t.availability || 'Flexible',
  lookingFor: t.lookingFor || [],
  matchCompatibility: t.matchCompatibility ?? 0,
});

const toUserProfile = (u: any): UserProfile => ({
  _id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  githubHandle: u.githubHandle,
  linkedin: u.linkedin,
  avatar: u.avatar,
  techStack: u.techStack || [],
  experienceLevel: SKILL_TO_EXPERIENCE[u.skillLevel] || 'Mid',
  primaryGoal: GOAL_TO_PRIMARY[u.goal] || 'Portfolio Building',
  commitment: 'Moderate (5-15 hrs/wk)',
  discoveryMode: 'AI Match',
  isLoggedIn: true,
});

export default function App() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Project[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [problemsTotal, setProblemsTotal] = useState(0);
  const [problemPage, setProblemPage] = useState(1);
  const [problemTotalPages, setProblemTotalPages] = useState(1);
  const [feedPosts, setFeedPosts] = useState<PublicFeedPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('buildpath_user_profile');
      if (!stored) return DEFAULT_PROFILE;
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PROFILE, ...parsed, techStack: parsed.techStack || [] };
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('buildpath_user_profile', JSON.stringify(userProfile));
    } catch {
      // ignore quota / serialization errors
    }
  }, [userProfile]);

  // Initial Auth Check: determine if session is valid before rendering views
  useEffect(() => {
    let cancelled = false;

    authService
      .getMe()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          const profile = toUserProfile(res.data);
          setUserProfile(profile);
          setAuthStatus('authenticated');
        } else {
          setUserProfile({ ...DEFAULT_PROFILE, isLoggedIn: false });
          try {
            localStorage.removeItem('buildpath_user_profile');
          } catch {}
          setAuthStatus('unauthenticated');
        }
      })
      .catch(() => {
        if (cancelled) return;
        // session invalid / expired or unauthenticated
        setUserProfile({ ...DEFAULT_PROFILE, isLoggedIn: false });
        try {
          localStorage.removeItem('buildpath_user_profile');
        } catch {}
        setAuthStatus('unauthenticated');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch application data only when authenticated
  useEffect(() => {
    if (authStatus !== 'authenticated') return;

    let cancelled = false;
    (async () => {
      try {
        const [probRes, feedRes, teamRes] = await Promise.allSettled([
          projectService.getProblems({ limit: 30, page: problemPage }),
          feedService.getFeedPosts({ limit: 30 }),
          teamsService.getTeamMembers({ limit: 30 }),
        ]);

        if (cancelled) return;

        if (probRes.status === 'fulfilled' && probRes.value?.success && Array.isArray(probRes.value.data)) {
          const newProblems = probRes.value.data.map(toProblemItem);
          const isFirstPage = problemPage === 1;
          if (isFirstPage) {
            setProblems(newProblems);
          } else {
            setProblems((prev) => [...prev, ...newProblems]);
          }
          const totalForPage = probRes.value.pagination?.total ?? newProblems.length;
          setProblemsTotal(totalForPage);
          setProblemTotalPages(Math.ceil(totalForPage / 30));
        }

        if (feedRes.status === 'fulfilled' && feedRes.value?.success && Array.isArray(feedRes.value.data)) {
          setFeedPosts(feedRes.value.data.map(toFeedPost));
        }

        if (teamRes.status === 'fulfilled' && teamRes.value?.success && Array.isArray(teamRes.value.data)) {
          setTeamMembers(teamRes.value.data.map(toTeamMember));
        }
      } catch (e) {
        console.error('Failed to fetch initial data:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authStatus, problemPage]);

  const loadMoreProblems = async () => {
    setProblemPage((prev) => {
      const newPage = prev + 1;
      if (newPage > problemTotalPages) return prev;
      return newPage;
    });
  };

  // Fetch saved projects only when authenticated
  useEffect(() => {
    if (authStatus !== 'authenticated' || !userProfile.isLoggedIn) {
      setSavedProjects([]);
      setSavedProjectIds([]);
      return;
    }

    let cancelled = false;
    projectService
      .getAllProjects()
      .then((res) => {
        if (cancelled) return;
        if (res.success && Array.isArray(res.data)) {
          const projs = res.data as Project[];
          setSavedProjects(projs);
          setSavedProjectIds(projs.map((p) => p._id.toString()));
        }
      })
      .catch(() => {
        // requires auth; ignore
      });

    return () => {
      cancelled = true;
    };
  }, [authStatus, userProfile.isLoggedIn]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors
    } finally {
      setUserProfile({ ...DEFAULT_PROFILE, isLoggedIn: false });
      try {
        localStorage.removeItem('buildpath_user_profile');
      } catch {}
      setSavedProjects([]);
      setSavedProjectIds([]);
      setMatches([]);
      setSelectedProject(null);
      setActiveTab('home');
      setAuthStatus('unauthenticated');
    }
  };

  const handleSelectProblem = (problem: ProblemItem) => {
    setSelectedProject(toProjectFromProblemItem(problem));
    setActiveTab('roadmap');
  };

  const handleSelectProjectMatch = (match: Project) => {
    setSelectedProject(match);
    setActiveTab('roadmap');
  };

  const handleToggleSaveProject = (projectId: string) => {
    const isSaved = savedProjectIds.includes(projectId);

    if (isSaved) {
      setSavedProjectIds((prev) => prev.filter((id) => id !== projectId));
      setSavedProjects((prev) => prev.filter((p) => p._id !== projectId));
    } else {
      setSavedProjectIds((prev) => [...prev, projectId]);
      const match = matches.find((m) => m._id === projectId);
      const problem = problems.find((p) => p.id === projectId);
      const proj = match || (problem ? toProjectFromProblemItem(problem) : undefined);
      if (proj) {
        setSavedProjects((prev) =>
          prev.some((p) => p._id === proj._id) ? prev : [...prev, proj]
        );
      }
    }

    projectService.saveProject(projectId).catch(() => {
      // non-blocking; local state stays in sync
    });
  };

  const handleRemoveSavedProject = (projectId: string) => {
    setSavedProjectIds((prev) => prev.filter((id) => id !== projectId));
    setSavedProjects((prev) => prev.filter((p) => p._id !== projectId));
    projectService.saveProject(projectId).catch(() => {
      // non-blocking
    });
  };

  const handleSaveToMyProjects = (project: Project) => {
    setSavedProjectIds((prev) =>
      prev.includes(project._id) ? prev : [...prev, project._id]
    );
    setSavedProjects((prev) =>
      prev.some((p) => p._id === project._id) ? prev : [...prev, project]
    );
    projectService.saveProject(project._id).catch(() => {
      // non-blocking
    });
  };

  const handleLikeProblem = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, likes: p.likes + 1 } : p))
    );
    problemService.upvoteProblem(problemId).catch(() => {
      setProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      );
    });
  };

  const handleAddProblem = (newProblem: ProblemItem) => {
    setProblems((prev) => [newProblem, ...prev]);
    setActiveTab('explore');
    problemService.submitProblem(newProblem).then((res) => {
      if (res.success && res.data?._id) {
        setProblems((prev) =>
          prev.map((p) => (p.id === newProblem.id ? { ...p, id: res.data._id } : p))
        );
      }
    }).catch(() => {});
  };

  const handleAddTeammateRequest = (member: TeamMember) => {
    teamsService.postTeamRequest(member).catch(() => {
      // non-blocking
    });
  };

  const handleAddFeedPost = (post: PublicFeedPost) => {
    setFeedPosts((prev) => [post, ...prev]);
  };

  const onStartPipeline = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setActiveTab('pipeline');
    window.scrollTo(0, 0);
  };

  const onPipelineComplete = (projects: any[]) => {
    if (Array.isArray(projects) && projects.length > 0) {
      setMatches(projects as Project[]);
    }
  };

  const onViewResults = () => {
    setCurrentSessionId(null);
    setActiveTab('match-results');
    window.scrollTo(0, 0);
  };

  const onRetry = () => {
    setCurrentSessionId(null);
    setActiveTab('onboarding');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setUserProfile(user);
    setAuthStatus('authenticated');
    setActiveTab('home');
  };

  // 1. INITIAL AUTH LOADING STATE: Minimal premium BuildPath splash to prevent any flash
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(220, 0, 40, 0.25) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center space-y-5">
          <div className="relative">
            <BuildPathLogo size="xl" withGlow={true} className="!w-16 !h-16 shadow-2xl shadow-red-900/60" />
            <div className="absolute -inset-2 border border-[#dc0028]/40 rounded-3xl animate-ping opacity-40 pointer-events-none" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-black tracking-widest uppercase font-mono">
              BUILDPATH <span className="text-[#dc0028]">/ ENGINE</span>
            </div>
            <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Verifying developer session...
            </p>
          </div>

          <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#dc0028] rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // 2. UNAUTHENTICATED: Full-page authentication experience
  if (authStatus === 'unauthenticated') {
    return (
      <AuthPageView
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // 3. AUTHENTICATED: Full application views and navigation
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        problemsCount={problemsTotal || problems.length}
        matchesCount={matches.length}
        hasMatches={matches.length > 0}
      />

      <main>
        {activeTab === 'home' && (
          <HeroLandingView
            setActiveTab={setActiveTab}
            featuredProblems={problems.slice(0, 6)}
            onSelectProblem={handleSelectProblem}
          />
        )}

        {activeTab === 'about' && (
          <AboutPageView setActiveTab={setActiveTab} />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingProfileView
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onStartPipeline={onStartPipeline}
          />
        )}

        {activeTab === 'pipeline' && (
          currentSessionId ? (
            <PipelineExecutionView
              userProfile={userProfile}
              sessionId={currentSessionId}
              onPipelineComplete={onPipelineComplete}
              onRetry={onRetry}
              onViewResults={onViewResults}
            />
          ) : (
            <OnboardingProfileView
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onStartPipeline={onStartPipeline}
            />
          )
        )}

        {activeTab === 'match-results' && (
          <MatchResultsView
            matches={matches}
            userProfile={userProfile}
            setActiveTab={setActiveTab}
            onSelectProjectMatch={handleSelectProjectMatch}
            savedProjectIds={savedProjectIds}
            onToggleSaveProject={handleToggleSaveProject}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreProblemsView
            problems={problems}
            onSelectProblem={handleSelectProblem}
            setActiveTab={setActiveTab}
            onLikeProblem={handleLikeProblem}
            savedProjectIds={savedProjectIds}
            onToggleSaveProject={handleToggleSaveProject}
            onLoadMoreProblems={loadMoreProblems}
            hasMoreProblems={problemPage < problemTotalPages}
            totalProblemsCount={problemsTotal}
          />
        )}

        {activeTab === 'roadmap' && selectedProject && (
          <RoadmapView
            problem={selectedProject}
            setActiveTab={setActiveTab}
            onSaveToMyProjects={handleSaveToMyProjects}
            isSavedInMyProjects={savedProjectIds.includes(selectedProject._id)}
          />
        )}

        {activeTab === 'submit-problem' && (
          <SubmitProblemView
            onAddProblem={handleAddProblem}
            setActiveTab={setActiveTab}
            onSelectProblem={handleSelectProblem}
          />
        )}

        {activeTab === 'build-in-public' && (
          <BuildInPublicFeedView
            feedPosts={feedPosts}
            userProfile={userProfile}
            onAddFeedPost={handleAddFeedPost}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            teamMembers={teamMembers}
            userProfile={userProfile}
            onAddTeammateRequest={handleAddTeammateRequest}
          />
        )}

        {activeTab === 'saved-projects' && (
          <SavedProjectsView
            savedProblems={savedProjects}
            setActiveTab={setActiveTab}
            onSelectProblem={handleSelectProjectMatch}
            onRemoveSavedProject={handleRemoveSavedProject}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfilePage setActiveTab={setActiveTab} onLogout={handleLogout} />
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

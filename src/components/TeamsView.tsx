import React, { useState, useEffect, useCallback } from 'react';
import { TeamMember, UserProfile } from '../types';
import { teamsService } from '../services/teams.service';
import { getAvatar, handleAvatarError } from '../utils/avatar';

interface TeamsViewProps {
  teamMembers: TeamMember[];
  userProfile: UserProfile;
  onAddTeammateRequest: (member: TeamMember) => void;
}

type TeamTab = 'browse' | 'myposts' | 'myapps';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-900/80 text-yellow-300 border border-yellow-800/40',
  accepted: 'bg-emerald-900/80 text-emerald-300 border border-emerald-800/40',
  active: 'bg-emerald-900/80 text-emerald-300 border border-emerald-800/40',
  rejected: 'bg-red-900/80 text-red-300 border border-red-800/40',
};

const toStatusLabel = (s?: string) => {
  if (s === 'accepted' || s === 'active') return 'Accepted';
  if (s === 'rejected') return 'Rejected';
  if (s === 'none') return 'Applied';
  return 'Pending';
};

const applicantName = (app: any) =>
  app?.user ? `${app.user.firstName || ''} ${app.user.lastName || ''}`.trim() || 'Developer' : 'Developer';

export const TeamsView: React.FC<TeamsViewProps> = ({
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TeamTab>('browse');
  const [searchTerm, setSearchTerm] = useState('');

  const [browseTeams, setBrowseTeams] = useState<TeamMember[]>([]);
  const [myPosts, setMyPosts] = useState<TeamMember[]>([]);
  const [myApps, setMyApps] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roleTitle, setRoleTitle] = useState('Full-Stack Engineer');
  const [bioText, setBioText] = useState('');
  const [lookingForList, setLookingForList] = useState<string[]>(['Frontend Dev', 'UI Designer']);
  const [lookingForTag, setLookingForTag] = useState('');

  // Apply modal state
  const [applyTarget, setApplyTarget] = useState<TeamMember | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [appliedMsg, setAppliedMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // applicants for a my-post (expanded card)
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const fetchBrowse = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teamsService.getTeamMembers({ limit: 50 });
      if (res.success && Array.isArray(res.data)) {
        setBrowseTeams(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch available teams:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyPosts = useCallback(async () => {
    try {
      const res = await teamsService.getMyTeamPosts();
      if (res.success && Array.isArray(res.data)) {
        setMyPosts(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch my team posts:', e);
    }
  }, []);

  const fetchMyApps = useCallback(async () => {
    try {
      const res = await teamsService.getMyApplications();
      if (res.success && Array.isArray(res.data)) {
        setMyApps(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch my applications:', e);
    }
  }, []);

  useEffect(() => {
    fetchBrowse();
  }, [fetchBrowse]);

  useEffect(() => {
    if (activeTab === 'myposts') fetchMyPosts();
    if (activeTab === 'myapps') fetchMyApps();
  }, [activeTab, fetchMyPosts, fetchMyApps]);

  const refreshAll = async () => {
    await Promise.allSettled([fetchBrowse(), fetchMyPosts(), fetchMyApps()]);
  };

  const handlePostMyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile.isLoggedIn) return;
    setIsSubmitting(true);
    try {
      const payload = {
        role: roleTitle,
        bio: bioText || 'Building scalable engineering tools with BuildPath.',
        techStack: userProfile.techStack.length ? userProfile.techStack : ['TypeScript', 'React'],
        availability: userProfile.commitment || '10-15 hrs/week',
        lookingFor: lookingForList,
      };
      await teamsService.postTeamRequest(payload);
      setShowCreateModal(false);
      setBioText('');
      setRoleTitle('Full-Stack Engineer');
      await refreshAll();
      setActiveTab('myposts');
    } catch (err) {
      console.error('Failed to post team request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyTarget) return;
    setIsSubmitting(true);
    try {
      const res = await teamsService.applyToTeam(applyTarget._id || applyTarget.id, applyMessage);
      if (res.success) {
        setAppliedMsg(res.message || 'Application submitted successfully');
        setApplyMessage('');
        // Refresh browse (team disappears) and my apps
        await refreshAll();
        setTimeout(() => {
          setAppliedMsg('');
          setApplyTarget(null);
        }, 1600);
      }
    } catch (err: any) {
      setAppliedMsg(err?.response?.data?.message || 'Failed to apply');
      setTimeout(() => setAppliedMsg(''), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplicationDecision = async (teamId: string, appId: string, type: 'accept' | 'reject') => {
    try {
      if (type === 'accept') {
        await teamsService.acceptApplication(teamId, appId);
      } else {
        await teamsService.rejectApplication(teamId, appId);
      }
      await fetchMyPosts();
    } catch (e) {
      console.error(`Failed to ${type} application:`, e);
    }
  };

  const getMyStatusFor = (team: TeamMember): string => {
    if (!userProfile.isLoggedIn) return '';
    const apps = team.applications || [];
    const mine = apps.find((a) => a.user && a.user._id === userProfile._id);
    return mine?.status || '';
  };

  const filteredBrowse = browseTeams.filter((m) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = (m.name || '').toLowerCase().includes(q);
      const matchBio = (m.bio || '').toLowerCase().includes(q);
      const matchTech = (m.techStack || []).some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchTech) return false;
    }
    return true;
  });

  const tabButton = (tab: TeamTab, label: string, badge?: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition ${
        activeTab === tab
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
          : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{badge}</span>
      )}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-2">
            <span className="material-symbols-outlined text-base">groups</span>
            TEAM FORMATION DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Find Co-Builders & Teammates
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Connect with developers who share your stack, commitment level, and project goals.
          </p>
        </div>

        {userProfile.isLoggedIn && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Post Teammate Request
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabButton('browse', 'Browse Teams')}
        {tabButton('myposts', 'My Posted Teams', myPosts.length)}
        {tabButton('myapps', 'My Applications', myApps.length)}
      </div>

      {!userProfile.isLoggedIn && activeTab !== 'browse' && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-200 mb-6">
          Please log in to manage your teams and applications.
        </div>
      )}

      {/* ============ BROWSER TAB ============ */}
      {activeTab === 'browse' && (
        <>
          <div className="glass-panel rounded-2xl p-4 mb-8 border border-slate-800">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search developers by name, role, or tech stack (e.g., Rust, React, AI)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-10 text-sm text-slate-400">Loading teams...</div>
          )}

          {!loading && filteredBrowse.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-400">
              No teams available to join right now.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrowse.map((member) => {
              const appliedByMe = getMyStatusFor(member);
              return (
                <div
                  key={member._id || member.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800 relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatar(member.avatar, member.githubHandle)}
                          onError={handleAvatarError}
                          alt={member.name}
                          className="h-12 w-12 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">{member.name}</h3>
                          <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
                        </div>
                      </div>

                      {member.matchCompatibility ? (
                        <span className="rounded-full bg-emerald-950/80 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 border border-emerald-800/40">
                          {member.matchCompatibility}% OVERLAP
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-mono">
                      <span className="material-symbols-outlined text-base text-cyan-400">schedule</span>
                      <span>Availability: {member.availability}</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                        Looking For:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(member.lookingFor || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40"
                          >
                            + {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-4 mb-5">
                      {(member.techStack || []).map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {appliedByMe ? (
                      <div
                        className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold ${STATUS_STYLES[appliedByMe] || STATUS_STYLES.pending}`}
                      >
                        <span className="material-symbols-outlined text-base">check</span>
                        {toStatusLabel(appliedByMe)}
                      </div>
                    ) : userProfile.isLoggedIn ? (
                      <button
                        onClick={() => setApplyTarget(member)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-500/30 px-4 py-2.5 text-xs font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition"
                      >
                        <span className="material-symbols-outlined text-base">person_add</span>
                        Apply to Join Team
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ============ MY POSTS TAB ============ */}
      {activeTab === 'myposts' && (
        <>
          {myPosts.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              You haven't posted any teammate requests yet.
              <div className="mt-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white"
                >
                  Post the first one
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {myPosts.map((post) => {
                const apps = post.applications || [];
                const pending = apps.filter((a) => a.status === 'pending');
                const accCount = apps.filter((a) => a.status === 'accepted').length;
                const expanded = expandedPost === post._id;
                return (
                  <div key={post._id} className="glass-panel rounded-2xl p-6 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatar(post.avatar, post.githubHandle)}
                          onError={handleAvatarError}
                          alt={post.name}
                          className="h-11 w-11 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">{post.name}</h3>
                          <p className="text-xs text-cyan-400">{post.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
                          {apps.length} {apps.length === 1 ? 'applicant' : 'applicants'}
                        </span>
                        <span className="rounded bg-emerald-950/80 px-2.5 py-1 text-[11px] font-mono text-emerald-300 border border-emerald-800/40">
                          {accCount} accepted
                        </span>
                        <button
                          onClick={() => setExpandedPost(expanded ? null : post._id!)}
                          className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700 transition"
                        >
                          {expanded ? 'Hide Applicants' : `View Applicants (${pending.length} pending)`}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-2">Bio: {post.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(post.techStack || []).map((tech) => (
                        <span key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {expanded && (
                      <div className="border-t border-slate-800 pt-4 mt-2 space-y-3">
                        {apps.length === 0 && (
                          <p className="text-xs text-slate-500">No applications yet. Share your listing to attract teammates.</p>
                        )}
                        {apps.map((app) => (
                          <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-900/60 border border-slate-800 p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={getAvatar(app.user?.avatar, app.user?.githubHandle)}
                                onError={handleAvatarError}
                                alt={applicantName(app)}
                                className="h-9 w-9 rounded-full border border-slate-700 object-cover"
                              />
                              <div>
                                <p className="text-sm font-bold text-white">{applicantName(app)}</p>
                                <p className="text-[11px] text-slate-400">
                                  {(app.user?.techStack || []).join(', ') || 'Developer'}
                                </p>
                                {app.message && (
                                  <p className="text-[11px] text-slate-300 italic mt-0.5">&ldquo;{app.message}&rdquo;</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`rounded px-2.5 py-1 text-[10px] font-mono ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}>
                                {toStatusLabel(app.status)}
                              </span>
                              {app.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApplicationDecision(post._id!, app._id, 'accept')}
                                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleApplicationDecision(post._id!, app._id, 'reject')}
                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-red-500 transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ============ MY APPLICATIONS TAB ============ */}
      {activeTab === 'myapps' && (
        <>
          {myApps.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              You haven't applied to any teams yet. Browse available teams and apply!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApps.map((team) => (
                <div key={team._id} className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800 relative">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatar(team.avatar, team.githubHandle)}
                          onError={handleAvatarError}
                          alt={team.name}
                          className="h-12 w-12 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">{team.name}</h3>
                          <p className="text-xs text-cyan-400 font-medium">{team.role}</p>
                        </div>
                      </div>
                      <span className={`rounded px-2.5 py-1 text-[10px] font-mono uppercase ${STATUS_STYLES[team.myStatus || 'pending']}`}>
                        {toStatusLabel(team.myStatus)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">{team.bio}</p>

                    <div className="mb-3">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">Looking For:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(team.lookingFor || []).map((tag, idx) => (
                          <span key={idx} className="rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40">
                            + {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(team.myStatus === 'accepted' || team.myStatus === 'active') && (
                      <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 text-[11px] text-emerald-300 mb-3">
                        <span className="material-symbols-outlined text-sm align-middle mr-1">verified</span>
                        You are part of this team!
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-4">
                    {(team.techStack || []).map((tech) => (
                      <span key={tech} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ============ APPLY MODAL ============ */}
      {applyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => { setApplyTarget(null); setAppliedMsg(''); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={getAvatar(applyTarget.avatar, applyTarget.githubHandle)}
                onError={handleAvatarError}
                alt={applyTarget.name}
                className="h-10 w-10 rounded-full border border-slate-700 object-cover"
              />
              <div>
                <h3 className="text-base font-bold text-white">
                  Apply to Join {applyTarget.name}&apos;s Team
                </h3>
                <p className="text-xs text-cyan-400">{applyTarget.role}</p>
              </div>
            </div>

            {appliedMsg ? (
              <div className="py-8 text-center text-emerald-400 font-semibold space-y-2">
                <span className="material-symbols-outlined text-4xl block">check_circle</span>
                <p>{appliedMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Introduction & Why You Fit
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={`Hi ${applyTarget.name}, I'd love to join your team. Here's why I fit...`}
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setApplyTarget(null); setAppliedMsg(''); }}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============ POST TEAMMATE REQUEST MODAL ============ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-geist text-lg font-bold text-white mb-4">
              Post a Teammate Request
            </h3>

            <form onSubmit={handlePostMyRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Your Primary Role</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Brief Bio & Project Focus</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what project you are building and what skills you bring..."
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Looking For (add tags, press Enter)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {lookingForList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded bg-indigo-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-800/40"
                    >
                      + {tag}
                      <button
                        type="button"
                        onClick={() => setLookingForList((prev) => prev.filter((_, i) => i !== idx))}
                        className="hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={lookingForTag}
                  onChange={(e) => setLookingForTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && lookingForTag.trim()) {
                      e.preventDefault();
                      setLookingForList((prev) => [...prev, lookingForTag.trim()]);
                      setLookingForTag('');
                    }
                  }}
                  placeholder="e.g. Backend Engineer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
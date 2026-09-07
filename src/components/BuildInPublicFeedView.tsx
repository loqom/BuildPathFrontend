import React, { useState, useEffect } from 'react';
import { PublicFeedPost, UserProfile } from '../types';
import { feedService } from '../services/feed.service';
import { getAvatar, handleAvatarError } from '../utils/avatar';

interface BuildInPublicFeedViewProps {
  feedPosts: PublicFeedPost[];
  userProfile: UserProfile;
  onAddFeedPost: (post: PublicFeedPost) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const BuildInPublicFeedView: React.FC<BuildInPublicFeedViewProps> = ({
  feedPosts,
  userProfile,
  onAddFeedPost,
  isLoading = false,
  onRefresh,
}) => {
  const [postText, setPostText] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [badgeText, setBadgeText] = useState('MILESTONE 🚀');

  const [postsState, setPostsState] = useState<PublicFeedPost[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [topBuilders, setTopBuilders] = useState<any[]>([]);

  useEffect(() => {
    setPostsState(feedPosts);
  }, [feedPosts]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [trendRes, buildersRes] = await Promise.allSettled([
          feedService.getTrending(),
          feedService.getTopBuilders(),
        ]);
        if (!active) return;
        if (trendRes.status === 'fulfilled' && trendRes.value?.success && Array.isArray(trendRes.value.data)) {
          setTrendingProjects(trendRes.value.data);
        }
        if (buildersRes.status === 'fulfilled' && buildersRes.value?.success && Array.isArray(buildersRes.value.data)) {
          setTopBuilders(buildersRes.value.data);
        }
      } catch (err) {
        // non-blocking
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, { author: string; text: string; time: string }[]>>({});

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    try {
      const response = await feedService.createFeedPost({
        content: postText.trim(),
        codeSnippet: codeSnippet.trim() ? { language: codeLanguage, code: codeSnippet.trim() } : undefined,
        repoUrl: repoUrl.trim() || undefined,
        badgeText,
      });

      if (response.success && response.data) {
        const newPost = response.data;
        onAddFeedPost(newPost);
        setPostsState([newPost, ...postsState]);
        setPostText('');
        setCodeSnippet('');
        setShowCodeInput(false);
        setRepoUrl('');
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleToggleLike = async (postId: string) => {
    // Optimistic update
    setPostsState((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );

    try {
      const response = await feedService.toggleLike(postId);
      if (!response.success) {
        // Revert on failure
        setPostsState((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const isLiked = !p.isLiked;
              return {
                ...p,
                isLiked,
                likes: isLiked ? p.likes + 1 : p.likes - 1,
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setPostsState((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const isLiked = !p.isLiked;
            return {
              ...p,
              isLiked,
              likes: isLiked ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        })
      );
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      author: userProfile.githubHandle || 'Developer',
      text,
      time: 'Just now',
    };

    // Optimistic update
    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPostsState((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

    try {
      const response = await feedService.addComment(postId, text);
      if (!response.success) {
        // Revert on failure
        setCommentsMap((prev) => {
          const comments = prev[postId] || [];
          return { ...prev, [postId]: comments.slice(0, -1) };
        });
        setPostsState((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount - 1 } : p))
        );
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      // Revert on error
      setCommentsMap((prev) => {
        const comments = prev[postId] || [];
        return { ...prev, [postId]: comments.slice(0, -1) };
      });
      setPostsState((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount - 1 } : p))
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="inline-flex items-center gap-2 border border-[#0057ff] bg-[#0057ff]/10 px-3.5 py-1 text-xs font-mono font-bold text-[#0057ff] mb-3 uppercase tracking-widest">
        <span className="material-symbols-outlined text-base">dynamic_feed</span>
        BUILD IN PUBLIC COMMUNITY FEED
      </div>

      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2">
        Developer <span className="text-transparent stroke-white">Build Logs</span>
      </h1>
      <p className="text-xs sm:text-sm text-white/70 max-w-2xl mb-8">
        Share progress updates, code snippets, benchmarks, and milestone achievements with fellow engineers.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Feed Stream */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Composer Box */}
          <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex items-start gap-3">
                <img
                  src={getAvatar(userProfile.avatar, userProfile.githubHandle)}
                  onError={handleAvatarError}
                  alt="User Avatar"
                  className="h-10 w-10 border border-white/20 object-cover"
                />
                <div className="flex-1">
                  <textarea
                    rows={3}
                    placeholder="WHAT MILESTONE OR FEATURE ARE YOU BUILDING TODAY?"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full bg-black border border-white/20 p-3.5 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Optional Code Snippet Input */}
              {showCodeInput && (
                <div className="border border-white/10 bg-black p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="text-[#0057ff] font-bold">ATTACH CODE SNIPPET</span>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-black border border-white/20 px-2.5 py-1 text-xs font-mono text-white uppercase"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="rust">Rust</option>
                      <option value="go">Go</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="// PASTE CODE SNIPPET HERE..."
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-black border border-white/10 p-3 font-mono text-xs text-white placeholder-white/20 focus:outline-none uppercase"
                  />
                </div>
              )}

              {/* Composer Toolbar */}
              <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(!showCodeInput)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border transition ${
                      showCodeInput
                        ? 'bg-[#0057ff] border-[#0057ff] text-white'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">code</span>
                    Code Snippet
                  </button>

                  <select
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="bg-black border border-white/20 px-3 py-1.5 text-xs font-mono text-white uppercase"
                  >
                    <option value="MILESTONE 🚀">Milestone 🚀</option>
                    <option value="UPDATE 🛠️">Update 🛠️</option>
                    <option value="TEAMMATES 👥">Teammates 👥</option>
                    <option value="BENCHMARK ⚡">Benchmark ⚡</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!postText.trim()}
                  className={`flex items-center gap-2 px-6 py-2.5 text-xs font-mono font-black uppercase tracking-wider transition ${
                    postText.trim()
                      ? 'bg-[#0057ff] text-white hover:bg-[#0046d5] shadow-lg'
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  POST UPDATE
                </button>
              </div>
            </form>
          </div>

          {/* Posts Stream */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0057ff] border-t-transparent"></div>
            </div>
          ) : postsState.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <span className="material-symbols-outlined text-4xl mb-2 block">dynamic_feed</span>
              <p className="text-xs font-mono uppercase">No build logs yet</p>
              {onRefresh && (
                <button onClick={onRefresh} className="mt-2 text-[#0057ff] hover:underline text-xs font-mono uppercase">
                  Refresh
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {postsState.map((post) => (
              <div
                key={post.id}
                className="border border-white/10 bg-white/[0.02] p-6 space-y-4"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      onError={handleAvatarError}
                      alt={post.authorName}
                      className="h-10 w-10 border border-white/20 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-syne text-sm font-bold uppercase text-white">
                          {post.authorName}
                        </span>
                        <span className="text-xs font-mono text-white/40">{post.authorHandle}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 uppercase">{post.timeAgo}</span>
                    </div>
                  </div>

                  {post.badgeText && (
                    <span className="bg-[#0057ff] text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {post.badgeText}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-space whitespace-pre-line">
                  {post.content}
                </p>

                {/* Code Snippet Box */}
                {post.codeSnippet && (
                  <div className="border border-white/10 bg-black p-4 font-mono text-xs overflow-x-auto">
                    <div className="text-[10px] uppercase text-[#0057ff] font-bold mb-2 border-b border-white/10 pb-1">
                      {post.codeSnippet.language}
                    </div>
                    <pre className="text-white/90">
                      <code>{post.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Repo Link */}
                {post.repoUrl && (
                  <div className="inline-flex items-center gap-2 bg-black border border-white/10 px-3.5 py-2 text-xs font-mono text-[#0057ff] uppercase">
                    <span className="material-symbols-outlined text-base">code</span>
                    <a href={`https://${post.repoUrl}`} target="_blank" rel="noreferrer" className="hover:underline font-bold">
                      {post.repoUrl}
                    </a>
                  </div>
                )}

                {/* Interactions Row */}
                <div className="flex items-center gap-6 border-t border-white/10 pt-4 text-xs font-mono uppercase text-white/50">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition ${
                      post.isLiked ? 'text-[#0057ff] font-bold' : 'hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {post.isLiked ? 'thumb_up' : 'thumb_up_off_alt'}
                    </span>
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 hover:text-white transition"
                  >
                    <span className="material-symbols-outlined text-base">chat_bubble</span>
                    <span>{post.commentsCount} COMMENTS</span>
                  </button>
                </div>

                {/* Comments Section Drawer */}
                {activeCommentPostId === post.id && (
                  <div className="border-t border-white/10 pt-4 space-y-3 font-mono text-xs">
                    {/* Existing Comments */}
                    {commentsMap[post.id]?.map((comm, idx) => (
                      <div key={idx} className="bg-black p-3.5 border border-white/10">
                        <div className="flex items-center justify-between text-white/50 mb-1 uppercase">
                          <span className="font-bold text-[#0057ff]">{comm.author}</span>
                          <span className="text-[10px]">{comm.time}</span>
                        </div>
                        <p className="text-white/80 font-space">{comm.text}</p>
                      </div>
                    ))}

                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="WRITE A COMMENT..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        className="flex-1 bg-black border border-white/20 px-3.5 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-[#0057ff] focus:outline-none uppercase"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-[#0057ff] px-4 py-2 text-xs font-mono font-bold uppercase text-white hover:bg-[#0046d5] transition"
                      >
                        REPLY
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Right Widgets Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Trending Projects */}
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-syne text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0057ff] text-lg">trending_up</span>
              Trending Public Projects
            </h3>
            {trendingProjects.length === 0 ? (
              <div className="p-4 bg-black border border-white/10 text-center">
                <p className="text-[10px] font-mono text-white/40 uppercase">No trending projects yet</p>
              </div>
            ) : (
              <div className="space-y-3 font-space">
                {trendingProjects.slice(0, 5).map((proj, idx) => (
                  <div key={proj._id || idx} className="p-4 bg-black border border-white/10">
                    <h4 className="font-syne text-xs font-bold uppercase text-white">
                      {proj.content?.slice(0, 50) || proj.badgeText || 'Community Project'}
                    </h4>
                    <p className="text-[10px] font-mono text-white/50 mt-1 uppercase">
                      {proj.likesCount ?? proj.likes?.length ?? 0} LIKES • {proj.authorName || proj.authorHandle || 'BUILDER'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Builders Widget */}
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-syne text-base font-bold uppercase text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-lg">workspace_premium</span>
              Top Builders This Week
            </h3>
            {topBuilders.length === 0 ? (
              <div className="p-4 bg-black border border-white/10 text-center">
                <p className="text-[10px] font-mono text-white/40 uppercase">No builders active this week</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topBuilders.slice(0, 5).map((builder, idx) => {
                  const cleanHandle = (builder.githubHandle || '').replace(/^@/, '');
                  const fullName = `${builder.firstName || ''} ${builder.lastName || ''}`.trim() || cleanHandle || 'Developer';
                  return (
                    <div key={builder._id || idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={getAvatar(undefined, cleanHandle)}
                        onError={handleAvatarError}
                        alt={fullName}
                        className="h-9 w-9 border border-white/20 object-cover"
                      />
                      <div>
                        <div className="font-syne font-bold uppercase text-white">{fullName}</div>
                        <div className="text-[10px] font-mono text-white/50 uppercase">
                          {builder.techStack?.slice(0, 3).join(' / ') || (cleanHandle ? `@${cleanHandle}` : 'BUILDER')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

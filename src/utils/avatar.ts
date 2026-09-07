import type { SyntheticEvent } from 'react';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export const cleanHandle = (githubHandle?: string | null): string =>
  (githubHandle || '').replace(/^@/, '').trim();

export const getAvatar = (
  avatar?: string | null,
  githubHandle?: string | null
): string => {
  // A custom uploaded avatar is a base64 data URL — always respect it.
  if (avatar && avatar.trim().startsWith('data:')) return avatar;
  // GitHub handle is the reliable source of a person's real pfp.
  const handle = cleanHandle(githubHandle);
  if (handle) return `https://github.com/${handle}.png`;
  // Any other explicitly-set avatar value, otherwise the default image.
  if (avatar && avatar.trim()) return avatar;
  return DEFAULT_AVATAR;
};

export const handleAvatarError = (
  e: SyntheticEvent<HTMLImageElement>
) => {
  const img = e.currentTarget;
  if (img.src !== DEFAULT_AVATAR) {
    img.src = DEFAULT_AVATAR;
  }
};
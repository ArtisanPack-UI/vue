/**
 * Initials and the hashed color of an Avatar, computed the same way in every
 * stack (Livewire's `Avatar::initialsFor()` and `colorFor()`).
 */
import type { AvatarColor } from './types';

/** The colors a name hashes to, in order. */
export const AVATAR_HASH_COLORS: readonly AvatarColor[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'error',
  'info',
];

/** Up to two letters from a name: the first letters of its first and last words, uppercased. */
export function avatarInitials(name: string | undefined): string {
  const words = (name ?? '').trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0]!)[0] ?? '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1]!)[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/** The color a name hashes to: the sum of its code points over the hash colors. Neutral without a name. */
export function avatarColor(name: string | undefined): AvatarColor {
  const trimmed = (name ?? '').trim();
  if (trimmed === '') return 'neutral';
  let sum = 0;
  for (const character of trimmed) sum += character.codePointAt(0) ?? 0;
  return AVATAR_HASH_COLORS[sum % AVATAR_HASH_COLORS.length]!;
}

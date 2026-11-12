/** An Avatar's semantic color, the initials' tone. Emitted as `data-color`. */
export type AvatarColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** An Avatar's size, the control heights. Emitted as `data-size`. */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** An Avatar's shape. Emitted as `data-shape`. */
export type AvatarShape = 'circle' | 'square';

/** A presence state, shown as a dot and announced in words. */
export type AvatarStatus = 'online' | 'away' | 'offline';

/** The parts of an Avatar that accept extra classes. */
export type AvatarPart = 'root' | 'image' | 'initials' | 'status';

/**
 * Props for the Avatar component (design-system manifest `Avatar`, #61).
 * `class` and every other attribute go to the root.
 */
export interface AvatarProps {
  /** The full name: initials, accessible name and hashed color. */
  name?: string;
  /** The image URL (relative, http, https or `data:image`). It covers the initials. */
  src?: string;
  /** The accessible name, when it should differ from `name`. */
  alt?: string;
  /** Overrides the initials taken from `name`, such as `+4`. */
  initials?: string;
  /** Icon name shown instead of initials. Without a name or initials, `user` shows. */
  icon?: string;
  /** Size. @defaultValue `'md'` */
  size?: AvatarSize;
  /** Shape. @defaultValue `'circle'` */
  shape?: AvatarShape;
  /** The initials' tone. Defaults to a color hashed from `name`. */
  color?: AvatarColor;
  /** A presence dot, announced in words too. */
  status?: AvatarStatus;
  /** The status in words, added to the accessible name; translate it. Defaults to Online, Away or Offline. */
  statusLabel?: string;
  /** Extra classes per part, such as `{ image: '…' }`. */
  classes?: Partial<Record<AvatarPart, string>>;
}

/** One avatar in AvatarGroup's `avatars`. */
export type AvatarGroupItem = Pick<
  AvatarProps,
  'name' | 'src' | 'alt' | 'initials' | 'icon' | 'color' | 'status' | 'statusLabel'
>;

/** Props for the AvatarGroup component. `class` and every other attribute go to the root. */
export interface AvatarGroupProps {
  /** Avatars as data, rendered before the default slot. */
  avatars?: AvatarGroupItem[];
  /** How many of `avatars` show before a +N avatar. Unset shows them all. */
  max?: number;
  /** The data avatars' size. @defaultValue `'md'` */
  size?: AvatarSize;
  /** The group's accessible name, such as "Project members". */
  label?: string;
  /** The +N avatar's accessible name; `{count}` is the number hidden. @defaultValue `'{count} more'` */
  moreLabel?: string;
}

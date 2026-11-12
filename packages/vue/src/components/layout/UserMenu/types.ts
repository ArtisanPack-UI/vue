import type {
  DropdownMenuAlign,
  DropdownMenuEntry,
  DropdownMenuPart,
  DropdownMenuSurface,
} from '../DropdownMenu/types';
import type { AvatarStatus } from '../../display/Avatar/types';

/** A theme the theme control offers. */
export type UserMenuTheme = 'light' | 'dark' | 'system';

/** Who is signed in. */
export interface UserMenuUser {
  name: string;
  email?: string;
  /** An image URL for the avatar. */
  avatar?: string;
  /** The line under the name in the trigger, such as "Admin · Apexify". */
  role?: string;
  status?: AvatarStatus;
}

/** A workspace to switch to. */
export interface UserMenuWorkspace {
  id: string;
  name: string;
}

/** The parts of a UserMenu that accept extra classes, the menu's included. */
export type UserMenuPart =
  | DropdownMenuPart
  | 'avatar'
  | 'identity'
  | 'name'
  | 'role'
  | 'indicator'
  | 'header'
  | 'email'
  | 'theme'
  | 'themeOptions';

/**
 * Props for the UserMenu component (design-system manifest `UserMenu`, #58).
 *
 * The default slot takes DropdownMenuItem, DropdownMenuGroup and
 * DropdownMenuSeparator children after `items`; the `trigger` slot replaces
 * the trigger's content. `class` and every other attribute go to the panel.
 */
export interface UserMenuProps {
  /** Who is signed in. */
  user: UserMenuUser;
  /** Workspaces to switch between; two or more render a Workspace group. */
  workspaces?: UserMenuWorkspace[];
  /** The current workspace's id. */
  workspace?: string;
  /** Hides the theme control. @defaultValue `false` */
  hideTheme?: boolean;
  /** The checked theme. @defaultValue `'system'` */
  theme?: UserMenuTheme;
  /** Items between the theme control and Log out, as DropdownMenu items data. */
  items?: DropdownMenuEntry[];
  /** Shows only the avatar in the trigger; the name stays its accessible name. @defaultValue `false` */
  compact?: boolean;
  /** Whether it's open. Use `v-model:open`. @defaultValue `false` */
  open?: boolean;
  /** Which of the menu's edges lines up with the trigger's. @defaultValue `'start'` */
  align?: DropdownMenuAlign;
  /** The menu's surface. @defaultValue `'overlay'` */
  surface?: DropdownMenuSurface;
  /** Renders the menu at the end of the body (Teleport). @defaultValue `true` */
  portal?: boolean;
  /** The workspace group's label; translate it. @defaultValue `'Workspace'` */
  workspaceLabel?: string;
  /** The theme group's label; translate it. @defaultValue `'Theme'` */
  themeLabel?: string;
  /** The theme options' names; translate them. @defaultValue `{ light: 'Light', dark: 'Dark', system: 'System' }` */
  themeLabels?: Partial<Record<UserMenuTheme, string>>;
  /** The last item's label; translate it. @defaultValue `'Log out'` */
  logoutLabel?: string;
  /** Extra classes per part, the menu's included. */
  classes?: Partial<Record<UserMenuPart, string>>;
}

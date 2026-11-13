/** The parts of an AppShell that accept extra classes. */
export type AppShellPart =
  | 'root'
  | 'skipLink'
  | 'sidebar'
  | 'brand'
  | 'footer'
  | 'collapseTrigger'
  | 'main'
  | 'content';

/** Props for the AppShell component. The default slot is the content. */
export interface AppShellProps {
  /** Shrinks the sidebar to its icons. Emitted as `data-collapsed`. @defaultValue `false` */
  collapsed?: boolean;
  /** Adds the button that collapses and expands the sidebar. @defaultValue `false` */
  collapsible?: boolean;
  /** The expanded sidebar's width, any CSS length: sets `--apui-sidebar-width`. */
  sidebarWidth?: string;
  /** The space around and between the islands: sets `--apui-shell-gutter`. */
  gutter?: string;
  /** The brand at the top of the sidebar. The `brand` slot overrides it. */
  brand?: string;
  /** The sidebar's navigation. The `sidebar` slot overrides it (usually a Menu). */
  sidebar?: string;
  /** The top bar of the main column. The `header` slot overrides it (usually a Navbar island). */
  header?: string;
  /** The foot of the sidebar. The `footer` slot overrides it. */
  footer?: string;
  /** Names the sidebar's complementary landmark. @defaultValue `'Sidebar'` */
  label?: string;
  /** The skip link's text. @defaultValue `'Skip to main content'` */
  skipLabel?: string;
  /** Names the collapse button. @defaultValue `'Collapse sidebar'` */
  collapseLabel?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<AppShellPart, string>>;
}

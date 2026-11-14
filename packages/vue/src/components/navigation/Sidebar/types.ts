/**
 * Props for the deprecated Sidebar component.
 *
 * @deprecated Use `AppShell` (#58). Sidebar renders an AppShell: the
 * `sidebar` slot is its sidebar and `ariaLabel` its `label`. AppShell's own
 * props pass through.
 */
export interface SidebarProps {
  /** Ignored: AppShell has no mobile drawer. Use `collapsed` to shrink the sidebar to icons. @defaultValue `false` */
  open?: boolean;
  /** Ignored: the sidebar is always at the start edge (left in LTR, right in RTL). @defaultValue `'left'` */
  side?: 'left' | 'right';
  /** Ignored: AppShell always shows the sidebar, stacked above the content on narrow screens. @defaultValue `true` */
  responsive?: boolean;
  /** Names the sidebar's landmark. AppShell's `label`. @defaultValue `'Sidebar navigation'` */
  ariaLabel?: string;
  /** Additional CSS classes for the frame. */
  className?: string;
}

/**
 * Props for the Sidebar component.
 *
 * A collapsible side navigation panel using DaisyUI's drawer pattern.
 * Supports responsive behavior with overlay on mobile and fixed on desktop.
 */
export interface SidebarProps {
  /** Whether the sidebar is open. Use with `v-model:open`. @defaultValue `false` */
  open?: boolean;
  /** Side the sidebar appears on. @defaultValue `'left'` */
  side?: 'left' | 'right';
  /** When true, sidebar is always visible on `lg` breakpoint and above. @defaultValue `true` */
  responsive?: boolean;
  /** Accessible label for the sidebar navigation. @defaultValue `'Sidebar navigation'` */
  ariaLabel?: string;
  /** Additional CSS classes for the sidebar container. */
  className?: string;
}

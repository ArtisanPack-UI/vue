/**
 * @module utility
 *
 * Utility components for common UI needs including icons, theme toggling,
 * tooltips, clipboard operations, and markdown rendering.
 *
 * @example
 * ```vue
 * import { Icon, ThemeToggle, Tooltip, Clipboard, Markdown } from '@artisanpack-ui/vue';
 * ```
 *
 * @packageDocumentation
 */

export { default as Icon } from './Icon/Icon.vue';
export type { IconProps } from './Icon/types';

export { default as ThemeToggle } from './ThemeToggle/ThemeToggle.vue';
export type { ThemeToggleProps } from './ThemeToggle/types';

export { default as Tooltip } from './Tooltip/Tooltip.vue';
export type { TooltipProps, TooltipPosition } from './Tooltip/types';

export { default as Clipboard } from './Clipboard/Clipboard.vue';
export type { ClipboardProps } from './Clipboard/types';

export { default as Markdown } from './Markdown/Markdown.vue';
export type { MarkdownProps } from './Markdown/types';

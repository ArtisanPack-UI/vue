/**
 * @module composables
 *
 * Shared Vue composables for the ArtisanPack UI component library.
 * Provides reactive utilities for theme management and viewport
 * breakpoint detection.
 *
 * @packageDocumentation
 */

export { provideTheme, useTheme, ThemeKey } from './use-theme';
export type { ColorScheme, ThemeContextValue } from './use-theme';

export { useBreakpoint } from './use-breakpoint';
export type { Breakpoint, BreakpointContext } from './use-breakpoint';

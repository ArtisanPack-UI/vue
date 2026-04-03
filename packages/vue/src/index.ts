/**
 * @module @artisanpack-ui/vue
 *
 * The main entry point for the ArtisanPack UI Vue component library.
 * Re-exports all components, composables, the plugin, and shared types.
 *
 * @packageDocumentation
 */

// Components
export * from './components/form';
export * from './components/layout';
export * from './components/navigation';
export * from './components/display';
export * from './components/data';
export * from './components/feedback';
export * from './components/utility';

// Composables
export { provideTheme, useTheme, ThemeKey } from './composables/use-theme';
export type { ColorScheme, ThemeContextValue } from './composables/use-theme';

export { useBreakpoint } from './composables/use-breakpoint';
export type { Breakpoint, BreakpointContext } from './composables/use-breakpoint';

// Plugin
export { createArtisanPackUI, DefaultColorSchemeKey } from './plugin';
export type { ArtisanPackUIOptions } from './plugin';

// Types
export type * from './types/common';
export type * from './types/form';

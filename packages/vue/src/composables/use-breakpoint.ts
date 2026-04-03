/**
 * @module use-breakpoint
 *
 * Provides a Vue composable for reactive viewport breakpoint detection.
 * Tracks the current breakpoint using `matchMedia` listeners and exposes
 * both the active breakpoint name and boolean helpers for each threshold.
 *
 * Uses Tailwind CSS v4 default breakpoints.
 *
 * @packageDocumentation
 */

import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

/** Breakpoint names matching Tailwind CSS defaults. */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Tailwind CSS v4 default breakpoint widths in pixels. */
const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/** Ordered breakpoint names from smallest to largest. */
const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Values exposed by the breakpoint composable.
 */
export interface BreakpointContext {
  /** The currently active breakpoint name. */
  current: Ref<Breakpoint>;
  /** True when viewport width is >= 640px (sm). */
  isSm: Ref<boolean>;
  /** True when viewport width is >= 768px (md). */
  isMd: Ref<boolean>;
  /** True when viewport width is >= 1024px (lg). */
  isLg: Ref<boolean>;
  /** True when viewport width is >= 1280px (xl). */
  isXl: Ref<boolean>;
  /** True when viewport width is >= 1536px (2xl). */
  is2xl: Ref<boolean>;
}

/**
 * Determines the current breakpoint from the window width.
 */
function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') {
    return 'md';
  }

  const width = window.innerWidth;
  let current: Breakpoint = 'xs';

  for (const bp of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINT_VALUES[bp]) {
      current = bp;
    }
  }

  return current;
}

/**
 * Composable for reactive viewport breakpoint detection.
 *
 * Tracks the current Tailwind CSS breakpoint and provides boolean
 * helpers for each threshold. Updates reactively as the viewport
 * is resized.
 *
 * @returns The breakpoint context with reactive refs.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBreakpoint } from '@artisanpack-ui/vue';
 *
 * const { current, isMd, isLg } = useBreakpoint();
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Current breakpoint: {{ current }}</p>
 *     <SidebarNav v-if="isLg" />
 *     <MobileNav v-else />
 *   </div>
 * </template>
 * ```
 */
export function useBreakpoint(): BreakpointContext {
  const current = ref<Breakpoint>(getCurrentBreakpoint());

  const cleanups: (() => void)[] = [];

  onMounted(() => {
    // Use matchMedia for each breakpoint for efficient change detection
    for (const bp of BREAKPOINT_ORDER) {
      if (bp === 'xs') continue;

      const mql = window.matchMedia(`(min-width: ${BREAKPOINT_VALUES[bp]}px)`);
      const handler = () => {
        current.value = getCurrentBreakpoint();
      };
      mql.addEventListener('change', handler);
      cleanups.push(() => mql.removeEventListener('change', handler));
    }
  });

  onUnmounted(() => {
    cleanups.forEach((fn) => fn());
  });

  // Pre-compute static breakpoint indices to avoid repeated lookups
  const smIdx = BREAKPOINT_ORDER.indexOf('sm');
  const mdIdx = BREAKPOINT_ORDER.indexOf('md');
  const lgIdx = BREAKPOINT_ORDER.indexOf('lg');
  const xlIdx = BREAKPOINT_ORDER.indexOf('xl');
  const xxlIdx = BREAKPOINT_ORDER.indexOf('2xl');

  const currentIdx = computed(() => BREAKPOINT_ORDER.indexOf(current.value));

  const isSm = computed(() => currentIdx.value >= smIdx);
  const isMd = computed(() => currentIdx.value >= mdIdx);
  const isLg = computed(() => currentIdx.value >= lgIdx);
  const isXl = computed(() => currentIdx.value >= xlIdx);
  const is2xl = computed(() => currentIdx.value >= xxlIdx);

  return {
    current,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
}

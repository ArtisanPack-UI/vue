/**
 * Vitest setup file for @artisanpack-ui/vue.
 *
 * Configures the test environment with @testing-library/vue utilities
 * and vitest-axe accessibility matchers.
 */

import { cleanup } from '@testing-library/vue';
import { afterEach, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

/**
 * jsdom has no ResizeObserver; the overlays' positioning (Floating UI, in
 * the behavior package) observes the trigger and panel with one.
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

afterEach(() => {
  cleanup();
});

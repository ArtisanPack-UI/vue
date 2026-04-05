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

afterEach(() => {
  cleanup();
});

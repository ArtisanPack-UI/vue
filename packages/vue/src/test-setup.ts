/**
 * Vitest setup file for @artisanpack-ui/vue.
 *
 * Configures the test environment with @testing-library/vue utilities.
 */

import { cleanup } from '@testing-library/vue';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // The design-system packages are linked from outside this repo, so make
    // them share this repo's Vue instead of loading a second copy.
    dedupe: ['vue'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: [...configDefaults.exclude, 'visual-tests/**'],
  },
});

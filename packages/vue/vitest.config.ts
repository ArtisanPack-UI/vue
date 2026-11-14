import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Make the design-system packages share this repo's Vue (and Zag's Vue
    // adapter, which the behavior package imports) instead of loading second
    // copies, whose reactivity wouldn't see this repo's refs.
    dedupe: ['vue', '@zag-js/vue'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: [...configDefaults.exclude, 'visual-tests/**'],
    // Run Zag's Vue adapter through Vite, so the dedupe above applies to it.
    server: { deps: { inline: [/@zag-js\/vue/] } },
  },
});

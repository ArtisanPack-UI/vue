import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@artisanpack-ui/vue': decodeURIComponent(
        new URL('../vue/src/index.ts', import.meta.url).pathname,
      ),
    },
    // As in packages/vue: the design-system packages share this
    // repo's Vue and Zag Vue adapter instead of loading second copies.
    dedupe: ['vue', '@zag-js/vue'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Run Zag's Vue adapter through Vite, so the dedupe above applies to it.
    server: { deps: { inline: [/@zag-js\/vue/] } },
  },
});

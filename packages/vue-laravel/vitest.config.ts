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
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});

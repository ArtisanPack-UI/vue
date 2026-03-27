import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['vue', '@inertiajs/vue3', '@artisanpack-ui/vue'],
  outExtension: () => ({ js: '.mjs' }),
});

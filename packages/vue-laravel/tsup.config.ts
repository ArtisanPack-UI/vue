import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue3';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['vue', '@inertiajs/vue3', '@artisanpack-ui/vue', '@artisanpack-ui/tokens'],
  outExtension: () => ({ js: '.mjs' }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  esbuildPlugins: [vue() as any],
});

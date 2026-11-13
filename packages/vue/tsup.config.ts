import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue3';
import { entries } from './build-entries.mjs';

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['vue', '@artisanpack-ui/tokens', 'apexcharts', 'vue3-apexcharts'],
  outExtension: () => ({ js: '.mjs' }),
  esbuildPlugins: [vue()],
});

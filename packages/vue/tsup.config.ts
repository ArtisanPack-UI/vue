import { defineConfig } from 'tsup';
import vue from 'esbuild-plugin-vue3';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    form: 'src/components/form/index.ts',
    layout: 'src/components/layout/index.ts',
    navigation: 'src/components/navigation/index.ts',
    display: 'src/components/display/index.ts',
    data: 'src/components/data/index.ts',
    feedback: 'src/components/feedback/index.ts',
    utility: 'src/components/utility/index.ts',
    composables: 'src/composables/index.ts',
  },
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ['vue', '@artisanpack-ui/tokens'],
  outExtension: () => ({ js: '.mjs' }),
  esbuildPlugins: [vue()],
});

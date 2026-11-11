import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [HstVue()],
  setupFile: './src/histoire-setup.ts',
  storyMatch: ['./src/**/*.story.vue'],
  tree: {
    groups: [
      { id: 'form', title: 'Form' },
      { id: 'layout', title: 'Layout' },
      { id: 'navigation', title: 'Navigation' },
      { id: 'display', title: 'Display' },
      { id: 'data', title: 'Data' },
      { id: 'feedback', title: 'Feedback' },
      { id: 'utility', title: 'Utility' },
    ],
  },
  theme: {
    title: 'ArtisanPack UI — Vue',
  },
  vite: {
    plugins: [tailwindcss(), vue()],
    // The design-system packages are linked from outside this repo; share
    // this repo's Vue and Zag Vue adapter with them instead of second copies.
    resolve: { dedupe: ['vue', '@zag-js/vue'] },
  },
});

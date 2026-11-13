/**
 * The Vue fixture host for the design-system quality gates (`apui-gates`).
 *
 * The gate runner bundles this entry with esbuild, which can't compile `.vue`
 * files (and would follow the tsconfig path alias to `src/`), so it imports
 * the built package: run `npm run build` first. Plain JS keeps it out of the
 * type-check, which runs without a build.
 */
import { registerVueHost } from '@artisanpack-ui/testing/vue-host';
import * as components from '../dist/index.mjs';

registerVueHost(components);

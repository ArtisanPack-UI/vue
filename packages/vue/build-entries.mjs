/**
 * The package's build entries, one per `exports` subpath.
 *
 * tsup bundles each entry to `dist/<name>.mjs`. vue-tsc emits declarations per
 * source file instead, so `scripts/write-subpath-types.mjs` uses the same map to
 * write a `dist/<name>.d.ts` that re-exports each entry's declarations.
 *
 * @type {Record<string, string>}
 */
export const entries = {
  index: 'src/index.ts',
  form: 'src/components/form/index.ts',
  layout: 'src/components/layout/index.ts',
  navigation: 'src/components/navigation/index.ts',
  display: 'src/components/display/index.ts',
  data: 'src/components/data/index.ts',
  feedback: 'src/components/feedback/index.ts',
  utility: 'src/components/utility/index.ts',
  composables: 'src/composables/index.ts',
  ai: 'src/components/ai/index.ts',
};

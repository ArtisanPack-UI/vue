// @vitest-environment node
/**
 * API parity with the design-system manifests (#41, D-016) for Markdown
 * (#65). Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Markdown } from '../../components/utility';

type KitComponent = Parameters<typeof expectParity>[0];

const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: Markdown', () => {
  // content is the 2.x name for source, and update:source is v-model:source's
  // spelling of source-change. sanitize only changes raw HTML, which the
  // fixture source has none of.
  it('Markdown matches its manifest', () =>
    expectVueParity(Markdown, 'Markdown', {
      ignoreDeclared: ['content', 'update:source'],
      ignoreEffects: ['sanitize'],
    }));
});

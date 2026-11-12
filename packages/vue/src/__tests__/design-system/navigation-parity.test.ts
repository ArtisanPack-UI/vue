// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the simple navigation
 * components of the navigation wave (#56): Link, Breadcrumbs, Pagination and
 * Steps. Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Breadcrumbs, Link, Pagination, Steps } from '../../components/navigation';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: navigation', () => {
  it('Link matches its manifest', () => expectVueParity(Link, 'Link'));

  it('Breadcrumbs matches its manifest', () => expectVueParity(Breadcrumbs, 'Breadcrumbs'));

  // update:page is v-model:page's half of page-change, not API of its own.
  it('Pagination matches its manifest', () =>
    expectVueParity(Pagination, 'Pagination', { ignoreDeclared: ['update:page'] }));

  it('Steps matches its manifest', () => expectVueParity(Steps, 'Steps'));
});

// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the Feedback wave
 * (#60): Alert, Loading, Progress, ProgressRadial, Skeleton, EmptyState and
 * ErrorState. Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Alert, EmptyState, ErrorState, Loading, Skeleton } from '../../components/feedback';
import { Progress, ProgressRadial } from '../../components/display';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: feedback', () => {
  it('Alert matches its manifest', () => expectVueParity(Alert, 'Alert'));
  it('Loading matches its manifest', () => expectVueParity(Loading, 'Loading'));
  // The kit binds the manifest's value as modelValue (Vue's v-model
  // spelling); Progress takes both, value first, so value isn't extra API.
  it('Progress matches its manifest', () =>
    expectVueParity(Progress, 'Progress', { ignoreDeclared: ['value'] }));
  it('ProgressRadial matches its manifest', () =>
    expectVueParity(ProgressRadial, 'ProgressRadial', { ignoreDeclared: ['value'] }));
  it('Skeleton matches its manifest', () => expectVueParity(Skeleton, 'Skeleton'));
  it('EmptyState matches its manifest', () => expectVueParity(EmptyState, 'EmptyState'));
  it('ErrorState matches its manifest', () => expectVueParity(ErrorState, 'ErrorState'));
});

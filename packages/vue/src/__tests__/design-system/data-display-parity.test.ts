// @vitest-environment node
/**
 * API parity with the design-system manifests (#41, D-016) for the Data
 * Display wave's Stat, KpiCard, Sparkline, Timeline and Diff (#61). Runs in Node
 * because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Diff, KpiCard, Sparkline, Stat, Timeline } from '../../components/display';

type KitComponent = Parameters<typeof expectParity>[0];

const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: data display', () => {
  // The kit spells value as modelValue in Vue; Stat takes both, value first,
  // so value isn't extra API. Only the down label shows: the fixture's change
  // is negative.
  it('Stat matches its manifest', () =>
    expectVueParity(Stat, 'Stat', {
      ignoreDeclared: ['value'],
      ignoreEffects: ['upLabel', 'flatLabel'],
    }));

  it('KpiCard matches its manifest', () => expectVueParity(KpiCard, 'KpiCard'));

  it('Sparkline matches its manifest', () => expectVueParity(Sparkline, 'Sparkline'));

  it('Timeline matches its manifest', () => expectVueParity(Timeline, 'Timeline'));

  // emptyLabel shows only when nothing changed.
  it('Diff matches its manifest', () =>
    expectVueParity(Diff, 'Diff', { ignoreEffects: ['emptyLabel'] }));
});

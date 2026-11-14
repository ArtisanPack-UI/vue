// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for Calendar (#64). Runs
 * in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Calendar } from '../../components/data';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: Calendar', () => {
  // update:view and update:date are the v-model halves of view-change and
  // date-change; the rest are deprecated 2.x props, the 2.x v-model and the
  // 2.x month-change event.
  it('Calendar matches its manifest', () =>
    expectVueParity(Calendar, 'Calendar', {
      ignoreDeclared: [
        'update:view',
        'update:date',
        'update:modelValue',
        'month-change',
        'modelValue',
        'month',
        'year',
        'weekStart',
        'minDate',
        'maxDate',
        'className',
      ],
    }));
});

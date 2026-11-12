// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for Table (#62). Runs in
 * Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Table } from '../../components/data';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: Table', () => {
  // update:expanded and update:sortBy are the v-model halves of expanded-change
  // and sort-change; the rest are deprecated 1.x props and the 1.x sort event.
  // emptyText shows only without rows, actionsLabel only with an actions slot.
  it('Table matches its manifest', () =>
    expectVueParity(Table, 'Table', {
      ignoreDeclared: [
        'update:expanded',
        'update:sortBy',
        'sort',
        'columns',
        'className',
        'compact',
        'emptyMessage',
        'striped',
        'hoverable',
        'pinRows',
        'pinCols',
      ],
      ignoreEffects: ['emptyText', 'actionsLabel'],
    }));
});

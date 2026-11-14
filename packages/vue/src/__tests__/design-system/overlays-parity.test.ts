// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the overlays (#58,
 * #59): Drawer, Popover and Tooltip. Runs in Node because the kit renders on
 * the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Drawer, Popover } from '../../components/layout';
import { Tooltip } from '../../components/utility';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's Vue; cast. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: overlays', () => {
  it('Drawer matches its manifest', () => expectVueParity(Drawer, 'Drawer'));

  it('Popover matches its manifest', () => expectVueParity(Popover, 'Popover'));

  // delay only changes when the label shows on hover; covered in Tooltip.test.ts.
  it('Tooltip matches its manifest', () =>
    expectVueParity(Tooltip, 'Tooltip', { ignoreEffects: ['delay'] }));
});

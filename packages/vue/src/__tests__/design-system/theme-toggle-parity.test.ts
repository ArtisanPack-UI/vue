// @vitest-environment node
/**
 * API parity with the design-system manifest (#41, D-016) for the Utility
 * wave's ThemeToggle (#65). Runs in Node because the kit renders on the
 * server.
 */
import { describe, it } from 'vitest';
import { expectVueParity as expectParity } from '@artisanpack-ui/testing/vue';
import { ThemeToggle } from '../../components/utility';

type KitComponent = Parameters<typeof expectParity>[0];

describe('design-system parity: theme toggle', () => {
  // The menu's system name and the icon button's names show only in those
  // variants; the storage key only changes what's stored.
  it('ThemeToggle matches its manifest', () =>
    expectParity(ThemeToggle as unknown as KitComponent, 'ThemeToggle', {
      ignoreEffects: ['matchSystemLabel', 'switchToLightLabel', 'switchToDarkLabel', 'storageKey'],
    }));
});

// @vitest-environment node
/**
 * API parity with the design-system manifests (#41, D-016) for the Utility
 * wave's Code, Clipboard and Kbd (#65). Runs in Node because the kit renders
 * on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Code } from '../../components/display';
import { Clipboard, Kbd } from '../../components/utility';

type KitComponent = Parameters<typeof expectParity>[0];

const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: code, clipboard and kbd', () => {
  // The copied and error strings only show after a click.
  it('Code matches its manifest', () =>
    expectVueParity(Code, 'Code', {
      ignoreEffects: ['copiedLabel', 'copiedMessage', 'errorMessage'],
    }));

  // The kit spells value as modelValue in Vue; Clipboard takes both, value
  // first, so value isn't extra API. text is the deprecated 2.x name of
  // value. The timeout and the copied and error strings only show after a
  // click.
  it('Clipboard matches its manifest', () =>
    expectVueParity(Clipboard, 'Clipboard', {
      ignoreDeclared: ['value', 'text'],
      ignoreEffects: ['timeout', 'copiedLabel', 'copiedMessage', 'errorMessage'],
    }));

  it('Kbd matches its manifest', () => expectVueParity(Kbd, 'Kbd'));
});

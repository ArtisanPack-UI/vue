// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the form-choice
 * components (#53): RadioGroup, CheckboxGroup, Rating, ColorPicker and File
 * render the manifest's parts and data attributes and declare exactly the
 * manifest's props and emits. Runs in Node because the kit renders on the
 * server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { CheckboxGroup, ColorPicker, File, RadioGroup, Rating } from '../../components/form';

type KitComponent = Parameters<typeof expectParity>[0];

/** The kit's `Component` type comes from the design-system repo's copy of Vue. */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: form choice', () => {
  it('RadioGroup matches its manifest', () => expectVueParity(RadioGroup, 'RadioGroup'));

  it('CheckboxGroup matches its manifest', () => expectVueParity(CheckboxGroup, 'CheckboxGroup'));

  it('Rating matches its manifest', () => expectVueParity(Rating, 'Rating'));

  it('ColorPicker matches its manifest', () => expectVueParity(ColorPicker, 'ColorPicker'));

  it('File matches its manifest', () => expectVueParity(File, 'File'));
});

// @vitest-environment node
/**
 * API parity with the design-system manifests (#41): each pilot component
 * renders the manifest's parts and data attributes and declares exactly the
 * manifest's props and emits. Runs in Node because the kit renders on the
 * server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { Button, Checkbox, Input, Select } from '../../components/form';
import { Card, Dialog, DropdownMenu } from '../../components/layout';
import { Toast } from '../../components/feedback';

type KitComponent = Parameters<typeof expectParity>[0];

/**
 * The kit is linked from the design-system repo, so its `Component` type
 * comes from that repo's copy of Vue; cast instead of comparing the two.
 */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity', () => {
  it('Button matches its manifest', () => expectVueParity(Button, 'Button'));

  it('Input matches its manifest', () => expectVueParity(Input, 'Input'));

  it('Select matches its manifest', () => expectVueParity(Select, 'Select'));

  it('Checkbox matches its manifest', () => expectVueParity(Checkbox, 'Checkbox'));

  // mediaAlt only shows on the media image, which the parity base doesn't
  // render (media is a fixture part); covered in card.test.ts.
  it('Card matches its manifest', () => expectVueParity(Card, 'Card'));

  it('Dialog matches its manifest', () => expectVueParity(Dialog, 'Dialog'));

  it('DropdownMenu matches its manifest', () => expectVueParity(DropdownMenu, 'DropdownMenu'));

  it('Toast matches its manifest', () => expectVueParity(Toast, 'Toast'));
});

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
import { Combobox } from '../../components/form';
import {
  Fieldset,
  Form,
  Password,
  Pin,
  Range,
  Textarea,
  Toggle,
  ValidationSummary,
} from '../../components/form';
import { Card, Dialog, DropdownMenu } from '../../components/layout';
import { Tabs } from '../../components/layout';
import { Menu, Navbar } from '../../components/navigation';
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

  // Form text wave (#53). Labels that only show near the counter's limit,
  // with a strength meter or with two thumbs are covered in their own tests.
  it('Textarea matches its manifest', () =>
    expectVueParity(Textarea, 'Textarea', { ignoreEffects: ['remainingLabel'] }));

  it('Password matches its manifest', () =>
    expectVueParity(Password, 'Password', { ignoreEffects: ['labels'] }));

  it('Pin matches its manifest', () => expectVueParity(Pin, 'Pin'));

  it('Range matches its manifest', () =>
    expectVueParity(Range, 'Range', { ignoreEffects: ['thumbLabels'] }));

  it('Toggle matches its manifest', () => expectVueParity(Toggle, 'Toggle'));

  it('Fieldset matches its manifest', () => expectVueParity(Fieldset, 'Fieldset'));

  it('Form matches its manifest', () => expectVueParity(Form, 'Form'));

  it('ValidationSummary matches its manifest', () =>
    expectVueParity(ValidationSummary, 'ValidationSummary'));

  // Combobox (#54): max, the chip labels and the loading and clear labels
  // only show with chosen values, a removal, loading or clearable, which
  // the parity base doesn't render; name's hidden inputs need a value too.
  // Covered in combobox.test.ts.
  it('Combobox matches its manifest', () =>
    expectVueParity(Combobox, 'Combobox', {
      ignoreEffects: ['max', 'removeLabel', 'removedLabel', 'loadingLabel', 'clearLabel', 'name'],
    }));

  // Navigation wave (#56).
  it('Tabs matches its manifest', () => expectVueParity(Tabs, 'Tabs'));

  it('Menu matches its manifest', () => expectVueParity(Menu, 'Menu'));

  it('Navbar matches its manifest', () => expectVueParity(Navbar, 'Navbar'));
});

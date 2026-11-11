import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Select } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="select"][data-part="${name}"]`);

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada', disabled: true },
];

describe('Select', () => {
  it('renders the root, label, box, control and indicator', () => {
    const { container } = render(Select, { props: { label: 'Country', options: COUNTRIES } });
    const root = container.querySelector('.apui-select')!;
    expect(root.getAttribute('data-size')).toBe('md');
    const control = screen.getByLabelText('Country');
    expect(control.tagName).toBe('SELECT');
    expect(control.getAttribute('data-part')).toBe('control');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe(control.id);
    const box = partOf(container, 'box')!;
    expect([...box.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'control',
      'indicator',
    ]);
    const indicator = partOf(container, 'indicator')!;
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(indicator.querySelector('svg')).not.toBeNull();
    expect(indicator.hasAttribute('data-mirror')).toBe(false);
  });

  it('renders the default placeholder first, then object options', () => {
    const { container } = render(Select, { props: { label: 'Country', options: COUNTRIES } });
    const options = [...container.querySelectorAll('option')];
    expect(options.map((o) => [o.value, o.textContent, o.disabled])).toEqual([
      ['', 'Select…', false],
      ['us', 'United States', false],
      ['ca', 'Canada', true],
    ]);
  });

  it('accepts string options', () => {
    const { container } = render(Select, { props: { label: 'Size', options: ['S', 'M'] } });
    const options = [...container.querySelectorAll('option')].slice(1);
    expect(options.map((o) => [o.value, o.textContent])).toEqual([
      ['S', 'S'],
      ['M', 'M'],
    ]);
  });

  it('disables the placeholder option when required and shows the mark', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, required: true },
    });
    expect(container.querySelector('option')!.disabled).toBe(true);
    expect(partOf(container, 'label')!.innerHTML).toMatch(/^Country<span[^>]*>\*<\/span>$/);
    expect(partOf(container, 'control')!.hasAttribute('required')).toBe(true);
  });

  it('selects the placeholder when the value is empty, even when it is disabled', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, required: true },
    });
    const placeholder = container.querySelector('option')!;
    expect(placeholder.disabled).toBe(true);
    expect(placeholder.hasAttribute('selected')).toBe(true);
    expect((partOf(container, 'control') as HTMLSelectElement).value).toBe('');
    expect(container.querySelector('option[value="us"]')!.hasAttribute('selected')).toBe(false);
  });

  it('does not select the placeholder when a value is bound', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, modelValue: 'us' },
    });
    expect(container.querySelector('option')!.hasAttribute('selected')).toBe(false);
  });

  it('uses a custom placeholder, and none for an empty string', () => {
    const { container, unmount } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, placeholder: 'Pick one' },
    });
    expect(container.querySelector('option')!.textContent).toBe('Pick one');
    unmount();
    const second = render(Select, {
      props: { label: 'Country', options: COUNTRIES, placeholder: '' },
    });
    expect(second.container.querySelector('option')!.value).toBe('us');
  });

  it('marks the bound option selected, comparing values as strings', () => {
    const { container } = render(Select, {
      props: {
        label: 'Count',
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ],
        modelValue: 2,
      },
    });
    const control = partOf(container, 'control') as HTMLSelectElement;
    expect(control.value).toBe('2');
    expect(container.querySelector('option[value="2"]')!.hasAttribute('selected')).toBe(true);
    expect((container.querySelector('option[value="2"]') as HTMLOptionElement).selected).toBe(true);
  });

  it('renders option children after the options and selects them by value', async () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, modelValue: 'mx' },
      slots: { default: '<option value="mx">Mexico</option>' },
    });
    const options = [...container.querySelectorAll('option')];
    expect(options.map((o) => o.value)).toEqual(['', 'us', 'ca', 'mx']);
    await nextTick();
    expect((partOf(container, 'control') as HTMLSelectElement).value).toBe('mx');
  });

  it('supports v-model', async () => {
    const value = ref<string | number>('us');
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(Select, {
            label: 'Country',
            options: [...COUNTRIES, { value: 'gb', label: 'United Kingdom' }],
            modelValue: value.value,
            'onUpdate:modelValue': (next: string | number) => (value.value = next),
          }),
      }),
    );
    const control = partOf(container, 'control') as HTMLSelectElement;
    expect(control.value).toBe('us');
    await fireEvent.update(control, 'gb');
    expect(value.value).toBe('gb');
    value.value = 'us';
    await nextTick();
    expect(control.value).toBe('us');
  });

  it('links hint and error, and marks the field invalid', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, hint: 'Where?', error: 'Choose one.' },
      attrs: { id: 'country' },
    });
    expect(container.querySelector('.apui-select')!.getAttribute('data-invalid')).toBe('');
    const control = partOf(container, 'control')!;
    expect(control.id).toBe('country');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('aria-describedby')).toBe('country-hint country-error');
    expect(partOf(container, 'hint')!.textContent).toBe('Where?');
    const error = partOf(container, 'error')!;
    expect(error.id).toBe('country-error');
    expect(error.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(error.textContent).toBe('Choose one.');
  });

  it('applies invalid and disabled without a message', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, invalid: true, disabled: true },
    });
    const root = container.querySelector('.apui-select')!;
    expect(root.getAttribute('data-invalid')).toBe('');
    expect(root.getAttribute('data-disabled')).toBe('');
    const control = partOf(container, 'control') as HTMLSelectElement;
    expect(control.disabled).toBe(true);
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });

  it('renders the leading icon, and the icon slot overrides it', () => {
    const { container, unmount } = render(Select, {
      props: { label: 'Owner', options: COUNTRIES, leadingIcon: 'user' },
    });
    expect(partOf(container, 'icon')!.querySelector('svg')).not.toBeNull();
    unmount();
    const second = render(Select, {
      props: { label: 'Owner', options: COUNTRIES, leadingIcon: 'user' },
      slots: { icon: '<i class="custom" />' },
    });
    const icon = partOf(second.container, 'icon')!;
    expect(icon.querySelector('.custom')).not.toBeNull();
    expect(icon.querySelector('svg')).toBeNull();
  });

  it('routes class to the root and every other attribute to the control', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES, size: 'sm', classes: { root: 'r', box: 'b' } },
      attrs: { class: 'extra', name: 'country', 'data-testid': 'field' },
    });
    const root = container.querySelector('.apui-select')!;
    expect(root.className).toBe('apui-select extra r');
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(screen.getByTestId('field').getAttribute('name')).toBe('country');
    expect(partOf(container, 'box')!.className).toBe('b');
  });

  it('emits the original option value, so numbers stay numbers', async () => {
    const { container, emitted } = render(Select, {
      props: {
        label: 'Count',
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ],
      },
    });
    await fireEvent.update(partOf(container, 'control')!, '2');
    expect(emitted()['update:modelValue']).toEqual([[2]]);
  });

  it('emits strings for string options, option children and the placeholder', async () => {
    const { container, emitted } = render(Select, {
      props: { label: 'Country', options: ['us', 'ca'], modelValue: 'us' },
      slots: { default: '<option value="7">Seven</option>' },
    });
    const control = partOf(container, 'control')!;
    await fireEvent.update(control, 'ca');
    await fireEvent.update(control, '7');
    await fireEvent.update(control, '');
    expect(emitted()['update:modelValue']).toEqual([['ca'], ['7'], ['']]);
  });

  it('keeps a consumer aria-invalid unless the field is invalid', () => {
    const { container } = render(Select, {
      props: { label: 'Country', options: COUNTRIES },
      attrs: { 'aria-invalid': 'grammar' },
    });
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('grammar');
  });
});

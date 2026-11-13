import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';
import { Input } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="input"][data-part="${name}"]`);

describe('Input', () => {
  it('renders the root, label, box and control', () => {
    const { container } = render(Input, { props: { label: 'Email' } });
    const root = container.querySelector('.apui-input')!;
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.hasAttribute('data-invalid')).toBe(false);
    const control = screen.getByLabelText('Email') as HTMLInputElement;
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.getAttribute('type')).toBe('text');
    expect(partOf(container, 'box')!.contains(control)).toBe(true);
    expect(control.hasAttribute('aria-describedby')).toBe(false);
    expect(control.hasAttribute('aria-invalid')).toBe(false);
  });

  it('links the label to a generated id', () => {
    const { container } = render(Input, { props: { label: 'Email' } });
    const control = partOf(container, 'control')!;
    expect(control.id).not.toBe('');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe(control.id);
  });

  it('gives each instance its own id', () => {
    const { container } = render(
      defineComponent({
        render: () => [h(Input, { label: 'One' }), h(Input, { label: 'Two' })],
      }),
    );
    const ids = [...container.querySelectorAll('input')].map((input) => input.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('uses an explicit id for the control and the derived ids', () => {
    const { container } = render(Input, {
      props: { label: 'Email', hint: 'Hint', error: 'Error' },
      attrs: { id: 'email' },
    });
    const control = partOf(container, 'control')!;
    expect(control.id).toBe('email');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe('email');
    expect(partOf(container, 'hint')!.id).toBe('email-hint');
    expect(partOf(container, 'error')!.id).toBe('email-error');
    expect(control.getAttribute('aria-describedby')).toBe('email-hint email-error');
    expect(container.querySelector('.apui-input')!.hasAttribute('id')).toBe(false);
  });

  it('describes the control by the hint alone', () => {
    const { container } = render(Input, {
      props: { label: 'Email', hint: 'We never share it.' },
      attrs: { id: 'e' },
    });
    expect(partOf(container, 'control')!.getAttribute('aria-describedby')).toBe('e-hint');
    expect(partOf(container, 'error')).toBeNull();
  });

  it('marks the field invalid and renders the error with its icon', () => {
    const { container } = render(Input, {
      props: { label: 'Email', error: 'Enter a valid email address.' },
      attrs: { id: 'e' },
    });
    expect(container.querySelector('.apui-input')!.getAttribute('data-invalid')).toBe('');
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('aria-describedby')).toBe('e-error');
    const error = partOf(container, 'error')!;
    expect(error.tagName).toBe('P');
    expect(error.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(error.textContent).toBe('Enter a valid email address.');
  });

  it('marks the field invalid without a message', () => {
    const { container } = render(Input, { props: { label: 'Email', invalid: true } });
    expect(container.querySelector('.apui-input')!.getAttribute('data-invalid')).toBe('');
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('true');
    expect(partOf(container, 'error')).toBeNull();
  });

  it('shows the required mark directly after the label and sets required', () => {
    const { container } = render(Input, { props: { label: 'Email', required: true } });
    const label = partOf(container, 'label')!;
    expect(label.innerHTML).toMatch(/^Email<span[^>]*>\*<\/span>$/);
    expect(partOf(container, 'required')!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf(container, 'control')!.hasAttribute('required')).toBe(true);
  });

  it('renders no label part without a label', () => {
    const { container } = render(Input, {
      props: { required: true },
      attrs: { 'aria-label': 'Search' },
    });
    expect(partOf(container, 'label')).toBeNull();
    expect(partOf(container, 'required')).toBeNull();
    expect(partOf(container, 'control')!.getAttribute('aria-label')).toBe('Search');
  });

  it('applies disabled and readonly', () => {
    const { container } = render(Input, {
      props: { label: 'Email', disabled: true, readonly: true },
    });
    const root = container.querySelector('.apui-input')!;
    expect(root.getAttribute('data-disabled')).toBe('');
    expect(root.getAttribute('data-readonly')).toBe('');
    const control = partOf(container, 'control') as HTMLInputElement;
    expect(control.disabled).toBe(true);
    expect(control.readOnly).toBe(true);
  });

  it('passes type, placeholder and size through', () => {
    const { container } = render(Input, {
      props: { label: 'Email', type: 'email', placeholder: 'you@example.com', size: 'lg' },
    });
    expect(container.querySelector('.apui-input')!.getAttribute('data-size')).toBe('lg');
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('type')).toBe('email');
    expect(control.getAttribute('placeholder')).toBe('you@example.com');
  });

  it('routes class to the root and every other attribute to the control', () => {
    const { container } = render(Input, {
      props: { label: 'Email', classes: { root: 'r', control: 'c', label: 'l' } },
      attrs: { class: 'extra', name: 'email', autocomplete: 'email', 'data-testid': 'field' },
    });
    const root = container.querySelector('.apui-input')!;
    expect(root.className).toBe('apui-input extra r');
    expect(root.hasAttribute('name')).toBe(false);
    const control = screen.getByTestId('field');
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.getAttribute('name')).toBe('email');
    expect(control.getAttribute('autocomplete')).toBe('email');
    expect(control.className).toBe('c');
    expect(partOf(container, 'label')!.className).toBe('l');
  });

  it('supports v-model', async () => {
    const value = ref('hello');
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(Input, {
            label: 'Name',
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
          }),
      }),
    );
    const control = partOf(container, 'control') as HTMLInputElement;
    expect(control.value).toBe('hello');
    await fireEvent.update(control, 'world');
    expect(value.value).toBe('world');
    value.value = 'reset';
    await new Promise((resolve) => setTimeout(resolve));
    expect(control.value).toBe('reset');
  });

  it('emits update:modelValue on input and still calls an onInput listener', async () => {
    const calls: string[] = [];
    const { emitted, container } = render(Input, {
      props: { label: 'Name' },
      attrs: { onInput: () => calls.push('input') },
    });
    await fireEvent.update(partOf(container, 'control')!, 'abc');
    expect(emitted()['update:modelValue']).toEqual([['abc']]);
    expect(calls).toEqual(['input']);
  });

  it('renders prefix, suffix and icons in contract order', () => {
    const { container } = render(Input, {
      props: {
        label: 'Email',
        prefix: 'to:',
        suffix: '@work',
        leadingIcon: 'mail',
        trailingIcon: 'search',
      },
    });
    const box = partOf(container, 'box')!;
    expect([...box.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'prefix',
      'control',
      'suffix',
      'iconEnd',
    ]);
    expect(partOf(container, 'prefix')!.textContent).toBe('to:');
    expect(partOf(container, 'suffix')!.textContent).toBe('@work');
    expect(partOf(container, 'icon')!.querySelector('svg')).not.toBeNull();
    expect(partOf(container, 'iconEnd')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('lets slots override prefix, suffix and icons', () => {
    const { container } = render(Input, {
      props: { label: 'Price', prefix: '$', suffix: 'USD', leadingIcon: 'mail', trailingIcon: 'x' },
      slots: {
        prefix: '<b>€</b>',
        suffix: '<b>EUR</b>',
        icon: '<i class="start" />',
        iconEnd: '<i class="end" />',
      },
    });
    expect(partOf(container, 'prefix')!.innerHTML).toBe('<b>€</b>');
    expect(partOf(container, 'suffix')!.innerHTML).toBe('<b>EUR</b>');
    expect(partOf(container, 'icon')!.querySelector('.start')).not.toBeNull();
    expect(partOf(container, 'icon')!.querySelector('svg')).toBeNull();
    expect(partOf(container, 'iconEnd')!.querySelector('.end')).not.toBeNull();
  });

  it('omits optional parts that are not set', () => {
    const { container } = render(Input, { props: { label: 'Email' } });
    for (const name of ['required', 'icon', 'prefix', 'suffix', 'iconEnd', 'hint', 'error']) {
      expect(partOf(container, name)).toBeNull();
    }
  });

  it('keeps a consumer aria-invalid unless the field is invalid', () => {
    const { container, unmount } = render(Input, {
      props: { label: 'Name' },
      attrs: { 'aria-invalid': 'spelling' },
    });
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('spelling');
    unmount();
    const second = render(Input, {
      props: { label: 'Name', error: 'Required.' },
      attrs: { 'aria-invalid': 'spelling' },
    });
    expect(partOf(second.container, 'control')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('emits the string value, even for type="number"', async () => {
    const { container, emitted } = render(Input, {
      props: { label: 'Quantity', type: 'number', modelValue: 3 },
    });
    const control = partOf(container, 'control') as HTMLInputElement;
    expect(control.value).toBe('3');
    await fireEvent.update(control, '42');
    expect(emitted()['update:modelValue']).toEqual([['42']]);
    expect(typeof (emitted()['update:modelValue']![0] as unknown[])[0]).toBe('string');
  });
});

import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import { Pin } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="pin"][data-part="${name}"]`);
const cells = (container: Element) => [
  ...container.querySelectorAll('[data-scope="pin"][data-part="cell"]'),
];

describe('Pin', () => {
  it('renders one control for the whole code and aria-hidden cells', () => {
    const { container } = render(Pin, {
      props: { label: 'Code', groupSize: 3, hint: 'Sent.', error: 'Expired.' },
      attrs: { id: 'c' },
    });
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('autocomplete')).toBe('one-time-code');
    expect(control.getAttribute('inputmode')).toBe('numeric');
    expect(control.getAttribute('pattern')).toBe('[0-9]*');
    expect(control.getAttribute('maxlength')).toBe('6');
    expect(control.getAttribute('type')).toBe('text');
    expect(control.getAttribute('aria-describedby')).toBe('c-hint c-error');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe('c');
    expect(cells(container)).toHaveLength(6);
    expect(cells(container).every((cell) => cell.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    );
    const order = [...partOf(container, 'cells')!.children].map((el) =>
      el.getAttribute('data-part'),
    );
    expect(order).toEqual(['control', 'cell', 'cell', 'cell', 'separator', 'cell', 'cell', 'cell']);
    expect(cells(container)[0]!.hasAttribute('data-active')).toBe(true);
  });

  it('mirrors the value into the cells, masked when asked', () => {
    const { container } = render(Pin, {
      props: { label: 'PIN', length: 4, mask: true, modelValue: '12' },
    });
    expect(partOf(container, 'control')!.getAttribute('type')).toBe('password');
    expect(cells(container).map((cell) => cell.textContent)).toEqual(['•', '•', '', '']);
    expect(cells(container).map((cell) => cell.hasAttribute('data-filled'))).toEqual([
      true,
      true,
      false,
      false,
    ]);
    expect(cells(container)[2]!.hasAttribute('data-active')).toBe(true);
  });

  it('drops characters the type does not allow and emits complete once full', async () => {
    const { container, emitted } = render(Pin, { props: { label: 'Code', length: 4 } });
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.update(control, '1a2');
    expect(control.value).toBe('12');
    expect(emitted()['update:modelValue']).toEqual([['12']]);
    expect(emitted().complete).toBeUndefined();
    await fireEvent.update(control, '1234');
    expect(emitted().complete).toEqual([['1234']]);
  });

  it('distributes a pasted code across the cells', async () => {
    const { container, emitted } = render(Pin, { props: { label: 'Code', length: 6 } });
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.paste(control, { clipboardData: { getData: () => '503 186' } });
    expect(control.value).toBe('503186');
    expect(cells(container).map((cell) => cell.textContent)).toEqual([
      '5',
      '0',
      '3',
      '1',
      '8',
      '6',
    ]);
    expect(emitted().complete).toEqual([['503186']]);
  });

  it('allows letters in alphanumeric mode', async () => {
    const { container } = render(Pin, {
      props: { label: 'Code', length: 4, type: 'alphanumeric' },
    });
    const control = partOf(container, 'control') as HTMLInputElement;
    expect(control.getAttribute('inputmode')).toBe('text');
    expect(control.hasAttribute('pattern')).toBe(false);
    await fireEvent.update(control, 'ab-9');
    expect(control.value).toBe('ab9');
  });

  it('flags size, invalid and disabled', () => {
    const { container } = render(Pin, {
      props: { label: 'C', size: 'sm', invalid: true, disabled: true },
    });
    const root = container.querySelector('.apui-pin')!;
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.hasAttribute('data-invalid')).toBe(true);
    expect(root.hasAttribute('data-disabled')).toBe(true);
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('resyncs the cells of an uncontrolled pin when its form resets', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () => h('form', [h(Pin, { label: 'Code', length: 4 })]),
      }),
    );
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.update(control, '1234');
    expect(cells(container).map((cell) => cell.textContent)).toEqual(['1', '2', '3', '4']);
    container.querySelector('form')!.reset();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(control.value).toBe('');
    expect(cells(container).map((cell) => cell.textContent)).toEqual(['', '', '', '']);
  });
});

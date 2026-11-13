import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import { Textarea } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="textarea"][data-part="${name}"]`);

describe('Textarea', () => {
  it('renders the contract anatomy with every part in order', () => {
    const { container } = render(Textarea, {
      props: {
        label: 'Description',
        required: true,
        hint: 'Shown.',
        error: 'Too short.',
        maxLength: 500,
      },
      attrs: { id: 'd' },
    });
    const root = container.querySelector('.apui-textarea')!;
    expect(root.tagName).toBe('DIV');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'box',
      'hint',
      'error',
    ]);
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    expect(control.tagName).toBe('TEXTAREA');
    expect(control.getAttribute('rows')).toBe('4');
    expect(control.getAttribute('maxlength')).toBe('500');
    expect(control.getAttribute('aria-describedby')).toBe('d-hint d-error');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(root.hasAttribute('data-invalid')).toBe(true);
    expect(partOf(container, 'required')!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf(container, 'count')!.textContent).toBe('0 / 500');
    expect(partOf(container, 'count')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders no counter without maxLength', () => {
    const { container } = render(Textarea, { props: { label: 'Notes' } });
    expect(partOf(container, 'count')).toBeNull();
    expect(container.querySelector('[aria-live]')).toBeNull();
    expect(partOf(container, 'control')!.hasAttribute('maxlength')).toBe(false);
  });

  it('flags autoResize, disabled and readonly on the root and control', () => {
    const { container } = render(Textarea, {
      props: { label: 'Notes', autoResize: true, disabled: true, readonly: true, rows: 2 },
    });
    const root = container.querySelector('.apui-textarea')!;
    expect(root.hasAttribute('data-auto-resize')).toBe(true);
    expect(root.hasAttribute('data-disabled')).toBe(true);
    expect(root.hasAttribute('data-readonly')).toBe(true);
    const control = partOf(container, 'control')!;
    expect(control.hasAttribute('disabled')).toBe(true);
    expect(control.hasAttribute('readonly')).toBe(true);
    expect(control.getAttribute('rows')).toBe('2');
  });

  it('emits update:modelValue and updates the counter as people type', async () => {
    const { container, emitted } = render(Textarea, { props: { label: 'Notes', maxLength: 100 } });
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    await fireEvent.update(control, 'Hello');
    expect(emitted()['update:modelValue']).toEqual([['Hello']]);
    expect(partOf(container, 'count')!.textContent).toBe('5 / 100');
  });

  it('announces the characters left only near the limit', async () => {
    const { container } = render(Textarea, {
      props: { label: 'Notes', maxLength: 50, remainingLabel: 'Restan {count}' },
    });
    const live = container.querySelector('[aria-live="polite"]')!;
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    await fireEvent.update(control, 'a'.repeat(39));
    expect(live.textContent).toBe('');
    await fireEvent.update(control, 'a'.repeat(40));
    expect(live.textContent).toBe('Restan 10');
    await fireEvent.update(control, 'a'.repeat(50));
    expect(live.textContent).toBe('Restan 0');
  });

  it('uses 10% of a long limit as the threshold', async () => {
    const { container } = render(Textarea, { props: { label: 'Notes', maxLength: 500 } });
    const live = container.querySelector('[aria-live="polite"]')!;
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    await fireEvent.update(control, 'a'.repeat(449));
    expect(live.textContent).toBe('');
    await fireEvent.update(control, 'a'.repeat(450));
    expect(live.textContent).toBe('Characters left: 50');
  });

  it('sends class to the root and other attributes to the control', () => {
    const { container } = render(Textarea, {
      props: { label: 'Notes', classes: { root: 'r', control: 'c' } },
      attrs: { class: 'mine', name: 'notes' },
    });
    const root = container.querySelector('.apui-textarea')!;
    expect(root.classList.contains('mine')).toBe(true);
    expect(root.classList.contains('r')).toBe(true);
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('name')).toBe('notes');
    expect(control.classList.contains('c')).toBe(true);
  });

  it('resyncs the counter of an uncontrolled textarea when its form resets', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () => h('form', [h(Textarea, { label: 'Notes', maxLength: 20 })]),
      }),
    );
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    await fireEvent.update(control, 'abcdefgh');
    expect(partOf(container, 'count')!.textContent).toContain('8 / 20');
    container.querySelector('form')!.reset();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(control.value).toBe('');
    expect(partOf(container, 'count')!.textContent).toContain('0 / 20');
  });
});

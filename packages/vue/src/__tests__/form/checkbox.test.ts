import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Checkbox } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="checkbox"][data-part="${name}"]`);

const rootOf = (container: Element) => container.querySelector('.apui-checkbox')!;

describe('Checkbox', () => {
  it('renders the root, box, control, indicator and label', () => {
    const { container } = render(Checkbox, { props: { label: 'Email me' } });
    expect(rootOf(container).getAttribute('data-state')).toBe('unchecked');
    const control = screen.getByLabelText('Email me') as HTMLInputElement;
    expect(control.type).toBe('checkbox');
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.checked).toBe(false);
    const box = partOf(container, 'box')!;
    expect(box.tagName).toBe('SPAN');
    expect([...box.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'control',
      'indicator',
    ]);
    expect(partOf(container, 'indicator')!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe(control.id);
    expect(partOf(container, 'label')!.textContent).toBe('Email me');
  });

  it('renders the checked state', () => {
    const { container } = render(Checkbox, { props: { label: 'Email me', checked: true } });
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
    expect((partOf(container, 'control') as HTMLInputElement).checked).toBe(true);
  });

  it('supports v-model:checked', async () => {
    const checked = ref(false);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(Checkbox, {
            label: 'Email me',
            checked: checked.value,
            'onUpdate:checked': (next: boolean) => (checked.value = next),
          }),
      }),
    );
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.click(control);
    expect(checked.value).toBe(true);
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
    checked.value = false;
    await nextTick();
    expect(control.checked).toBe(false);
    expect(rootOf(container).getAttribute('data-state')).toBe('unchecked');
  });

  it('emits update:checked and tracks its own state when uncontrolled', async () => {
    const { container, emitted } = render(Checkbox, { props: { label: 'Email me' } });
    await fireEvent.click(partOf(container, 'control')!);
    expect(emitted()['update:checked']).toEqual([[true]]);
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
  });

  it('sets the native indeterminate property and data-state', async () => {
    const indeterminate = ref(true);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(Checkbox, { label: 'Select all', checked: true, indeterminate: indeterminate.value }),
      }),
    );
    await nextTick();
    const control = partOf(container, 'control') as HTMLInputElement;
    expect(control.indeterminate).toBe(true);
    expect(rootOf(container).getAttribute('data-state')).toBe('indeterminate');
    indeterminate.value = false;
    await nextTick();
    expect(control.indeterminate).toBe(false);
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
  });

  it('keeps indeterminate after a toggle until the owner clears it', async () => {
    const { container } = render(Checkbox, { props: { label: 'All', indeterminate: true } });
    await nextTick();
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.click(control);
    expect(control.indeterminate).toBe(true);
    expect(rootOf(container).getAttribute('data-state')).toBe('indeterminate');
  });

  it('links description and error and marks it invalid', () => {
    const { container } = render(Checkbox, {
      props: { label: 'Terms', description: 'At most once a day.', error: 'Required.' },
      attrs: { id: 'terms' },
    });
    expect(rootOf(container).getAttribute('data-invalid')).toBe('');
    const control = partOf(container, 'control')!;
    expect(control.id).toBe('terms');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('aria-describedby')).toBe('terms-description terms-error');
    expect(partOf(container, 'description')!.id).toBe('terms-description');
    const error = partOf(container, 'error')!;
    expect(error.id).toBe('terms-error');
    expect(error.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(error.textContent).toBe('Required.');
  });

  it('marks it invalid without a message', () => {
    const { container } = render(Checkbox, { props: { label: 'Terms', invalid: true } });
    expect(rootOf(container).getAttribute('data-invalid')).toBe('');
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('true');
    expect(partOf(container, 'control')!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('sets required without a visual mark', () => {
    const { container } = render(Checkbox, { props: { label: 'Terms', required: true } });
    expect(partOf(container, 'control')!.hasAttribute('required')).toBe(true);
    expect(container.querySelector('[data-part="required"]')).toBeNull();
    expect(partOf(container, 'label')!.textContent).toBe('Terms');
  });

  it('disables the control', () => {
    const { container } = render(Checkbox, { props: { label: 'Terms', disabled: true } });
    expect(rootOf(container).getAttribute('data-disabled')).toBe('');
    expect((partOf(container, 'control') as HTMLInputElement).disabled).toBe(true);
  });

  it('routes class to the root and every other attribute to the control', () => {
    const { container } = render(Checkbox, {
      props: { label: 'Terms', classes: { root: 'r', box: 'b', label: 'l' } },
      attrs: { class: 'extra', name: 'terms', value: 'yes', 'data-testid': 'field' },
    });
    expect(rootOf(container).className).toBe('apui-checkbox extra r');
    const control = screen.getByTestId('field') as HTMLInputElement;
    expect(control.name).toBe('terms');
    expect(control.value).toBe('yes');
    expect(partOf(container, 'box')!.className).toBe('b');
    expect(partOf(container, 'label')!.className).toBe('l');
  });

  it('omits label, description and error when not set', () => {
    const { container } = render(Checkbox, { attrs: { 'aria-label': 'Select row' } });
    for (const name of ['label', 'description', 'error']) {
      expect(partOf(container, name)).toBeNull();
    }
  });

  it('renders both glyphs in the indicator, check then minus', () => {
    const { container } = render(Checkbox, { props: { label: 'All', indeterminate: true } });
    const svgs = [...partOf(container, 'indicator')!.children];
    expect(svgs.map((svg) => [svg.tagName.toLowerCase(), svg.getAttribute('data-icon')])).toEqual([
      ['svg', 'check'],
      ['svg', 'minus'],
    ]);
    expect(svgs.every((svg) => svg.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it('resyncs an uncontrolled checkbox when its form resets', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () => h('form', [h(Checkbox, { label: 'Terms' })]),
      }),
    );
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.click(control);
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
    container.querySelector('form')!.reset();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(control.checked).toBe(false);
    expect(rootOf(container).getAttribute('data-state')).toBe('unchecked');
  });

  it('keeps a consumer aria-invalid unless it is invalid', () => {
    const { container, unmount } = render(Checkbox, {
      props: { label: 'Terms' },
      attrs: { 'aria-invalid': 'grammar' },
    });
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('grammar');
    unmount();
    const second = render(Checkbox, {
      props: { label: 'Terms', invalid: true },
      attrs: { 'aria-invalid': 'grammar' },
    });
    expect(partOf(second.container, 'control')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('resyncs after a native reset button click', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h('form', [h(Checkbox, { label: 'Terms' }), h('button', { type: 'reset' }, 'Reset')]),
      }),
    );
    const control = partOf(container, 'control') as HTMLInputElement;
    await fireEvent.click(control);
    expect(rootOf(container).getAttribute('data-state')).toBe('checked');
    await fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    expect(control.checked).toBe(false);
    expect(rootOf(container).getAttribute('data-state')).toBe('unchecked');
  });
});

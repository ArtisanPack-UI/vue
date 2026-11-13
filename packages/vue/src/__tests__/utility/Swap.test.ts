import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import { Swap } from '../../components/utility';

const afterReset = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

const part = (root: ParentNode, name: string) =>
  root.querySelector<HTMLElement>(`[data-scope="swap"][data-part="${name}"]`);

describe('Swap', () => {
  it('renders a named checkbox over the on and off contents', () => {
    const { container } = render(Swap, { props: { label: 'Dark mode' } });
    const root = container.querySelector<HTMLElement>('.apui-swap')!;
    expect(root.tagName).toBe('LABEL');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-transition')).toBe('fade');
    expect(root.getAttribute('data-state')).toBe('unchecked');
    const control = screen.getByRole('checkbox', { name: 'Dark mode' }) as HTMLInputElement;
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.checked).toBe(false);
    expect(part(root, 'on')!.getAttribute('aria-hidden')).toBe('true');
    expect(part(root, 'on')!.querySelector('svg')).not.toBeNull();
    expect(part(root, 'off')!.querySelector('svg')).not.toBeNull();
  });

  it('toggles and emits update:checked', async () => {
    const { container, emitted } = render(Swap, { props: { label: 'Dark mode' } });
    await fireEvent.click(screen.getByRole('checkbox'));
    expect(emitted()['update:checked']).toEqual([[true]]);
    expect(container.querySelector('.apui-swap')!.getAttribute('data-state')).toBe('checked');
  });

  it('follows the checked prop', async () => {
    const { rerender } = render(Swap, { props: { label: 'Dark mode', checked: true } });
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    await rerender({ label: 'Dark mode', checked: false });
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
  });

  it('goes back to its initial state when its form resets', async () => {
    for (const initial of [false, true]) {
      const Host = defineComponent({
        setup: () => () => h('form', [h(Swap, { label: 'Dark mode', checked: initial })]),
      });
      const { container, unmount } = render(Host);
      const box = screen.getByRole('checkbox') as HTMLInputElement;
      const root = container.querySelector('.apui-swap')!;
      await fireEvent.click(box);
      expect(box.checked).toBe(!initial);
      expect(root.getAttribute('data-state')).toBe(initial ? 'unchecked' : 'checked');
      container.querySelector('form')!.reset();
      await afterReset();
      expect(box.checked).toBe(initial);
      expect(root.getAttribute('data-state')).toBe(initial ? 'checked' : 'unchecked');
      unmount();
    }
  });

  it('stays as it is when a later listener cancels the form reset', async () => {
    const Host = defineComponent({
      setup: () => () => h('form', [h(Swap, { label: 'Dark mode' })]),
    });
    const { container } = render(Host);
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    const form = container.querySelector('form')!;
    // Added after Swap's own listener, so it runs after it.
    form.addEventListener('reset', (event) => event.preventDefault());
    await fireEvent.click(box);
    form.reset();
    await afterReset();
    expect(box.checked).toBe(true);
    expect(container.querySelector('.apui-swap')!.getAttribute('data-state')).toBe('checked');
  });

  it('puts attributes on the checkbox and class on the root', () => {
    const { container } = render(Swap, {
      props: { label: 'Dark mode', disabled: true, size: 'lg', transition: 'rotate' },
      attrs: { class: 'ms-2', name: 'dark' },
    });
    const root = container.querySelector<HTMLElement>('.apui-swap')!;
    expect(root.classList.contains('ms-2')).toBe(true);
    expect(root.hasAttribute('data-disabled')).toBe(true);
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.getAttribute('data-transition')).toBe('rotate');
    const control = screen.getByRole('checkbox') as HTMLInputElement;
    expect(control.getAttribute('name')).toBe('dark');
    expect(control.disabled).toBe(true);
  });

  it('renders the on and off slots in place of the icons', () => {
    const { container } = render(Swap, {
      props: { label: 'Menu' },
      slots: { on: '<b>On</b>', off: '<i>Off</i>' },
    });
    expect(part(container, 'on')!.querySelector('b')).not.toBeNull();
    expect(part(container, 'off')!.querySelector('i')).not.toBeNull();
  });
});

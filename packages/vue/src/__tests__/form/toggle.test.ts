import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { Toggle } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="toggle"][data-part="${name}"]`);

describe('Toggle', () => {
  it('renders a native switch in the checkbox anatomy', () => {
    const { container } = render(Toggle, {
      props: { label: 'Dark mode', description: 'Follows the system.', error: 'Nope' },
      attrs: { id: 't' },
    });
    const root = container.querySelector('.apui-toggle')!;
    expect(root.getAttribute('data-state')).toBe('unchecked');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'track',
      'label',
      'description',
      'error',
    ]);
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('type')).toBe('checkbox');
    expect(control.getAttribute('role')).toBe('switch');
    expect(control.getAttribute('aria-describedby')).toBe('t-description t-error');
    expect(partOf(container, 'thumb')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('emits update:checked and updates data-state', async () => {
    const { container, emitted } = render(Toggle, { props: { label: 'Dark mode' } });
    await fireEvent.click(partOf(container, 'control')!);
    expect(emitted()['update:checked']).toEqual([[true]]);
    expect(container.querySelector('.apui-toggle')!.getAttribute('data-state')).toBe('checked');
  });

  it('follows the checked prop', async () => {
    const { container, rerender } = render(Toggle, { props: { label: 'A', checked: true } });
    expect((partOf(container, 'control') as HTMLInputElement).checked).toBe(true);
    await rerender({ checked: false });
    expect(container.querySelector('.apui-toggle')!.getAttribute('data-state')).toBe('unchecked');
  });

  it('flags color, size, disabled and invalid', () => {
    const { container } = render(Toggle, {
      props: { label: 'A', color: 'success', size: 'lg', disabled: true, invalid: true },
    });
    const root = container.querySelector('.apui-toggle')!;
    expect(root.getAttribute('data-color')).toBe('success');
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.hasAttribute('data-disabled')).toBe(true);
    expect(partOf(container, 'control')!.getAttribute('aria-invalid')).toBe('true');
  });
});

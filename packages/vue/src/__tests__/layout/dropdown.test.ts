import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Dropdown, DropdownItem } from '../../components/layout';

const partOf = (name: string) =>
  document.body.querySelector<HTMLElement>(`[data-scope="dropdown-menu"][data-part="${name}"]`);
const panel = () => document.body.querySelector<HTMLElement>('.apui-dropdown-menu')!;
const trigger = () => partOf('trigger')!;

/** Lets the machine's effects run (focus, dismissal listeners). */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Dropdown (deprecated alias of DropdownMenu)', () => {
  it('warns once per component in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(Dropdown, { slots: { default: () => h(DropdownItem, () => 'One') } });
    render(Dropdown, { slots: { default: () => h(DropdownItem, () => 'Two') } });
    const messages = warn.mock.calls.map(([message]) => String(message));
    expect(messages.filter((m) => m.includes('Dropdown is deprecated'))).toHaveLength(1);
    expect(messages.filter((m) => m.includes('DropdownItem is deprecated'))).toHaveLength(1);
    warn.mockRestore();
  });

  it('renders the design-system DropdownMenu, with no DaisyUI markup', () => {
    render(Dropdown);
    const button = screen.getByRole('button', { name: 'Options' });
    expect(button).toBe(trigger());
    expect(button.classList.contains('apui-button')).toBe(true);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel().getAttribute('role')).toBe('menu');
    expect(document.body.querySelector('.dropdown, .dropdown-content, .btn')).toBeNull();
  });

  it('maps label and the trigger slot to the trigger content', () => {
    const labelled = render(Dropdown, { props: { label: 'Menu' } });
    expect(screen.getByRole('button', { name: 'Menu' })).toBeTruthy();
    labelled.unmount();
    render(Dropdown, { slots: { trigger: 'Actions' } });
    expect(screen.getByRole('button', { name: 'Actions' })).toBeTruthy();
  });

  it('maps end to align="end" and consumes top and hover', () => {
    render(Dropdown, { props: { end: true, top: true, hover: true } });
    expect(panel().getAttribute('data-align')).toBe('end');
    expect(panel().hasAttribute('top')).toBe(false);
    expect(panel().hasAttribute('hover')).toBe(false);
  });

  it('passes DropdownMenu props through', () => {
    render(Dropdown, { attrs: { surface: 'glass' } });
    expect(panel().getAttribute('data-surface')).toBe('glass');
  });

  it('opens from the trigger without v-model and reports it', async () => {
    const { emitted } = render(Dropdown, {
      slots: { default: () => h(DropdownItem, () => 'Edit') },
    });
    await fireEvent.click(trigger());
    await settle();
    expect(emitted('update:open')).toEqual([[true]]);
    expect(panel().hidden).toBe(false);
  });

  it('follows v-model:open', async () => {
    const open = ref(true);
    render(
      defineComponent({
        setup: () => () =>
          h(Dropdown, { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, () =>
            h(DropdownItem, () => 'Edit'),
          ),
      }),
    );
    await settle();
    expect(panel().hidden).toBe(false);
    open.value = false;
    await settle();
    expect(panel().hidden).toBe(true);
  });
});

describe('DropdownItem (deprecated alias of DropdownMenuItem)', () => {
  it('renders a menu item and emits click when chosen', async () => {
    const onClick = vi.fn();
    render(Dropdown, {
      props: { open: true },
      slots: { default: () => h(DropdownItem, { onClick }, () => 'Edit') },
    });
    await settle();
    const item = screen.getByRole('menuitem', { name: 'Edit' });
    expect(item.getAttribute('data-scope')).toBe('dropdown-menu');
    await fireEvent.click(item);
    await settle();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reports its value through the menu select event', async () => {
    const onSelect = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h(Dropdown, { open: true }, () =>
            h(DropdownItem, { value: 'archive', onSelect }, () => 'Archive'),
          ),
      }),
    );
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
    await settle();
    expect(onSelect).toHaveBeenCalledWith('archive');
  });

  it('is disabled and emits no click when disabled', async () => {
    const onClick = vi.fn();
    render(Dropdown, {
      props: { open: true },
      slots: { default: () => h(DropdownItem, { disabled: true, onClick }, () => 'Locked') },
    });
    await settle();
    const item = screen.getByRole('menuitem', { name: 'Locked' });
    expect(item.getAttribute('aria-disabled')).toBe('true');
    await fireEvent.click(item);
    await settle();
    expect(onClick).not.toHaveBeenCalled();
  });
});

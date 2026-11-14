import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { SpotlightSearch } from '../../components/navigation';

const testItems = [
  { id: 'home', label: 'Go to Home', description: 'Navigate to the home page' },
  { id: 'settings', label: 'Open Settings', description: 'Manage your preferences' },
  { id: 'profile', label: 'View Profile', description: 'See your profile', group: 'Account' },
  { id: 'logout', label: 'Log Out', group: 'Account' },
  { id: 'disabled', label: 'Disabled Action', disabled: true },
];

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="spotlight"][data-part="${name}"]`);
const panel = () => document.body.querySelector<HTMLElement>('.apui-spotlight')!;

/** Lets the machines settle. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('SpotlightSearch (deprecated alias of Spotlight)', () => {
  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(SpotlightSearch, { props: { items: testItems } });
    render(SpotlightSearch, { props: { items: testItems } });
    const calls = warn.mock.calls.filter(([m]) => String(m).includes('SpotlightSearch'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('SpotlightSearch is deprecated; use Spotlight.');
    warn.mockRestore();
  });

  it('renders the design-system Spotlight, with no DaisyUI markup', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await settle();
    expect(panel().getAttribute('data-scope')).toBe('spotlight');
    expect(panel().getAttribute('aria-label')).toBe('Search');
    expect(document.body.querySelector('dialog, .modal, .modal-box, .kbd, .input')).toBeNull();
    expect((partOf('query') as HTMLInputElement).placeholder).toBe('Search…');
  });

  it('maps ariaLabel, placeholder and className', async () => {
    render(SpotlightSearch, {
      props: {
        items: testItems,
        open: true,
        ariaLabel: 'Commands',
        placeholder: 'Type a command',
        className: 'my-palette',
      },
    });
    await settle();
    expect(panel().getAttribute('aria-label')).toBe('Commands');
    expect(panel().classList.contains('my-palette')).toBe(true);
    expect((partOf('query') as HTMLInputElement).placeholder).toBe('Type a command');
  });

  it('groups items by their group, ungrouped first, with id as the value', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await settle();
    const values = [...document.body.querySelectorAll('[data-part="item"]')].map((el) =>
      el.getAttribute('data-value'),
    );
    expect(values).toEqual(['home', 'settings', 'disabled', 'profile', 'logout']);
    expect(screen.getByRole('group', { name: 'Account' })).toBeTruthy();
    expect(
      document.body.querySelector('[data-value="disabled"]')!.hasAttribute('data-disabled'),
    ).toBe(true);
  });

  it('emits select with the 2.x item and closes', async () => {
    const open = ref(true);
    const selected: unknown[] = [];
    render(
      defineComponent({
        setup: () => () =>
          h(SpotlightSearch, {
            items: testItems,
            open: open.value,
            'onUpdate:open': (value: boolean) => (open.value = value),
            onSelect: (item: unknown) => selected.push(item),
          }),
      }),
    );
    await settle();
    await fireEvent.click(document.body.querySelector('[data-value="profile"]')!);
    await settle();
    expect(selected).toEqual([testItems[2]]);
    expect(open.value).toBe(false);
  });

  it('toggles with Ctrl+K', async () => {
    const { emitted } = render(SpotlightSearch, { props: { items: testItems } });
    await settle();
    await fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(emitted('update:open')!.at(-1)).toEqual([true]);
  });
});

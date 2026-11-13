/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, type PropType, ref } from 'vue';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuEntry,
} from '../../components/layout';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="dropdown-menu"][data-part="${name}"]`);

const partsOf = (name: string, root: ParentNode = document.body) => [
  ...root.querySelectorAll<HTMLElement>(`[data-scope="dropdown-menu"][data-part="${name}"]`),
];

const panel = () => document.body.querySelector<HTMLElement>('.apui-dropdown-menu')!;
const trigger = () => partOf('trigger')!;

/** Lets the machine's effects run (focus, highlight, dismissal listeners). */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

const ITEMS: DropdownMenuEntry[] = [
  {
    type: 'group',
    label: 'Listing',
    items: [
      { value: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' },
      { value: 'duplicate', label: 'Duplicate', icon: 'copy' },
      { value: 'archive', label: 'Archive', disabled: true },
    ],
  },
  { type: 'separator' },
  { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
  { type: 'separator' },
  { value: 'delete', label: 'Delete', icon: 'trash', color: 'error' },
];

/** The same menu as `ITEMS`, by composition. */
const Composed = defineComponent({
  props: {
    onSelectItem: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        DropdownMenu,
        { label: 'Options', open: true, portal: false },
        {
          default: () => [
            h(DropdownMenuGroup, { label: 'Listing' }, () => [
              h(
                DropdownMenuItem,
                { value: 'edit', icon: 'pencil', shortcut: 'E', onSelect: props.onSelectItem },
                () => 'Edit',
              ),
              h(DropdownMenuItem, { value: 'duplicate', icon: 'copy' }, () => 'Duplicate'),
              h(DropdownMenuItem, { value: 'archive', disabled: true }, () => 'Archive'),
            ]),
            h(DropdownMenuSeparator),
            h(
              DropdownMenuItem,
              { type: 'checkbox', value: 'grid', checked: true },
              () => 'Show grid',
            ),
            h(DropdownMenuSeparator),
            h(DropdownMenuItem, { value: 'delete', icon: 'trash', color: 'error' }, () => 'Delete'),
          ],
        },
      );
  },
});

/** The markup without generated ids or Vue's comment anchors, for comparing two renders. */
const withoutIds = (html: string) =>
  html
    .replace(/<!--.*?-->/g, '')
    .replace(/\s(id|for|aria-labelledby|aria-controls|htmlfor)="[^"]*"/g, '');

/** A parent that binds `v-model:open` and records the events. */
function bound(items: DropdownMenuEntry[] = ITEMS) {
  const open = ref(false);
  const onSelect = vi.fn();
  const onCheckedChange = vi.fn();
  const Host = defineComponent({
    setup: () => () =>
      h(DropdownMenu, {
        label: 'Options',
        items,
        open: open.value,
        'onUpdate:open': (value: boolean) => (open.value = value),
        onSelect,
        onCheckedChange,
      }),
  });
  return { open, onSelect, onCheckedChange, ...render(Host) };
}

describe('DropdownMenu', () => {
  it('renders an outline neutral trigger and the closed panel', () => {
    render(DropdownMenu, { props: { label: 'Options', items: ITEMS } });
    const button = screen.getByRole('button', { name: 'Options' });
    expect(button).toBe(trigger());
    expect(button.classList.contains('apui-button')).toBe(true);
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-color')).toBe('neutral');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(panel().getAttribute('role')).toBe('menu');
    expect(panel().getAttribute('data-part')).toBe('content');
    expect(panel().hidden).toBe(true);
    expect(panel().getAttribute('data-align')).toBe('start');
    expect(panel().getAttribute('data-surface')).toBe('overlay');
  });

  it('emits align and surface on the panel', () => {
    render(DropdownMenu, { props: { label: 'L', align: 'end', surface: 'glass' } });
    expect(panel().getAttribute('data-align')).toBe('end');
    expect(panel().getAttribute('data-surface')).toBe('glass');
  });

  it('teleports the panel to the body unless portal is off', () => {
    const teleported = render(DropdownMenu, { props: { label: 'L' } });
    expect(teleported.container.querySelector('.apui-dropdown-menu')).toBeNull();
    teleported.unmount();
    const inPlace = render(DropdownMenu, { props: { label: 'L', portal: false } });
    expect(inPlace.container.querySelector('.apui-dropdown-menu')).not.toBeNull();
  });

  it('renders items, groups, separators and their parts', () => {
    render(DropdownMenu, { props: { label: 'Options', items: ITEMS, open: true } });
    const items = screen.getAllByRole('menuitem', { hidden: true });
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'EditE',
      'Duplicate',
      'Archive',
      'Delete',
    ]);
    expect(items[2]!.getAttribute('aria-disabled')).toBe('true');
    expect(items[3]!.getAttribute('data-color')).toBe('error');
    expect(partOf('shortcut')!.tagName).toBe('KBD');
    expect(partsOf('icon')).toHaveLength(3);
    expect(partsOf('separator').every((el) => el.tagName === 'HR')).toBe(true);

    const group = partOf('item-group')!;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-labelledby')).toBe(partOf('item-group-label')!.id);

    const option = screen.getByRole('menuitemcheckbox', { hidden: true });
    expect(option.getAttribute('aria-checked')).toBe('true');
    expect(partOf('item-indicator', option)!.hidden).toBe(false);
  });

  it('renders the same markup from items as from composition', () => {
    const fromItems = render(DropdownMenu, {
      props: { label: 'Options', items: ITEMS, open: true, portal: false },
    });
    const itemsHtml = withoutIds(fromItems.container.innerHTML);
    fromItems.unmount();
    const composed = render(Composed);
    expect(withoutIds(composed.container.innerHTML)).toBe(itemsHtml);
  });

  it('opens from the trigger and reports it, even without v-model', async () => {
    const { emitted } = render(DropdownMenu, { props: { label: 'Options', items: ITEMS } });
    await fireEvent.click(trigger());
    await settle();
    expect(emitted('update:open')).toEqual([[true]]);
    expect(panel().hidden).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('opens on ArrowDown, moves past disabled items and chooses with Enter', async () => {
    const { open, onSelect } = bound();
    trigger().focus();
    await fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    await settle();
    expect(open.value).toBe(true);
    const highlighted = () => panel().querySelector('[data-highlighted]')?.textContent?.trim();
    await vi.waitFor(() => expect(highlighted()).toBe('EditE'));

    await fireEvent.keyDown(panel(), { key: 'ArrowDown' });
    expect(highlighted()).toBe('Duplicate');
    await fireEvent.keyDown(panel(), { key: 'ArrowDown' });
    expect(highlighted()).toBe('Show grid');

    await fireEvent.keyDown(panel(), { key: 'End' });
    expect(highlighted()).toBe('Delete');
    await fireEvent.keyDown(panel(), { key: 'Home' });
    expect(highlighted()).toBe('EditE');

    await fireEvent.keyDown(panel(), { key: 'Enter' });
    await settle();
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(open.value).toBe(false);
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger()));
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { open } = bound();
    trigger().focus();
    await fireEvent.click(trigger());
    await settle();
    expect(open.value).toBe(true);
    await fireEvent.keyDown(panel(), { key: 'Escape' });
    await settle();
    expect(open.value).toBe(false);
    expect(panel().hidden).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger()));
  });

  it('stays open when the parent vetoes the change', async () => {
    const onUpdate = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h(DropdownMenu, {
            label: 'Options',
            items: ITEMS,
            open: true,
            'onUpdate:open': onUpdate,
          }),
      }),
    );
    await settle();
    await fireEvent.keyDown(panel(), { key: 'Escape' });
    await settle();
    expect(onUpdate).toHaveBeenCalledWith(false);
    expect(panel().hidden).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps a static :open="true" open after a choice', async () => {
    const { emitted } = render(DropdownMenu, {
      props: { label: 'Options', items: ITEMS, open: true },
    });
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    await settle();
    expect(emitted('select')).toEqual([['duplicate']]);
    expect(emitted('update:open')).toEqual([[false]]);
    expect(panel().hidden).toBe(false);
  });

  it('routes callbacks to an item under its new value', async () => {
    const value = ref('draft');
    const onItemSelect = vi.fn();
    const onSelect = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h(DropdownMenu, { label: 'Options', open: true, onSelect }, () => [
            h(DropdownMenuItem, { value: value.value, onSelect: onItemSelect }, () => 'Save'),
          ]),
      }),
    );
    await settle();
    value.value = 'publish';
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Save' }));
    await settle();
    expect(onSelect).toHaveBeenCalledWith('publish');
    expect(onItemSelect).toHaveBeenCalledWith('publish');
  });

  it('emits select from the menu and the item when an action item is clicked', async () => {
    const onSelectItem = vi.fn();
    render(Composed, { props: { onSelectItem } });
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: /Edit/ }));
    await settle();
    expect(onSelectItem).toHaveBeenCalledWith('edit');
  });

  it("doesn't choose a disabled item", async () => {
    const { onSelect } = bound();
    await fireEvent.click(trigger());
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
    await settle();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reports checked-change for checkbox items, not select, and leaves checked to the owner', async () => {
    const { onSelect, onCheckedChange } = bound();
    await fireEvent.click(trigger());
    await settle();
    await fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Show grid' }));
    await settle();
    expect(onCheckedChange).toHaveBeenCalledWith({ value: 'grid', checked: false });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('reports radio items as checked', async () => {
    const onCheckedChange = vi.fn();
    const onItemCheckedChange = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h(DropdownMenu, { label: 'Sort', open: true, onCheckedChange }, () => [
            h(DropdownMenuItem, { type: 'radio', value: 'newest', checked: true }, () => 'Newest'),
            h(
              DropdownMenuItem,
              { type: 'radio', value: 'price', onCheckedChange: onItemCheckedChange },
              () => 'Price',
            ),
          ]),
      }),
    );
    await settle();
    const radios = screen.getAllByRole('menuitemradio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    await fireEvent.click(radios[1]!);
    await settle();
    expect(onCheckedChange).toHaveBeenCalledWith({ value: 'price', checked: true });
    expect(onItemCheckedChange).toHaveBeenCalledWith({ value: 'price', checked: true });
  });

  it('runs an item click handler when the item is chosen', async () => {
    const onClick = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h(DropdownMenu, { label: 'Options', open: true }, () => [
            h(DropdownMenuItem, { value: 'edit', onClick }, () => 'Edit'),
          ]),
      }),
    );
    await settle();
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('takes the label slot and classes per part', () => {
    render(DropdownMenu, {
      props: {
        open: true,
        items: ITEMS,
        classes: { root: 'my-root', trigger: 'my-trigger', item: 'my-item', separator: 'my-sep' },
      },
      slots: { label: '<strong>More</strong>' },
      attrs: { class: 'extra' },
    });
    expect(trigger().querySelector('strong')!.textContent).toBe('More');
    expect(trigger().classList.contains('my-trigger')).toBe(true);
    expect(panel().classList.contains('my-root')).toBe(true);
    expect(panel().classList.contains('extra')).toBe(true);
    expect(partsOf('item').every((el) => el.classList.contains('my-item'))).toBe(true);
    expect(partOf('separator')!.classList.contains('my-sep')).toBe(true);
  });

  it('requires its children to be inside a DropdownMenu', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => render(DropdownMenuItem, { props: { value: 'edit' } })).toThrow(
      /must be inside a DropdownMenu/,
    );
    warn.mockRestore();
  });
});

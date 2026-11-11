import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import { Spotlight, type SpotlightGroup } from '../../components/navigation';

// jsdom has no CSS.escape; the combobox machine finds the active option with it.
if (typeof globalThis.CSS?.escape !== 'function') {
  (globalThis as { CSS?: object }).CSS = {
    ...(globalThis.CSS ?? {}),
    escape: (value: string) => value.replace(/[^\w-]/g, (c) => `\\${c}`),
  };
}

const groups: SpotlightGroup[] = [
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { label: 'Reports', href: '#reports', icon: 'file-text', description: 'Monthly' },
      {
        value: 'settings',
        label: 'Settings',
        icon: 'settings',
        color: 'primary',
        keywords: ['preferences'],
      },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', shortcut: '⌘ N' },
      { value: 'archive', label: 'Archive', disabled: true },
    ],
  },
];

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="spotlight"][data-part="${name}"]`);
const panel = () => document.body.querySelector<HTMLElement>('.apui-spotlight')!;
const query = () => partOf('query') as HTMLInputElement;
const shown = () =>
  [...document.body.querySelectorAll('[data-part="item"]:not([hidden])')].map((el) =>
    el.getAttribute('data-value'),
  );

/** Lets the machines settle. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

async function typeQuery(text: string) {
  await fireEvent.update(query(), text);
  await settle();
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});

describe('Spotlight', () => {
  it('renders every part on the server with portal off', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Spotlight, { open: true, portal: false, modal: false, trigger: 'Search', groups }),
      }),
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    for (const name of [
      'trigger',
      'backdrop',
      'positioner',
      'content',
      'search',
      'icon',
      'query',
      'close-trigger',
      'results',
      'item-group',
      'item-group-label',
      'item',
      'tile',
      'item-text',
      'item-description',
      'shortcut',
      'item-indicator',
      'empty',
      'loading',
      'footer',
    ]) {
      expect(partOf(name, host), name).not.toBeNull();
    }
  });

  it('renders a named dialog holding a combobox and a listbox of groups', async () => {
    render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    const root = panel();
    expect(root.getAttribute('data-part')).toBe('content');
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.getAttribute('aria-modal')).toBe('true');
    expect(root.getAttribute('aria-label')).toBe('Search');
    // The combobox's results announcements live in the panel too; parts only.
    expect(
      [...root.children]
        .filter((el) => el.hasAttribute('data-part'))
        .map((el) => el.getAttribute('data-part')),
    ).toEqual(['search', 'results', 'footer']);
    expect(query().getAttribute('role')).toBe('combobox');
    expect(query().getAttribute('aria-keyshortcuts')).toBe('Meta+K Control+K');
    expect(query().getAttribute('aria-controls')).toBe(partOf('results')!.id);
    expect(partOf('results')!.getAttribute('role')).toBe('listbox');
    expect(screen.getByRole('group', { name: 'Pages' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Esc, Close' }).textContent?.trim()).toBe('Esc');
  });

  it('renders items: link, tile, description, color, shortcut keys and disabled', async () => {
    render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    const link = document.querySelector('[data-value="#reports"]')!;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#reports');
    expect(link.getAttribute('role')).toBe('option');
    expect(partOf('tile', link)!.querySelector('svg')).not.toBeNull();
    expect(partOf('item-description', link)!.textContent).toBe('Monthly');
    expect(document.querySelector('[data-value="settings"]')!.getAttribute('data-color')).toBe(
      'primary',
    );
    expect(
      [...document.querySelectorAll('[data-value="add"] [data-part="shortcut"] kbd')].map(
        (kbd) => kbd.textContent,
      ),
    ).toEqual(['⌘', 'N']);
    expect(document.querySelector('[data-value="archive"]')!.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('filters by every word and shows the empty state, emitting search-change', async () => {
    const { emitted } = render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    await typeQuery('prefer');
    expect(shown()).toEqual(['settings']);
    expect(document.querySelectorAll('[data-part="item-group"]')).toHaveLength(1);
    expect(emitted('search-change')!.at(-1)).toEqual(['prefer']);
    await typeQuery('zzz');
    expect(shown()).toEqual([]);
    expect(partOf('empty')!.hidden).toBe(false);
  });

  it('leaves results unfiltered with remote, and marks them busy while loading', async () => {
    render(Spotlight, {
      props: { open: true, portal: false, groups, remote: true, loading: true },
    });
    await settle();
    await typeQuery('zzz');
    expect(shown()).toEqual(['#reports', 'settings', 'add', 'archive']);
    expect(partOf('results')!.getAttribute('aria-busy')).toBe('true');
    expect(partOf('loading')!.hidden).toBe(false);
    expect(partOf('empty')!.hidden).toBe(true);
  });

  it('opens from the trigger, which shows the shortcut keys', async () => {
    const { emitted } = render(Spotlight, { props: { portal: false, trigger: 'Search', groups } });
    await settle();
    const trigger = partOf('trigger')!;
    expect(trigger.classList.contains('apui-button')).toBe(true);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-keyshortcuts')).toBe('Meta+K Control+K');
    expect(partOf('shortcut', trigger)).not.toBeNull();
    expect(panel().hidden).toBe(true);
    await fireEvent.click(trigger);
    await settle();
    expect(emitted('update:open')!.at(-1)).toEqual([true]);
    expect(panel().hidden).toBe(false);
  });

  it('toggles with the shortcut', async () => {
    const { emitted } = render(Spotlight, { props: { portal: false, groups, shortcut: 'ctrl+k' } });
    await settle();
    await fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(emitted('update:open')!.at(-1)).toEqual([true]);
    await fireEvent.keyDown(window, { key: 'k', code: 'KeyK', ctrlKey: true });
    await settle();
    expect(emitted('update:open')!.at(-1)).toEqual([false]);
  });

  it('emits select on a click, closes, and lists the choice first next time', async () => {
    const open = ref(true);
    const selected: unknown[] = [];
    const Host = defineComponent({
      setup: () => () =>
        h('div', [
          h('button', { onClick: () => (open.value = true) }, 'Reopen'),
          h(Spotlight, {
            id: 'palette',
            recent: true,
            portal: false,
            groups,
            open: open.value,
            'onUpdate:open': (value: boolean) => (open.value = value),
            onSelect: (item: unknown) => selected.push(item),
          }),
        ]),
    });
    render(Host);
    await settle();
    await fireEvent.click(document.querySelector('[data-value="add"]')!);
    await settle();
    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({ value: 'add', label: 'Add property' });
    expect(open.value).toBe(false);
    expect(panel().hidden).toBe(true);
    await fireEvent.click(screen.getByText('Reopen'));
    await settle();
    expect(shown()[0]).toBe('recent:add');
    expect(screen.getByRole('group', { name: 'Recent' })).toBeTruthy();
  });

  it("marks the query's matches in each label, ignoring case and accents", async () => {
    render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    await typeQuery('REP');
    expect(partOf('item-text', document.querySelector('[data-value="#reports"]')!)!.innerHTML).toBe(
      '<mark>Rep</mark>orts<span data-scope="spotlight" data-part="item-description">Monthly</span>',
    );
    await typeQuery('');
    expect(document.querySelectorAll('mark')).toHaveLength(0);
  });

  it('ends every result with the Enter glyph, hidden from assistive technology', async () => {
    render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    const indicators = document.querySelectorAll(
      '[data-part="item"] > [data-part="item-indicator"]',
    );
    expect(indicators).toHaveLength(4);
    expect(indicators[0]!.getAttribute('aria-hidden')).toBe('true');
    expect(indicators[0]!.querySelector('svg')).not.toBeNull();
  });

  it('keeps no recent choices unless recent is on', async () => {
    render(Spotlight, { props: { open: true, portal: false, groups } });
    await settle();
    await fireEvent.click(document.querySelector('[data-value="add"]')!);
    await settle();
    expect(localStorage.length).toBe(0);
  });

  it('activates the first result when rendered open', async () => {
    render(Spotlight, { props: { open: true, portal: false, modal: false, groups } });
    await settle();
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await settle();
    expect(document.querySelector('[data-highlighted]')!.getAttribute('data-value')).toBe(
      '#reports',
    );
  });

  it('never renders an unsafe link: a javascript: href becomes a plain option', async () => {
    render(Spotlight, {
      props: {
        open: true,
        portal: false,
        groups: [
          {
            label: 'Links',
            items: [
              { value: 'evil', label: 'Evil', href: 'javascript:alert(1)' },
              { value: 'ok', label: 'OK', href: '/reports' },
            ],
          },
        ],
      },
    });
    await settle();
    const evil = document.querySelector('[data-value="evil"]')!;
    expect(evil.tagName).toBe('DIV');
    expect(evil.hasAttribute('href')).toBe(false);
    expect(document.querySelector('[href^="javascript"]')).toBeNull();
    expect(document.querySelector('[data-value="ok"]')!.getAttribute('href')).toBe('/reports');
  });

  it('takes translated strings as props, and the empty slot', async () => {
    render(Spotlight, {
      props: {
        open: true,
        portal: false,
        groups: [],
        label: 'Rechercher',
        placeholder: 'Rechercher…',
        loadingLabel: 'Recherche…',
        closeLabel: 'Fermer',
        navigateLabel: 'Naviguer',
        selectLabel: 'Ouvrir',
      },
      slots: { empty: 'Aucun résultat.' },
    });
    await settle();
    expect(panel().getAttribute('aria-label')).toBe('Rechercher');
    expect(query().getAttribute('placeholder')).toBe('Rechercher…');
    expect(screen.getByRole('button', { name: 'Esc, Fermer' })).toBeTruthy();
    expect(partOf('empty')!.textContent).toBe('Aucun résultat.');
    expect(partOf('loading')!.textContent).toBe('Recherche…');
    expect(partOf('footer')!.textContent).toContain('Naviguer');
    expect(partOf('footer')!.textContent).toContain('Ouvrir');
  });

  it('puts classes on their parts and class on the panel', async () => {
    render(Spotlight, {
      props: {
        open: true,
        portal: false,
        groups,
        classes: { root: 'r', results: 'res', item: 'it', footer: 'ft' },
      },
      attrs: { class: 'extra' },
    });
    await settle();
    expect(panel().className).toContain('apui-spotlight');
    expect(panel().classList.contains('r')).toBe(true);
    expect(panel().classList.contains('extra')).toBe(true);
    expect(partOf('results')!.classList.contains('res')).toBe(true);
    expect(partOf('item')!.classList.contains('it')).toBe(true);
    expect(partOf('footer')!.classList.contains('ft')).toBe(true);
  });

  it('teleports to the body by default', async () => {
    const { container } = render(Spotlight, { props: { open: true, groups } });
    await settle();
    expect(container.querySelector('.apui-spotlight')).toBeNull();
    expect(document.body.querySelector('.apui-spotlight')).not.toBeNull();
  });
});

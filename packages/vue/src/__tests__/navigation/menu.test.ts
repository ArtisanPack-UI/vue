/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, provide, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import {
  MENU_LINK_KEY,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuTitle,
  type MenuItemData,
} from '../../components/navigation';

const ITEMS: MenuItemData[] = [
  { label: 'Dashboard', href: '#dashboard', icon: 'list' },
  {
    label: 'Properties',
    icon: 'settings',
    items: [
      { label: 'All properties', href: '#properties' },
      { label: 'Lakeview Lofts', href: '#lakeview', current: true },
      { label: 'Drafts', href: '#drafts', badge: '3' },
    ],
  },
  { label: 'Analytics', icon: 'calendar', items: [{ label: 'Reports', href: '#reports' }] },
  { type: 'title', label: 'Settings' },
  { label: 'Team', href: '#team', icon: 'user' },
  { type: 'separator' },
  { label: 'Billing', href: '#billing', disabled: true },
];

const Composed = defineComponent(
  (props: { collapsible?: boolean }) => () =>
    h(Menu, { label: 'Main', collapsible: props.collapsible ?? true }, () => [
      h(MenuItem, { href: '#dashboard', icon: 'list' }, () => 'Dashboard'),
      h(MenuSub, { label: 'Properties', icon: 'settings' }, () => [
        h(MenuItem, { href: '#properties' }, () => 'All properties'),
        h(MenuItem, { href: '#lakeview', current: true }, () => 'Lakeview Lofts'),
        h(MenuItem, { href: '#drafts', badge: '3' }, () => 'Drafts'),
      ]),
      h(MenuSub, { label: 'Analytics', icon: 'calendar' }, () => [
        h(MenuItem, { href: '#reports' }, () => 'Reports'),
      ]),
      h(MenuTitle, () => 'Settings'),
      h(MenuItem, { href: '#team', icon: 'user' }, () => 'Team'),
      h(MenuSeparator),
      h(MenuItem, { href: '#billing', disabled: true }, () => 'Billing'),
    ]),
  { props: ['collapsible'] },
);

const part = (name: string) => [
  ...document.querySelectorAll<HTMLElement>(`[data-scope="menu"][data-part="${name}"]`),
];
const toggles = () => part('item').filter((el) => el.tagName === 'BUTTON');
const withoutIds = (html: string) =>
  html.replace(/ (id|aria-controls)="[^"]*"/g, '').replace(/<!--[^>]*-->/g, '');

describe('Menu', () => {
  it('renders the contract anatomy in a labelled nav', () => {
    render(Menu, { props: { label: 'Main', items: ITEMS } });
    const root = document.querySelector('nav.apui-menu')!;
    expect(root.getAttribute('aria-label')).toBe('Main');
    expect(root.hasAttribute('data-collapsible')).toBe(true);
    expect(part('list')[0]!.tagName).toBe('UL');
    for (const name of [
      'item',
      'icon',
      'item-text',
      'badge',
      'chevron',
      'sub',
      'title',
      'separator',
    ]) {
      expect(part(name).length, name).toBeGreaterThan(0);
    }
    expect(part('separator')[0]!.getAttribute('aria-hidden')).toBe('true');
    expect(part('chevron')[0]!.hasAttribute('data-mirror')).toBe(true);
  });

  it('marks the current page and opens the sub-menu holding it', () => {
    render(Menu, { props: { items: ITEMS } });
    const current = part('item').find((el) => el.getAttribute('aria-current') === 'page')!;
    expect(current.textContent).toContain('Lakeview Lofts');
    const [properties, analytics] = toggles();
    expect(properties!.getAttribute('aria-expanded')).toBe('true');
    expect(analytics!.getAttribute('aria-expanded')).toBe('false');
    const sub = document.getElementById(analytics!.getAttribute('aria-controls')!)!;
    expect(sub.hidden).toBe(true);
  });

  it('toggles a sub-menu from its button', async () => {
    render(Menu, { props: { items: ITEMS } });
    const analytics = toggles()[1]!;
    await fireEvent.click(analytics);
    expect(analytics.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(analytics.getAttribute('aria-controls')!)!.hidden).toBe(false);
    await fireEvent.click(analytics);
    expect(analytics.getAttribute('aria-expanded')).toBe('false');
  });

  it('emits update:open and follows v-model:open', async () => {
    const events: boolean[] = [];
    render(Menu, {
      slots: {
        default: () =>
          h(
            MenuSub,
            { label: 'More', open: false, 'onUpdate:open': (o: boolean) => events.push(o) },
            () => h(MenuItem, { href: '#x' }, () => 'X'),
          ),
      },
    });
    await fireEvent.click(toggles()[0]!);
    await nextTick();
    expect(events).toEqual([true]);
    expect(toggles()[0]!.getAttribute('aria-expanded')).toBe('false');
  });

  it('disables a link: no href, aria-disabled, out of the Tab order', () => {
    render(Menu, { props: { items: ITEMS } });
    const billing = part('item').find((el) => el.textContent?.includes('Billing'))!;
    expect(billing.hasAttribute('href')).toBe(false);
    expect(billing.getAttribute('aria-disabled')).toBe('true');
    expect(billing.getAttribute('tabindex')).toBe('-1');
  });

  it('renders enabled links with a provided router link component', () => {
    const RouterLink = defineComponent({
      props: { href: { type: String, required: true } },
      setup:
        (props, { slots }) =>
        () =>
          h('a', { href: props.href, 'data-router': '' }, slots.default?.()),
    });
    const Host = defineComponent({
      setup() {
        provide(MENU_LINK_KEY, RouterLink);
        return () => h(Menu, { items: ITEMS });
      },
    });
    const { container } = render(Host);
    const routed = [...container.querySelectorAll('[data-router]')];
    expect(routed.length).toBeGreaterThan(0);
    expect(routed.every((el) => el.getAttribute('data-part') === 'item')).toBe(true);
    // A disabled item stays a plain link, and a button stays a button.
    const billing = part('item').find((el) => el.textContent?.includes('Billing'))!;
    expect(billing.hasAttribute('data-router')).toBe(false);
  });

  it('shows every sub-menu with a heading item when not collapsible', () => {
    render(Menu, { props: { items: ITEMS, collapsible: false } });
    expect(toggles()).toHaveLength(0);
    expect(part('chevron')).toHaveLength(0);
    expect(part('sub').every((el) => !el.hidden)).toBe(true);
    expect(document.querySelector('.apui-menu')!.hasAttribute('data-collapsible')).toBe(false);
  });

  it('renders the same markup from items as from composition', async () => {
    const fromData = await renderToString(h(Menu, { label: 'Main', items: ITEMS }));
    expect(withoutIds(fromData)).toBe(withoutIds(await renderToString(h(Composed))));
  });

  it('applies classes per part', () => {
    render(Menu, { props: { items: ITEMS, classes: { root: 'r', item: 'i', sub: 's' } } });
    expect(document.querySelector('.apui-menu')!.classList.contains('r')).toBe(true);
    expect(part('item')[0]!.classList.contains('i')).toBe(true);
    expect(part('sub')[0]!.classList.contains('s')).toBe(true);
  });
  const reports = (current: boolean): MenuItemData[] => [
    { key: 'reports', label: 'Reports', items: [{ label: 'All', href: '/r', current }] },
  ];
  const toggleOf = (container: Element) =>
    container.querySelector<HTMLButtonElement>('button[data-part="item"]')!;

  it('toggles a sub-menu from data open on click, then closed', async () => {
    const { container } = render(Menu, {
      props: { items: [{ label: 'Reports', open: true, items: [{ label: 'All', href: '/r' }] }] },
    });
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(toggleOf(container));
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('false');
    await fireEvent.click(toggleOf(container));
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('true');
  });

  it('leaves the state its own when open is passed as undefined', async () => {
    const Host = defineComponent(
      () => () =>
        h(Menu, null, () =>
          h(MenuSub, { label: 'Reports', open: undefined }, () =>
            h(MenuItem, { href: '/r' }, () => 'All'),
          ),
        ),
    );
    const { container } = render(Host);
    await fireEvent.click(toggleOf(container));
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('true');
  });

  it('opens a sub-menu when its child becomes current, as in a persistent layout', async () => {
    const current = ref(false);
    const Host = defineComponent(() => () => h(Menu, { items: reports(current.value) }));
    const { container } = render(Host);
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('false');
    current.value = true;
    await nextTick();
    await nextTick();
    expect(toggleOf(container).getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector<HTMLElement>('[data-part="sub"]')!.hidden).toBe(false);
  });

  it('forwards a sub-menu badge and disables its toggle', () => {
    const { container } = render(Menu, {
      props: { items: [{ label: 'Reports', badge: 2, disabled: true, items: [] }] },
    });
    expect(toggleOf(container).hasAttribute('disabled')).toBe(true);
    expect(toggleOf(container).querySelector('[data-part="badge"]')?.textContent).toBe('2');
  });

  it('renders a javascript: href as a plain non-link', async () => {
    // eslint-disable-next-line no-script-url
    const html = await renderToString(
      h(Menu, { items: [{ label: 'Bad', href: 'javascript:alert(1)' }] }),
    );
    expect(html).not.toContain('javascript:');
  });
});

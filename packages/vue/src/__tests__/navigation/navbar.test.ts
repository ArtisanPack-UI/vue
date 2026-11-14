import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { Navbar, NavbarItem, type NavbarLinkData } from '../../components/navigation';

const LINKS: NavbarLinkData[] = [
  { label: 'Properties', href: '#properties', current: true },
  { label: 'Analytics', href: '#analytics' },
];

const part = (name: string) => [
  ...document.querySelectorAll<HTMLElement>(`[data-scope="navbar"][data-part="${name}"]`),
];

describe('Navbar', () => {
  it('renders the contract anatomy with its defaults', () => {
    render(Navbar, {
      props: { brand: 'Horizon', links: LINKS, search: 'Search', actions: 'Sign in' },
    });
    const root = document.querySelector('header.apui-navbar')!;
    expect(root.getAttribute('data-layout')).toBe('bar');
    expect(root.getAttribute('data-surface')).toBe('default');
    expect(root.hasAttribute('data-sticky')).toBe(true);
    expect(part('brand')[0]!.textContent).toBe('Horizon');
    expect(part('links')[0]!.tagName).toBe('NAV');
    expect(part('links')[0]!.getAttribute('aria-label')).toBe('Main');
    expect(part('link')).toHaveLength(2);
    expect(part('link')[0]!.getAttribute('aria-current')).toBe('page');
    expect(part('link')[1]!.hasAttribute('aria-current')).toBe(false);
    expect(part('search')[0]!.textContent).toBe('Search');
    expect(part('actions')[0]!.textContent).toBe('Sign in');
  });

  it('leaves out regions with nothing in them', () => {
    render(Navbar, { props: { brand: 'Horizon' } });
    expect(part('links')).toHaveLength(0);
    expect(part('search')).toHaveLength(0);
    expect(part('actions')).toHaveLength(0);
  });

  it('takes slots over props, and NavbarItem children as links', () => {
    render(Navbar, {
      props: { brand: 'Ignored', label: 'Primary' },
      slots: {
        brand: () => h('a', { href: '/' }, 'Home'),
        default: () => [h(NavbarItem, { href: '#a', current: true }, () => 'A')],
        actions: () => h('button', 'Sign in'),
      },
    });
    expect(part('brand')[0]!.querySelector('a')!.textContent).toBe('Home');
    expect(part('links')[0]!.getAttribute('aria-label')).toBe('Primary');
    expect(part('link')[0]!.getAttribute('aria-current')).toBe('page');
  });

  it('renders the same links from data as from composition', async () => {
    const fromData = await renderToString(h(Navbar, { links: LINKS }));
    const composed = await renderToString(
      h(Navbar, null, () => [
        h(NavbarItem, { href: '#properties', current: true }, () => 'Properties'),
        h(NavbarItem, { href: '#analytics' }, () => 'Analytics'),
      ]),
    );
    const strip = (html: string) => html.replace(/<!--[^>]*-->/g, '');
    expect(strip(fromData)).toBe(strip(composed));
  });

  it('emits layout, surface and sticky', () => {
    render(Navbar, { props: { layout: 'island', surface: 'glass', sticky: false, brand: 'S' } });
    const root = document.querySelector('.apui-navbar')!;
    expect(root.getAttribute('data-layout')).toBe('island');
    expect(root.getAttribute('data-surface')).toBe('glass');
    expect(root.hasAttribute('data-sticky')).toBe(false);
  });

  it('drops unsafe hrefs', () => {
    render(Navbar, { props: { links: [{ label: 'X', href: 'javascript:alert(1)' }] } });
    expect(part('link')[0]!.hasAttribute('href')).toBe(false);
  });
});

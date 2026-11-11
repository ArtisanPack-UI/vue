import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';

vi.mock('@inertiajs/vue3', () => ({
  Link: {
    name: 'InertiaLink',
    props: ['href'],
    template: '<a :href="href" data-inertia-link><slot /></a>',
  },
  usePage: () => ({ props: {} }),
}));

import InertiaMenu from '../../../components/navigation/InertiaMenu.vue';

const items = [
  { name: 'home', label: 'Home', href: '/home', active: true },
  { name: 'logout', label: 'Sign out' },
  {
    name: 'settings',
    label: 'Settings',
    children: [{ name: 'profile', label: 'Profile', href: '/settings/profile' }],
  },
  { name: 'billing', label: 'Billing', href: '/billing', disabled: true },
];

describe('InertiaMenu', () => {
  it('renders href items as Inertia Links with the menu item parts', () => {
    const { container } = render(InertiaMenu, { props: { items } });
    const links = container.querySelectorAll('[data-inertia-link]');
    expect([...links].map((link) => link.getAttribute('href'))).toEqual([
      '/home',
      '/settings/profile',
    ]);
    expect(links[0]!.getAttribute('data-scope')).toBe('menu');
    expect(links[0]!.getAttribute('data-part')).toBe('item');
  });

  it('marks the active item as the current page and opens its sub-menu', () => {
    const { container } = render(InertiaMenu, {
      props: {
        items: [
          {
            name: 'settings',
            label: 'Settings',
            children: [{ name: 'profile', label: 'Profile', href: '/p', active: true }],
          },
        ],
      },
    });
    expect(container.querySelector('[aria-current="page"]')?.textContent).toContain('Profile');
    expect(screen.getByRole('button', { name: /settings/i }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('renders items without href as buttons and disabled items without a Link', () => {
    const { container } = render(InertiaMenu, { props: { items } });
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeDefined();
    const billing = screen.getByText('Billing').closest('a')!;
    expect(billing.hasAttribute('data-inertia-link')).toBe(false);
    expect(billing.getAttribute('aria-disabled')).toBe('true');
    expect(container.querySelector('.apui-menu')).not.toBeNull();
  });

  it('emits select with the item name, but not for a disabled item', async () => {
    const { emitted } = render(InertiaMenu, { props: { items } });
    await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await fireEvent.click(screen.getByText('Billing'));
    expect(emitted().select).toEqual([['logout']]);
  });
  const nested = (active: boolean) => [
    { name: 'home', label: 'Home', href: '/', active: !active },
    {
      name: 'reports',
      label: 'Reports',
      badge: 2,
      children: [{ name: 'all', label: 'All reports', href: '/reports', active }],
    },
  ];
  const toggle = () => screen.getByRole('button', { name: /Reports/ });

  it('toggles a closed sub-menu open and closed on click', async () => {
    render(InertiaMenu, { props: { items: nested(false) } });
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await fireEvent.click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes an active sub-menu on click', async () => {
    render(InertiaMenu, { props: { items: nested(true) } });
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('opens a sub-menu when an item inside becomes active, as in a persistent layout', async () => {
    const { rerender } = render(InertiaMenu, { props: { items: nested(false) } });
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await rerender({ items: nested(true) });
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('forwards badge and disabled on parent items', () => {
    render(InertiaMenu, {
      props: { items: [{ ...nested(false)[1]!, disabled: true }] },
    });
    expect(toggle().hasAttribute('disabled')).toBe(true);
    expect(toggle().querySelector('[data-part="badge"]')?.textContent).toBe('2');
  });
});

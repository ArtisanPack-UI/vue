import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';

vi.mock('@inertiajs/vue3', () => ({
  Link: {
    name: 'InertiaLink',
    props: ['href'],
    template: '<a :href="href" data-inertia-link><slot /></a>',
  },
  usePage: () => ({ props: {} }),
}));

import InertiaBreadcrumbs from '../../../components/navigation/InertiaBreadcrumbs.vue';

const trail = [{ label: 'Home', href: '/' }, { label: 'Users', href: '/users' }, { label: 'John' }];

describe('InertiaBreadcrumbs', () => {
  it('renders the design-system Breadcrumbs, with no DaisyUI classes', () => {
    const { container } = render(InertiaBreadcrumbs, { props: { items: trail } });
    const root = container.querySelector('nav')!;
    expect(root.classList.contains('apui-breadcrumbs')).toBe(true);
    expect(root.classList.contains('breadcrumbs')).toBe(false);
    expect(root.querySelector('ol')).not.toBeNull();
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('John')).toBeDefined();
  });

  it('renders Inertia Links, with the link part, for the levels before the current page', () => {
    const { container } = render(InertiaBreadcrumbs, { props: { items: trail } });
    const links = [...container.querySelectorAll('[data-inertia-link]')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/', '/users']);
    expect(links.every((link) => link.getAttribute('data-part') === 'link')).toBe(true);
  });

  it('renders the last item as the current page, not a link', () => {
    render(InertiaBreadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Current Page', href: '/now' },
        ],
      },
    });
    const current = screen.getByText('Current Page');
    expect(current.closest('a')).toBeNull();
    expect(current.closest('[aria-current="page"]')).not.toBeNull();
  });

  it('has an accessible breadcrumb navigation landmark', () => {
    render(InertiaBreadcrumbs, { props: { items: trail } });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined();
  });

  it('applies className and passes Breadcrumbs props through', () => {
    const { container } = render(InertiaBreadcrumbs, {
      props: { items: trail, className: 'my-trail' },
      attrs: { label: 'Fil d’Ariane' },
    });
    const root = container.querySelector('nav')!;
    expect(root.classList.contains('my-trail')).toBe(true);
    expect(root.getAttribute('aria-label')).toBe('Fil d’Ariane');
  });

  it('renders the item slot inside links and the current page', () => {
    const { container } = render(InertiaBreadcrumbs, {
      props: { items: trail },
      slots: {
        item: `<template #item="{ item, index, isLast }"><em>{{ index }}:{{ item.label }}{{ isLast ? '!' : '' }}</em></template>`,
      },
    });
    const links = [...container.querySelectorAll('[data-inertia-link]')];
    expect(links.map((link) => link.textContent)).toEqual(['0:Home', '1:Users']);
    expect(container.querySelector('[aria-current="page"]')!.textContent).toBe('2:John!');
  });
});

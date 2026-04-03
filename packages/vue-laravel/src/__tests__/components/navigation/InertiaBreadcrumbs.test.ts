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

describe('InertiaBreadcrumbs', () => {
  it('renders breadcrumb items', () => {
    render(InertiaBreadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Users', href: '/users' },
          { label: 'John' },
        ],
      },
    });

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('John')).toBeDefined();
  });

  it('renders Inertia Links for non-last items with href', () => {
    const { container } = render(InertiaBreadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Users', href: '/users' },
          { label: 'Current' },
        ],
      },
    });

    const inertiaLinks = container.querySelectorAll('[data-inertia-link]');
    expect(inertiaLinks.length).toBe(2);
  });

  it('renders the last item as text, not a link', () => {
    render(InertiaBreadcrumbs, {
      props: {
        items: [{ label: 'Home', href: '/' }, { label: 'Current Page' }],
      },
    });

    const lastItem = screen.getByText('Current Page');
    expect(lastItem.closest('a')).toBeNull();
  });

  it('has accessible breadcrumb navigation landmark', () => {
    render(InertiaBreadcrumbs, {
      props: {
        items: [{ label: 'Home', href: '/' }, { label: 'Page' }],
      },
    });

    expect(screen.getByLabelText('Breadcrumb')).toBeDefined();
  });
});

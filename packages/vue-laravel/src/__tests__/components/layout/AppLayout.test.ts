import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';

vi.mock('@inertiajs/vue3', () => ({
  Head: {
    name: 'InertiaHead',
    props: ['title'],
    template: '<div data-testid="inertia-head" />',
  },
  usePage: () => ({ props: {} }),
}));

import AppLayout from '../../../components/layout/AppLayout.vue';

describe('AppLayout', () => {
  it('renders slot content', () => {
    render(AppLayout, {
      slots: {
        default: '<p>Page content</p>',
      },
    });

    expect(screen.getByText('Page content')).toBeTruthy();
  });

  it('renders header slot', () => {
    render(AppLayout, {
      slots: {
        header: '<nav>Header Nav</nav>',
        default: '<p>Content</p>',
      },
    });

    expect(screen.getByText('Header Nav')).toBeTruthy();
  });

  it('renders footer slot', () => {
    render(AppLayout, {
      slots: {
        default: '<p>Content</p>',
        footer: '<footer>Footer</footer>',
      },
    });

    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(AppLayout, {
      props: { className: 'bg-base-100' },
      slots: { default: '<p>Content</p>' },
    });

    expect(container.firstElementChild?.classList.contains('bg-base-100')).toBe(true);
  });

  it('renders Head component when title is provided', () => {
    render(AppLayout, {
      props: { title: 'Dashboard' },
      slots: { default: '<p>Content</p>' },
    });

    expect(screen.getByTestId('inertia-head')).toBeTruthy();
  });
});

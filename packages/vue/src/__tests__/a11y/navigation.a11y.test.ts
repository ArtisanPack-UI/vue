import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Breadcrumbs, Menu, Navbar, Pagination, Steps } from '../../components/navigation';

describe('Navigation components accessibility', () => {
  it('Breadcrumbs has no a11y violations', async () => {
    const { container } = render(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Current Page' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Menu has no a11y violations', async () => {
    const { container } = render(Menu, {
      props: {
        items: [
          { name: 'home', label: 'Home', href: '/' },
          { name: 'about', label: 'About', href: '/about' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Menu with active item and submenu has no a11y violations', async () => {
    const { container } = render(Menu, {
      props: {
        items: [
          { name: 'home', label: 'Home', href: '/', active: true },
          {
            name: 'settings',
            label: 'Settings',
            children: [
              { name: 'profile', label: 'Profile', href: '/settings/profile' },
              { name: 'account', label: 'Account', href: '/settings/account' },
            ],
          },
          { name: 'disabled', label: 'Disabled', disabled: true },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navbar has no a11y violations', async () => {
    const { container } = render(Navbar, {
      slots: {
        default: '<span>My App</span>',
        actions: '<button>Login</button>',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Pagination has no a11y violations', async () => {
    const { container } = render(Pagination, {
      props: { currentPage: 1, totalPages: 10 },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Steps has no a11y violations', async () => {
    const { container } = render(Steps, {
      props: {
        steps: [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }],
        currentStep: 0,
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Breadcrumbs, Link, Menu, Navbar, Pagination, Steps } from '../../components/navigation';

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

  it('Breadcrumbs with a home icon and overflow has no a11y violations', async () => {
    const { container } = render(Breadcrumbs, {
      props: {
        items: [
          { label: 'Home', href: '/', icon: 'house', hideLabel: true },
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C', href: '/c' },
          { label: 'Here' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Link has no a11y violations, as a link, an external link and a button', async () => {
    const { container } = render({
      components: { Link },
      template: `<p>Read the <Link href="/terms">terms</Link>, the <Link href="https://example.com" external>docs</Link> or <Link>log out</Link>.</p>`,
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Menu has no a11y violations', async () => {
    const { container } = render(Menu, {
      props: {
        label: 'Main',
        items: [
          { label: 'Home', href: '/', icon: 'list', current: true },
          {
            label: 'Settings',
            icon: 'settings',
            items: [
              { label: 'Profile', href: '/settings/profile', badge: '2' },
              { label: 'Account', href: '/settings/account' },
            ],
          },
          { type: 'title', label: 'More' },
          { type: 'separator' },
          { label: 'Disabled', href: '/disabled', disabled: true },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Menu with an expanded sub-menu has no a11y violations', async () => {
    const { container } = render(Menu, {
      props: {
        label: 'Main',
        items: [
          {
            label: 'Settings',
            open: true,
            items: [{ label: 'Profile', href: '/settings/profile' }],
          },
        ],
      },
    });
    const toggle = container.querySelector('button[aria-expanded]')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navbar has no a11y violations', async () => {
    const { container } = render(Navbar, {
      props: {
        links: [
          { label: 'Home', href: '/', current: true },
          { label: 'About', href: '/about' },
        ],
      },
      slots: {
        brand: '<a href="/">My App</a>',
        actions: '<button>Login</button>',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Pagination has no a11y violations', async () => {
    const { container } = render(Pagination, {
      props: { page: 3, total: 318, summary: true },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Steps has no a11y violations', async () => {
    const { container } = render(Steps, {
      props: {
        steps: [{ title: 'Step 1' }, { title: 'Step 2', state: 'error' }, { title: 'Step 3' }],
        modelValue: 3,
        clickable: true,
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

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
import AuthLayout from '../../../components/layout/AuthLayout.vue';
import GuestLayout from '../../../components/layout/GuestLayout.vue';

/** Tailwind utilities the 1.x layouts depended on; none renders in 2.0. */
const TAILWIND =
  /\b(min-h-screen|flex-1|flex-col|items-center|justify-center|w-full|max-w-md|flex)\b/;

function classesIn(root: Element): string {
  return [root, ...root.querySelectorAll('*')]
    .map((el) => el.getAttribute('class') ?? '')
    .join(' ');
}

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
      props: { className: 'my-layout' },
      slots: { default: '<p>Content</p>' },
    });

    expect(container.firstElementChild?.classList.contains('my-layout')).toBe(true);
  });

  it('renders Head component when title is provided', () => {
    render(AppLayout, {
      props: { title: 'Dashboard' },
      slots: { default: '<p>Content</p>' },
    });

    expect(screen.getByTestId('inertia-head')).toBeTruthy();
  });

  it('lays out on a design-system Stack that fills the viewport, with no Tailwind classes', () => {
    const { container } = render(AppLayout, {
      slots: { header: '<nav>H</nav>', default: '<p>Content</p>', footer: '<p>F</p>' },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('apui-stack')).toBe(true);
    expect(root.getAttribute('data-gap')).toBe('0');
    expect(root.style.minBlockSize).toBe('100vh');
    const main = root.querySelector('main')!;
    expect(main.style.flex).toBe('1 1 auto');
    expect([...root.children].map((el) => el.tagName)).toEqual(['NAV', 'MAIN', 'P']);
    expect(classesIn(root)).not.toMatch(TAILWIND);
  });
});

describe('AuthLayout', () => {
  it('puts the sidebar beside main between the header and footer, without Tailwind', () => {
    const { container } = render(AuthLayout, {
      props: { className: 'my-layout', title: 'Dashboard' },
      slots: {
        header: '<header>H</header>',
        sidebar: '<aside>S</aside>',
        default: '<p>Content</p>',
        footer: '<footer>F</footer>',
      },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('apui-stack')).toBe(true);
    expect(root.classList.contains('my-layout')).toBe(true);
    expect(root.style.minBlockSize).toBe('100vh');
    const row = root.querySelector<HTMLElement>('[data-orientation="horizontal"]')!;
    expect(row.classList.contains('apui-stack')).toBe(true);
    expect(row.style.flex).toBe('1 1 auto');
    expect([...row.children].map((el) => el.tagName)).toEqual(['ASIDE', 'MAIN']);
    expect(row.querySelector('main')!.textContent).toBe('Content');
    expect(screen.getByText('H')).toBeTruthy();
    expect(screen.getByText('F')).toBeTruthy();
    expect(screen.getByTestId('inertia-head')).toBeTruthy();
    expect(classesIn(root)).not.toMatch(TAILWIND);
  });
});

describe('GuestLayout', () => {
  it('centers a 28rem column with the logo and content, without Tailwind', () => {
    const { container } = render(GuestLayout, {
      props: { className: 'my-layout' },
      slots: { logo: '<img alt="Logo" />', default: '<form>Sign in</form>' },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('apui-stack')).toBe(true);
    expect(root.classList.contains('my-layout')).toBe(true);
    expect(root.getAttribute('data-align')).toBe('center');
    expect(root.getAttribute('data-justify')).toBe('center');
    expect(root.style.minBlockSize).toBe('100vh');
    const column = root.querySelector<HTMLElement>('.apui-stack')!;
    expect(column.style.maxInlineSize).toBe('28rem');
    expect(column.style.inlineSize).toBe('100%');
    expect([...column.children].map((el) => el.tagName)).toEqual(['IMG', 'FORM']);
    expect(classesIn(root)).not.toMatch(TAILWIND);
  });
});

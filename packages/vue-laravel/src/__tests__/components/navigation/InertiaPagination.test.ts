import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';

vi.mock('@inertiajs/vue3', () => ({
  router: {
    visit: vi.fn(),
  },
  usePage: () => ({ props: {} }),
}));

import { router } from '@inertiajs/vue3';
import InertiaPagination from '../../../components/navigation/InertiaPagination.vue';

const basePaginator = {
  current_page: 2,
  data: [],
  first_page_url: '/items?page=1',
  from: 11,
  last_page: 5,
  last_page_url: '/items?page=5',
  links: [],
  next_page_url: '/items?page=3',
  path: '/items',
  per_page: 10,
  prev_page_url: '/items?page=1',
  to: 20,
  total: 50,
};

describe('InertiaPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination controls', () => {
    render(InertiaPagination, {
      props: { paginator: basePaginator },
    });

    expect(screen.getByLabelText('Pagination')).toBeDefined();
  });

  it('shows the current page as active', () => {
    render(InertiaPagination, {
      props: { paginator: basePaginator },
    });

    const page2 = screen.getByLabelText('Page 2');
    expect(page2.getAttribute('aria-current')).toBe('page');
  });

  it('navigates via Inertia router on page click', async () => {
    render(InertiaPagination, {
      props: { paginator: basePaginator },
    });

    const page3 = screen.getByLabelText('Page 3');
    await fireEvent.click(page3);

    expect(router.visit).toHaveBeenCalledWith(
      expect.stringContaining('page=3'),
      expect.objectContaining({
        preserveScroll: false,
        preserveState: false,
      }),
    );
  });

  it('preserves scroll when option is set', async () => {
    render(InertiaPagination, {
      props: { paginator: basePaginator, preserveScroll: true },
    });

    const page3 = screen.getByLabelText('Page 3');
    await fireEvent.click(page3);

    expect(router.visit).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ preserveScroll: true }),
    );
  });

  it('includes extra query params in navigation URL', async () => {
    render(InertiaPagination, {
      props: {
        paginator: basePaginator,
        queryParams: { search: 'test', sort: 'name' },
      },
    });

    const page3 = screen.getByLabelText('Page 3');
    await fireEvent.click(page3);

    const visitUrl = (router.visit as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(visitUrl).toContain('search=test');
    expect(visitUrl).toContain('sort=name');
  });

  it('clicked page takes precedence over queryParams.page', async () => {
    render(InertiaPagination, {
      props: {
        paginator: basePaginator,
        queryParams: { search: 'test', page: '1' },
      },
    });

    const page3 = screen.getByLabelText('Page 3');
    await fireEvent.click(page3);

    const visitUrl = (router.visit as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(visitUrl).toContain('page=3');
    expect(visitUrl).not.toContain('page=1');
  });
});

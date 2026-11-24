import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';

vi.mock('@inertiajs/vue3', () => ({
  router: {
    visit: vi.fn(),
  },
  usePage: () => ({ props: {} }),
}));

import { router } from '@inertiajs/vue3';
import InertiaPagination from '../../../components/navigation/InertiaPagination.vue';
import type { LaravelResourcePaginator } from '../../../types';

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

  const visitUrl = () =>
    new URL(
      (router.visit as ReturnType<typeof vi.fn>).mock.calls[0][0] as string,
      'http://localhost',
    );

  it('uses a custom pageParam and passes only for partial reloads', async () => {
    render(InertiaPagination, {
      props: { paginator: basePaginator, pageParam: 'p', only: ['items'] },
    });

    await fireEvent.click(screen.getByLabelText('Page 3'));

    expect(visitUrl().searchParams.get('p')).toBe('3');
    expect(visitUrl().searchParams.has('page')).toBe(false);
    expect(router.visit).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ only: ['items'] }),
    );
  });

  it('reads the page details from a paginated API resource collection', async () => {
    const orders: LaravelResourcePaginator<{ id: number }> = {
      data: [{ id: 1 }],
      links: {
        first: '/orders?page=1',
        last: '/orders?page=6',
        prev: '/orders?page=3',
        next: '/orders?page=5',
      },
      meta: {
        current_page: 4,
        last_page: 6,
        per_page: 25,
        total: 150,
        from: 76,
        to: 100,
        path: '/orders',
        links: [{ url: '/orders?page=3', label: 'Previous', page: 3, active: false }],
      },
    };
    render(InertiaPagination, { props: { paginator: orders } });

    expect(screen.getByLabelText('Page 4').getAttribute('aria-current')).toBe('page');

    await fireEvent.click(screen.getByLabelText('Page 5'));

    expect((router.visit as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe('/orders?page=5');
  });

  it('uses top-level page details over an unrelated meta field', () => {
    const orders = { ...basePaginator, current_page: 4, meta: { description: 'Orders' } };
    render(InertiaPagination, { props: { paginator: orders } });

    expect(screen.getByLabelText('Page 4').getAttribute('aria-current')).toBe('page');
  });

  describe('preserveQuery', () => {
    beforeEach(() => {
      window.history.replaceState(
        {},
        '',
        '/items?q=shoes&filters%5Bstatus%5D%5B%5D=paid&filters%5Bstatus%5D%5B%5D=open&page=2&sort=total',
      );
    });

    afterEach(() => {
      window.history.replaceState({}, '', '/');
    });

    it('drops the current query by default', async () => {
      render(InertiaPagination, { props: { paginator: basePaginator } });

      await fireEvent.click(screen.getByLabelText('Page 3'));

      expect((router.visit as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe('/items?page=3');
    });

    it('keeps the current query, including repeated keys, and replaces the page', async () => {
      render(InertiaPagination, { props: { paginator: basePaginator, preserveQuery: true } });

      await fireEvent.click(screen.getByLabelText('Page 3'));

      const url = visitUrl();
      expect(url.pathname).toBe('/items');
      expect(url.searchParams.get('q')).toBe('shoes');
      expect(url.searchParams.getAll('filters[status][]')).toEqual(['paid', 'open']);
      expect(url.searchParams.getAll('page')).toEqual(['3']);
      expect(url.searchParams.get('sort')).toBe('total');
    });

    it('replaces path values for keys in the current query and keeps the rest', async () => {
      render(InertiaPagination, {
        props: {
          paginator: { ...basePaginator, path: '/items?sort=stale&scope=mine' },
          preserveQuery: true,
        },
      });

      await fireEvent.click(screen.getByLabelText('Page 3'));

      const url = visitUrl();
      expect(url.searchParams.getAll('sort')).toEqual(['total']);
      expect(url.searchParams.get('scope')).toBe('mine');
    });

    it('lets queryParams win over the current query', async () => {
      render(InertiaPagination, {
        props: { paginator: basePaginator, preserveQuery: true, queryParams: { sort: 'date' } },
      });

      await fireEvent.click(screen.getByLabelText('Page 3'));

      expect(visitUrl().searchParams.getAll('sort')).toEqual(['date']);
    });
  });
});

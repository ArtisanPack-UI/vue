import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { Pagination, paginationRange } from '../../components/navigation';

const sequence = (container: Element) =>
  [...container.querySelector('nav')!.children].map(
    (el) => `${el.getAttribute('data-part')}:${el.textContent!.trim()}`,
  );

describe('Pagination', () => {
  it('renders a named nav with previous, the pages and next', () => {
    const { container } = render(Pagination, { props: { page: 3, total: 318, perPage: 10 } });
    expect(screen.getByRole('navigation', { name: 'Pagination' }).className).toBe(
      'apui-pagination',
    );
    expect(sequence(container)).toEqual([
      'previous:',
      'page:1',
      'page:2',
      'page:3',
      'page:4',
      'page:5',
      'ellipsis:…',
      'page:32',
      'next:',
    ]);
  });

  it('marks the current page and names every control', () => {
    render(Pagination, { props: { page: 3, total: 318 } });
    expect(screen.getByRole('button', { name: 'Page 3' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByRole('button', { name: 'Previous page' }).hasAttribute('data-mirror')).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'Next page' })).toBeTruthy();
  });

  it('emits page-change and update:page from pages, previous and next', async () => {
    const { emitted } = render(Pagination, { props: { page: 3, pageCount: 10 } });
    await fireEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(emitted()['page-change']).toEqual([[4], [2], [4]]);
    expect(emitted()['update:page']).toEqual([[4], [2], [4]]);
  });

  it('keeps previous and next focusable but inert at the ends', async () => {
    const { emitted } = render(Pagination, { props: { page: 1, pageCount: 1 } });
    const previous = screen.getByRole('button', { name: 'Previous page' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('button', { name: 'Next page' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    await fireEvent.click(previous);
    expect(emitted()['page-change']).toBeUndefined();
  });

  it('prefers pageCount and clamps the page', () => {
    render(Pagination, { props: { page: 9, pageCount: 3, total: 1000 } });
    expect(screen.getAllByRole('button', { name: /^Page / })).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Page 3' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('keeps one width as the page moves', () => {
    expect(paginationRange(1, 20, 1)).toEqual([1, 2, 3, 4, 5, null, 20]);
    expect(paginationRange(10, 20, 1)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(paginationRange(20, 20, 1)).toEqual([1, null, 16, 17, 18, 19, 20]);
  });

  it('shows a translatable summary', () => {
    const summary = (props: Record<string, unknown>) =>
      render(Pagination, { props }).container.querySelector('[data-part="summary"]')!.textContent;
    expect(summary({ page: 32, total: 318, summary: true })).toBe('Showing 311–318 of 318');
    expect(summary({ page: 2, pageCount: 32, summary: true })).toBe('Page 2 of 32');
    expect(
      summary({
        page: 2,
        pageCount: 32,
        summary: true,
        summaryLabel: 'Seite {page} von {pageCount}',
      }),
    ).toBe('Seite 2 von 32');
  });

  it('takes translated labels', () => {
    render(Pagination, {
      props: {
        pageCount: 2,
        label: 'Seiten',
        previousLabel: 'Zurück',
        nextLabel: 'Weiter',
        pageLabel: 'Seite {page}',
      },
    });
    expect(screen.getByRole('navigation', { name: 'Seiten' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Zurück' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Seite 2' })).toBeTruthy();
  });
});

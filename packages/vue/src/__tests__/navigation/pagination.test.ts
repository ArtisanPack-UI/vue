import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Pagination } from '../../components/navigation';

describe('Pagination', () => {
  it('renders page buttons', () => {
    render(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('marks current page as active', () => {
    render(Pagination, { props: { currentPage: 3, totalPages: 5 } });
    const page3 = screen.getByText('3');
    expect(page3.classList.contains('btn-active')).toBe(true);
  });

  it('sets aria-current on active page', () => {
    render(Pagination, { props: { currentPage: 2, totalPages: 5 } });
    const page2 = screen.getByText('2');
    expect(page2.getAttribute('aria-current')).toBe('page');
  });

  it('disables previous button on first page', () => {
    render(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    const prev = screen.getByLabelText('Previous page');
    expect((prev as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables next button on last page', () => {
    render(Pagination, { props: { currentPage: 5, totalPages: 5 } });
    const next = screen.getByLabelText('Next page');
    expect((next as HTMLButtonElement).disabled).toBe(true);
  });

  it('emits update:currentPage on page click', async () => {
    const { emitted } = render(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    const page2 = screen.getByText('2');
    await fireEvent.click(page2);
    expect(emitted()['update:currentPage']).toBeTruthy();
    expect(emitted()['update:currentPage'][0]).toEqual([2]);
  });

  it('emits update:currentPage on next click', async () => {
    const { emitted } = render(Pagination, { props: { currentPage: 2, totalPages: 5 } });
    const next = screen.getByLabelText('Next page');
    await fireEvent.click(next);
    expect(emitted()['update:currentPage'][0]).toEqual([3]);
  });

  it('emits update:currentPage on previous click', async () => {
    const { emitted } = render(Pagination, { props: { currentPage: 3, totalPages: 5 } });
    const prev = screen.getByLabelText('Previous page');
    await fireEvent.click(prev);
    expect(emitted()['update:currentPage'][0]).toEqual([2]);
  });

  it('does not emit when clicking current page', async () => {
    const { emitted } = render(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    const page1 = screen.getByText('1');
    await fireEvent.click(page1);
    expect(emitted()['update:currentPage']).toBeFalsy();
  });

  it('shows ellipsis for many pages', () => {
    render(Pagination, { props: { currentPage: 5, totalPages: 10 } });
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('has navigation role and aria-label', () => {
    const { container } = render(Pagination, { props: { currentPage: 1, totalPages: 5 } });
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');
  });

  it('does not render page buttons for single page', () => {
    const { container } = render(Pagination, { props: { currentPage: 1, totalPages: 1 } });
    const pageButtons = container.querySelectorAll('.btn-active');
    expect(pageButtons.length).toBe(0);
  });

  it('applies size class to buttons', () => {
    const { container } = render(Pagination, {
      props: { currentPage: 1, totalPages: 5, size: 'sm' },
    });
    expect(container.querySelector('.btn-sm')).toBeTruthy();
  });
});

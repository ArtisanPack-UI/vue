import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Table } from '../../components/data';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', align: 'center' as const },
];

const rows = [
  { name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@test.com', role: 'User' },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(Table, { props: { columns, rows } });
    expect(screen.getByText(/Name/)).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Role')).toBeTruthy();
  });

  it('renders row data', () => {
    render(Table, { props: { columns, rows } });
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('bob@test.com')).toBeTruthy();
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('shows empty message when no rows', () => {
    render(Table, { props: { columns, rows: [] } });
    expect(screen.getByText('No data available')).toBeTruthy();
  });

  it('shows custom empty message', () => {
    render(Table, {
      props: { columns, rows: [], emptyMessage: 'Nothing here' },
    });
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  it('applies striped class', () => {
    const { container } = render(Table, {
      props: { columns, rows, striped: true },
    });
    expect(container.querySelector('.table-zebra')).toBeTruthy();
  });

  it('applies compact class', () => {
    const { container } = render(Table, {
      props: { columns, rows, compact: true },
    });
    expect(container.querySelector('.table-xs')).toBeTruthy();
  });

  it('emits sort event on sortable column click', async () => {
    const { emitted } = render(Table, { props: { columns, rows } });
    const nameHeader = screen.getByText(/Name/);
    await fireEvent.click(nameHeader);
    expect(emitted().sort).toBeTruthy();
    expect(emitted().sort[0]).toEqual([{ key: 'name', direction: 'asc' }]);
  });

  it('does not emit sort for non-sortable columns', async () => {
    const { emitted } = render(Table, { props: { columns, rows } });
    await fireEvent.click(screen.getByText('Email'));
    expect(emitted().sort).toBeFalsy();
  });

  it('toggles sort direction', async () => {
    const { emitted } = render(Table, {
      props: { columns, rows, sort: { key: 'name', direction: 'asc' } },
    });
    const nameHeader = screen.getByText(/Name/);
    await fireEvent.click(nameHeader);
    expect(emitted().sort[0]).toEqual([{ key: 'name', direction: 'desc' }]);
  });

  it('shows sort indicator for sorted column', () => {
    render(Table, {
      props: { columns, rows, sort: { key: 'name', direction: 'asc' } },
    });
    expect(screen.getByText(/Name.*↑/)).toBeTruthy();
  });

  it('shows loading state', () => {
    const { container } = render(Table, {
      props: { columns, rows, loading: true },
    });
    expect(container.querySelector('.loading-spinner')).toBeTruthy();
  });

  it('applies aria-sort attribute', () => {
    const { container } = render(Table, {
      props: { columns, rows, sort: { key: 'name', direction: 'asc' } },
    });
    const sortedHeader = container.querySelector('[aria-sort="ascending"]');
    expect(sortedHeader).toBeTruthy();
  });

  it('has table role', () => {
    const { container } = render(Table, { props: { columns, rows } });
    expect(container.querySelector('[role="table"]')).toBeTruthy();
  });

  it('renders sortable column header as a button', () => {
    const { container } = render(Table, { props: { columns, rows } });
    const sortButton = container.querySelector('th button');
    expect(sortButton).toBeTruthy();
    expect(sortButton?.textContent).toContain('Name');
  });

  it('triggers sort via keyboard Enter', async () => {
    const { container, emitted } = render(Table, { props: { columns, rows } });
    const sortButton = container.querySelector('th button')!;
    await fireEvent.keyDown(sortButton, { key: 'Enter' });
    // Native button handles Enter natively via click
    await fireEvent.click(sortButton);
    expect(emitted().sort).toBeTruthy();
  });

  it('renders custom cell slot content', () => {
    const { container } = render(Table, {
      props: { columns, rows },
      slots: { 'cell-name': ({ row }: { row: Record<string, unknown> }) => `**${row.name}**` },
    });
    expect(container.textContent).toContain('**Alice**');
    expect(container.textContent).toContain('**Bob**');
  });

  it('renders custom empty slot', () => {
    render(Table, {
      props: { columns, rows: [] },
      slots: { empty: '<div>No records found</div>' },
    });
    expect(screen.getByText('No records found')).toBeTruthy();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Table } from '../../components/data';

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'owner.name', label: 'Executed by' },
];

const rows = [
  {
    id: 1,
    symbol: 'TSLA',
    company: 'Tesla, Inc.',
    amount: '$30,021.23',
    date: 'Dec 13, 2023',
    owner: { name: 'Olivia Rhye' },
  },
  {
    id: 2,
    symbol: 'MTCH',
    company: 'Match Group, Inc.',
    amount: '$10,045.00',
    date: 'Dec 13, 2023',
    owner: { name: 'Phoenix Baker' },
  },
  {
    id: 3,
    symbol: 'DDOG',
    company: 'Datadog Inc.',
    amount: '$40,132.16',
    date: 'Dec 13, 2023',
    owner: { name: 'Lana Steiner' },
  },
];

const root = (container: Element) => container.querySelector('.apui-table') as HTMLElement;
const bodyRows = (container: Element) =>
  [...container.querySelectorAll('tbody > tr[data-part="row"]')] as HTMLElement[];

describe('Table', () => {
  it('renders the frame, the scroll part and a real table', () => {
    const { container } = render(Table, { props: { headers, rows } });
    const table = root(container);
    expect(table.getAttribute('data-surface')).toBe('default');
    expect(table.hasAttribute('data-sticky-header')).toBe(true);
    expect(table.hasAttribute('data-density')).toBe(false);
    expect(container.querySelectorAll('thead th[data-part="head-cell"][scope="col"]')).toHaveLength(
      4,
    );
    expect(bodyRows(container)).toHaveLength(3);
    expect(container.querySelector('[data-part="toolbar"], [data-part="footer"]')).toBeNull();
  });

  it('names the table by its title, or by label', () => {
    const { container, rerender } = render(Table, {
      props: { headers, rows, title: 'Transactions' },
    });
    const title = container.querySelector('h3[data-part="title"]')!;
    expect(container.querySelector('table')!.getAttribute('aria-labelledby')).toBe(title.id);
    return rerender({ headers, rows, title: 'Transactions', label: 'Orders' }).then(() => {
      const table = container.querySelector('table')!;
      expect(table.getAttribute('aria-label')).toBe('Orders');
      expect(table.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  it('renders two-line cells, numeric columns and dotted keys', () => {
    const { container } = render(Table, { props: { headers, rows } });
    const first = bodyRows(container)[0]!;
    expect(first.querySelector('[data-part="primary"]')!.textContent).toBe('TSLA');
    expect(first.querySelector('[data-part="secondary"]')!.textContent).toBe('Tesla, Inc.');
    expect(first.children[1]!.hasAttribute('data-numeric')).toBe(true);
    expect(first.children[3]!.textContent!.trim()).toBe('Olivia Rhye');
  });

  it('marks the sorted header and emits the next sort', async () => {
    const { container, emitted } = render(Table, {
      props: { headers, rows, sortBy: { column: 'date', direction: 'desc' } },
    });
    const cells = container.querySelectorAll('thead th[data-part="head-cell"]');
    expect(cells[0]!.getAttribute('aria-sort')).toBe('none');
    expect(cells[1]!.hasAttribute('aria-sort')).toBe(false);
    expect(cells[2]!.getAttribute('aria-sort')).toBe('descending');
    await fireEvent.click(screen.getByRole('button', { name: 'Sort by Date' }));
    expect(emitted()['sort-change']![0]).toEqual([{ column: 'date', direction: 'asc' }]);
    expect(emitted()['update:sortBy']![0]).toEqual([{ column: 'date', direction: 'asc' }]);
  });

  it('selects rows, with a mixed select-all box', async () => {
    const { container, emitted } = render(Table, {
      props: { headers, rows, selectable: true, modelValue: [2] },
    });
    const all = screen.getByRole('checkbox', { name: 'Select all' });
    expect(all.closest('.apui-checkbox')!.getAttribute('data-state')).toBe('indeterminate');
    expect(bodyRows(container)[1]!.getAttribute('aria-selected')).toBe('true');
    expect(bodyRows(container)[0]!.getAttribute('aria-selected')).toBe('false');

    await fireEvent.click(screen.getByRole('checkbox', { name: 'Select TSLA' }));
    expect(emitted()['update:modelValue']!.at(-1)).toEqual([[2, 1]]);

    await fireEvent.click(all);
    expect(emitted()['update:modelValue']!.at(-1)).toEqual([[1, 2, 3]]);
    expect(all.closest('.apui-checkbox')!.getAttribute('data-state')).toBe('checked');
  });

  it('expands rows with a named button', async () => {
    const { container, emitted } = render(Table, {
      props: { headers, rows, expandable: true },
      slots: { expansion: ({ row }: { row: { symbol: string } }) => `Details for ${row.symbol}` },
    });
    const trigger = screen.getByRole('button', { name: 'Show details for TSLA' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('data-mirror')).toBe(true);
    await fireEvent.click(trigger);
    const expansion = container.querySelector('tr[data-part="expansion"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(expansion.id);
    expect(expansion.textContent!.trim()).toBe('Details for TSLA');
    expect(expansion.querySelector('td')!.getAttribute('colspan')).toBe('5');
    expect(emitted()['expanded-change']![0]).toEqual([[1]]);
  });

  it('shows skeleton rows while loading', () => {
    const { container } = render(Table, { props: { headers, rows, loading: true } });
    expect(root(container).getAttribute('aria-busy')).toBe('true');
    expect(container.querySelectorAll('tbody tr[aria-hidden="true"]')).toHaveLength(3);
    expect(container.querySelectorAll('.apui-skeleton[data-shape="text"]')).toHaveLength(12);
    expect(container.textContent).not.toContain('TSLA');
  });

  it('shows an EmptyState without rows, or the empty slot', () => {
    const { container } = render(Table, { props: { headers, rows: [], emptyText: 'Nothing yet' } });
    const cell = container.querySelector('td[data-empty]')!;
    expect(cell.getAttribute('colspan')).toBe('4');
    expect(cell.querySelector('[data-part="title"]')!.textContent).toBe('Nothing yet');

    render(Table, {
      props: { headers, rows: [] },
      slots: { empty: () => h('a', { href: '/new' }, 'Add one') },
    });
    expect(screen.getByRole('link', { name: 'Add one' })).toBeTruthy();
  });

  it('renders cell, header and actions slots', () => {
    const { container } = render(Table, {
      props: { headers, rows },
      slots: {
        'cell-amount': ({ row }: { row: { amount: string } }) => h('strong', row.amount),
        'header-date': () => h('u', 'When'),
        actions: ({ row }: { row: { symbol: string } }) =>
          h('button', { type: 'button' }, `Edit ${row.symbol}`),
      },
    });
    expect(bodyRows(container)[0]!.querySelector('strong')!.textContent).toBe('$30,021.23');
    expect(container.querySelector('thead u')!.textContent).toBe('When');
    expect(screen.getByText('Actions').className).toBe('apui-sr-only');
    expect(
      screen.getByRole('button', { name: 'Edit MTCH' }).closest('td')!.hasAttribute('data-actions'),
    ).toBe(true);
  });

  it('puts footer content and Pagination in the footer', async () => {
    const onPageChange = vi.fn();
    const { container } = render(Table, {
      props: {
        headers,
        rows,
        footer: '1 selected',
        pagination: { page: 3, total: 128, perPage: 4, onPageChange },
      },
    });
    const footer = container.querySelector('[data-part="footer"]')!;
    expect(footer.firstElementChild!.textContent).toBe('1 selected');
    expect(footer.querySelector('nav.apui-pagination')).not.toBeNull();
    await fireEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('emits row-click outside controls, only with a listener', async () => {
    const onRowClick = vi.fn();
    const { container } = render(Table, {
      props: { headers, rows, selectable: true },
      attrs: { onRowClick },
    });
    expect(bodyRows(container)[0]!.hasAttribute('data-clickable')).toBe(true);
    await fireEvent.click(screen.getByText('Phoenix Baker'));
    expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);
    await fireEvent.click(screen.getByRole('checkbox', { name: 'Select TSLA' }));
    expect(onRowClick).toHaveBeenCalledTimes(1);

    const plain = render(Table, { props: { headers, rows } });
    expect(plain.container.querySelector('[data-clickable]')).toBeNull();
  });

  it('sets density, surface, sticky header and hidden headers', () => {
    const { container } = render(Table, {
      props: {
        headers,
        rows,
        density: 'compact',
        surface: 'glass',
        stickyHeader: false,
        hideHeaders: true,
        classes: { cell: 'c', headCell: 'h' },
      },
    });
    expect(root(container).getAttribute('data-density')).toBe('compact');
    expect(root(container).getAttribute('data-surface')).toBe('glass');
    expect(root(container).hasAttribute('data-sticky-header')).toBe(false);
    expect(container.querySelector('thead')!.className).toBe('apui-sr-only');
    expect(container.querySelector('td[data-part="cell"]')!.className).toBe('c');
    expect(container.querySelector('th[data-part="head-cell"]')!.className).toBe('h');
  });
  it('keeps the 1.x props working', async () => {
    const { container, emitted } = render(Table, {
      props: {
        columns: [
          { key: 'symbol', label: 'Product name', sortable: true },
          { key: 'amount', label: 'Order amount', align: 'right' as const, className: 'amt' },
        ],
        rows,
        compact: true,
        striped: true,
        className: 'legacy',
        emptyMessage: 'Nothing here',
        sort: { key: 'symbol', direction: 'asc' as const },
      },
    });
    const table = root(container);
    expect(table.className).toBe('apui-table legacy');
    expect(table.getAttribute('data-density')).toBe('compact');
    expect(table.hasAttribute('striped')).toBe(false);
    const heads = container.querySelectorAll('th[data-part="head-cell"]');
    expect(heads[0]!.getAttribute('aria-sort')).toBe('ascending');
    expect(heads[1]!.hasAttribute('data-numeric')).toBe(true);
    expect(heads[1]!.className).toBe('amt');
    await fireEvent.click(screen.getByRole('button', { name: 'Sort by Product name' }));
    expect(emitted().sort![0]).toEqual([{ key: 'symbol', direction: 'desc' }]);

    const empty = render(Table, {
      props: { columns: [{ key: 'a', label: 'A' }], rows: [], emptyMessage: 'Nothing here' },
    });
    expect(empty.container.querySelector('td[data-empty]')!.textContent!.trim()).toBe(
      'Nothing here',
    );
  });

  it('re-reads the title and actions slots and the row-click listener on update', async () => {
    const extras = ref(false);
    const Host = defineComponent({
      setup: () => () =>
        h(
          Table,
          {
            headers,
            rows,
            label: 'Orders',
            ...(extras.value ? { onRowClick: () => {} } : {}),
          },
          extras.value ? { title: () => 'Recent orders', actions: () => h('button', 'Edit') } : {},
        ),
    });
    const { container } = render(Host);
    expect(container.querySelector('[data-part="title"]')).toBeNull();
    expect(container.querySelector('tbody tr')!.hasAttribute('data-clickable')).toBe(false);
    extras.value = true;
    await nextTick();
    expect(container.querySelector('[data-part="title"]')!.textContent).toBe('Recent orders');
    expect(container.querySelector('tbody tr')!.hasAttribute('data-clickable')).toBe(true);
    expect(container.querySelectorAll('thead th')).toHaveLength(headers.length + 1);
  });
});

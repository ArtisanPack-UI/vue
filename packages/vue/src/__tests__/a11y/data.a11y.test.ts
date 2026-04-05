import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Table, Calendar } from '../../components/data';

describe('Data components accessibility', () => {
  it('Table has no a11y violations', async () => {
    const { container } = render(Table, {
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
        ],
        rows: [
          { name: 'John', email: 'john@example.com' },
          { name: 'Jane', email: 'jane@example.com' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Table with sorting has no a11y violations', async () => {
    const { container } = render(Table, {
      props: {
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'email', label: 'Email' },
        ],
        rows: [{ name: 'John', email: 'john@example.com' }],
        sort: { key: 'name', direction: 'asc' as const },
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Table empty state has no a11y violations', async () => {
    const { container } = render(Table, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [],
        emptyMessage: 'No data found',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Table loading state has no a11y violations', async () => {
    const { container } = render(Table, {
      props: {
        columns: [{ key: 'name', label: 'Name' }],
        rows: [],
        loading: true,
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Calendar has no a11y violations', async () => {
    const { container } = render(Calendar, {
      props: { events: [] },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

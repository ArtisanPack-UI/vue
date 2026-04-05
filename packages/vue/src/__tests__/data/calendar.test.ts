import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Calendar } from '../../components/data';

describe('Calendar', () => {
  it('renders month and year heading', () => {
    render(Calendar, { props: { month: 3, year: 2024 } });
    expect(screen.getByText('March 2024')).toBeTruthy();
  });

  it('renders day of week headers', () => {
    render(Calendar, { props: { month: 1, year: 2024 } });
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
    expect(screen.getByText('Sat')).toBeTruthy();
  });

  it('renders day of week headers starting Monday', () => {
    render(Calendar, { props: { month: 1, year: 2024, weekStart: 1 } });
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]?.textContent).toBe('Mon');
    expect(headers[6]?.textContent).toBe('Sun');
  });

  it('navigates to previous month', async () => {
    const { emitted } = render(Calendar, { props: { month: 3, year: 2024 } });
    const prevBtn = screen.getByLabelText('Previous month');
    await fireEvent.click(prevBtn);
    expect(emitted()['month-change']).toBeTruthy();
    expect(emitted()['month-change'][0]).toEqual([{ month: 2, year: 2024 }]);
  });

  it('navigates to next month', async () => {
    const { emitted } = render(Calendar, { props: { month: 3, year: 2024 } });
    const nextBtn = screen.getByLabelText('Next month');
    await fireEvent.click(nextBtn);
    expect(emitted()['month-change']).toBeTruthy();
    expect(emitted()['month-change'][0]).toEqual([{ month: 4, year: 2024 }]);
  });

  it('wraps from January to December', async () => {
    const { emitted } = render(Calendar, { props: { month: 1, year: 2024 } });
    const prevBtn = screen.getByLabelText('Previous month');
    await fireEvent.click(prevBtn);
    expect(emitted()['month-change'][0]).toEqual([{ month: 12, year: 2023 }]);
  });

  it('emits date-click on date selection', async () => {
    const { emitted } = render(Calendar, { props: { month: 3, year: 2024 } });
    const dayButton = screen.getByText('15');
    await fireEvent.click(dayButton);
    expect(emitted()['date-click']).toBeTruthy();
    expect(emitted()['update:modelValue']).toBeTruthy();
  });

  it('highlights selected date', () => {
    const { container } = render(Calendar, {
      props: { month: 3, year: 2024, modelValue: '2024-03-15' },
    });
    const selected = container.querySelector('[aria-selected="true"]');
    expect(selected).toBeTruthy();
    expect(selected?.textContent).toContain('15');
  });

  it('shows event dots', () => {
    const events = [{ id: 1, title: 'Meeting', date: '2024-03-15', color: 'primary' as const }];
    const { container } = render(Calendar, {
      props: { month: 3, year: 2024, events },
    });
    const dateBtn = container.querySelector('[aria-label*="1 event"]');
    expect(dateBtn).toBeTruthy();
    expect(dateBtn?.textContent).toContain('15');
  });

  it('disables dates before minDate', () => {
    const { container } = render(Calendar, {
      props: { month: 3, year: 2024, minDate: '2024-03-15' },
    });
    const disabledBtns = container.querySelectorAll('button[disabled]');
    expect(disabledBtns.length).toBeGreaterThan(0);
  });

  it('has correct ARIA grid role', () => {
    const { container } = render(Calendar, { props: { month: 3, year: 2024 } });
    expect(container.querySelector('[role="grid"]')).toBeTruthy();
  });
});

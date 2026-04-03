import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { DatePicker } from '../../components/form';

describe('DatePicker', () => {
  it('renders with label', () => {
    render(DatePicker, { props: { label: 'Start Date' } });
    expect(screen.getByText('Start Date')).toBeTruthy();
  });

  it('renders a date input by default', () => {
    render(DatePicker);
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('date');
  });

  it('renders datetime-local input', () => {
    render(DatePicker, { props: { dateType: 'datetime-local' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('datetime-local');
  });

  it('renders time input', () => {
    render(DatePicker, { props: { dateType: 'time' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('time');
  });

  it('renders month input', () => {
    render(DatePicker, { props: { dateType: 'month' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('month');
  });

  it('renders week input', () => {
    render(DatePicker, { props: { dateType: 'week' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('week');
  });

  it('shows required indicator', () => {
    render(DatePicker, { props: { label: 'Date', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(DatePicker, { props: { hint: 'Select a date' } });
    expect(screen.getByText('Select a date')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(DatePicker, { props: { hint: 'Help', error: 'Invalid date' } });
    expect(screen.getByText('Invalid date')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    render(DatePicker, { props: { error: 'Error' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('renders inline label', () => {
    render(DatePicker, { props: { label: 'Inline', inline: true } });
    expect(document.querySelector('.fieldset-legend')).toBeNull();
  });

  it('supports min and max props', () => {
    render(DatePicker, { props: { min: '2024-01-01', max: '2024-12-31' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('min')).toBe('2024-01-01');
    expect(input?.getAttribute('max')).toBe('2024-12-31');
  });
});

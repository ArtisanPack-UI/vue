import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Range } from '../../components/form';

describe('Range', () => {
  it('renders with label', () => {
    render(Range, { props: { label: 'Volume' } });
    expect(screen.getByText('Volume')).toBeTruthy();
  });

  it('renders a range input', () => {
    render(Range);
    const input = document.querySelector('input[type="range"]');
    expect(input).toBeTruthy();
  });

  it('defaults to min=0 and max=100', () => {
    render(Range);
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
  });

  it('accepts custom min and max', () => {
    render(Range, { props: { min: 10, max: 50 } });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('min')).toBe('10');
    expect(input.getAttribute('max')).toBe('50');
  });

  it('applies color variant class', () => {
    render(Range, { props: { color: 'primary' } });
    const input = document.querySelector('input');
    expect(input?.classList.contains('range-primary')).toBe(true);
  });

  it('shows required indicator', () => {
    render(Range, { props: { label: 'Range', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Range, { props: { hint: 'Adjust volume' } });
    expect(screen.getByText('Adjust volume')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Range, { props: { hint: 'Help', error: 'Out of range' } });
    expect(screen.getByText('Out of range')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    render(Range, { props: { error: 'Error' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('accepts step prop', () => {
    render(Range, { props: { step: 5 } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('step')).toBe('5');
  });
});

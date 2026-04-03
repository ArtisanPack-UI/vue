import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Progress } from '../../components/display';

describe('Progress', () => {
  it('renders a progress element', () => {
    const { container } = render(Progress, { props: { value: 50 } });
    expect(container.querySelector('progress')).toBeTruthy();
  });

  it('sets value and max attributes', () => {
    const { container } = render(Progress, { props: { value: 75, max: 100 } });
    const progress = container.querySelector('progress');
    expect(progress?.getAttribute('value')).toBe('75');
    expect(progress?.getAttribute('max')).toBe('100');
  });

  it('applies color variant', () => {
    const { container } = render(Progress, {
      props: { value: 50, color: 'success' },
    });
    expect(container.querySelector('.progress-success')).toBeTruthy();
  });

  it('shows percentage text when showValue is true', () => {
    render(Progress, { props: { value: 50, max: 100, showValue: true } });
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('does not show percentage text by default', () => {
    const { container } = render(Progress, { props: { value: 50 } });
    expect(container.textContent).not.toContain('50%');
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(Progress, { props: { value: 60, max: 100 } });
    const progress = container.querySelector('progress');
    expect(progress?.getAttribute('role')).toBe('progressbar');
    expect(progress?.getAttribute('aria-valuenow')).toBe('60');
    expect(progress?.getAttribute('aria-valuemin')).toBe('0');
    expect(progress?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('calculates percentage correctly', () => {
    render(Progress, { props: { value: 25, max: 200, showValue: true } });
    expect(screen.getByText('13%')).toBeTruthy();
  });
});

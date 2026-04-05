import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Loading } from '../../components/feedback';

describe('Loading', () => {
  it('renders with role="status"', () => {
    render(Loading);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('has aria-label', () => {
    render(Loading);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe('Loading');
  });

  it('applies default spinner variant', () => {
    const { container } = render(Loading);
    expect(container.querySelector('.loading-spinner')).toBeTruthy();
  });

  it('applies variant class', () => {
    const variants = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'] as const;
    variants.forEach((variant) => {
      const { container, unmount } = render(Loading, { props: { variant } });
      expect(container.querySelector(`.loading-${variant}`)).toBeTruthy();
      unmount();
    });
  });

  it('applies color class', () => {
    const { container } = render(Loading, { props: { color: 'primary' } });
    expect(container.querySelector('.text-primary')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Loading, { props: { size: 'lg' } });
    expect(container.querySelector('.loading-lg')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Loading, { props: { className: 'custom' } });
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('renders as a span element', () => {
    const { container } = render(Loading);
    expect(container.querySelector('span.loading')).toBeTruthy();
  });
});

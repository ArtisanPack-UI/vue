import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Icon } from '../../components/utility';

describe('Icon', () => {
  it('renders slot content', () => {
    render(Icon, {
      slots: { default: '<svg data-testid="svg-icon"></svg>' },
    });
    expect(screen.getByTestId('svg-icon')).toBeTruthy();
  });

  it('is decorative by default (aria-hidden)', () => {
    const { container } = render(Icon, {
      slots: { default: '<svg></svg>' },
    });
    const span = container.querySelector('span');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    expect(span?.getAttribute('role')).toBe('presentation');
  });

  it('has role="img" and aria-label when ariaLabel is provided', () => {
    const { container } = render(Icon, {
      props: { ariaLabel: 'Home' },
      slots: { default: '<svg></svg>' },
    });
    const span = container.querySelector('span');
    expect(span?.getAttribute('role')).toBe('img');
    expect(span?.getAttribute('aria-label')).toBe('Home');
    expect(span?.hasAttribute('aria-hidden')).toBe(false);
  });

  it('applies default md size classes', () => {
    const { container } = render(Icon, {
      slots: { default: '<svg></svg>' },
    });
    const span = container.querySelector('span');
    expect(span?.classList.contains('w-5')).toBe(true);
    expect(span?.classList.contains('h-5')).toBe(true);
  });

  it('applies size classes', () => {
    const sizes = [
      { size: 'xs', w: 'w-3', h: 'h-3' },
      { size: 'sm', w: 'w-4', h: 'h-4' },
      { size: 'md', w: 'w-5', h: 'h-5' },
      { size: 'lg', w: 'w-6', h: 'h-6' },
    ] as const;

    sizes.forEach(({ size, w, h }) => {
      const { container, unmount } = render(Icon, {
        props: { size },
        slots: { default: '<svg></svg>' },
      });
      const span = container.querySelector('span');
      expect(span?.classList.contains(w)).toBe(true);
      expect(span?.classList.contains(h)).toBe(true);
      unmount();
    });
  });

  it('applies color class', () => {
    const { container } = render(Icon, {
      props: { color: 'primary' },
      slots: { default: '<svg></svg>' },
    });
    expect(container.querySelector('.text-primary')).toBeTruthy();
  });

  it('applies all color variants', () => {
    const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutral'] as const;
    colors.forEach((color) => {
      const { container, unmount } = render(Icon, {
        props: { color },
        slots: { default: '<svg></svg>' },
      });
      expect(container.querySelector(`.text-${color}`)).toBeTruthy();
      unmount();
    });
  });

  it('applies custom className', () => {
    const { container } = render(Icon, {
      props: { className: 'custom-icon' },
      slots: { default: '<svg></svg>' },
    });
    expect(container.querySelector('.custom-icon')).toBeTruthy();
  });

  it('renders as a span element', () => {
    const { container } = render(Icon, {
      slots: { default: '<svg></svg>' },
    });
    expect(container.querySelector('span')).toBeTruthy();
  });
});

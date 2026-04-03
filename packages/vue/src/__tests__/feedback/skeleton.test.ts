import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Skeleton } from '../../components/feedback';

describe('Skeleton', () => {
  it('renders with skeleton class', () => {
    const { container } = render(Skeleton);
    expect(container.querySelector('.skeleton')).toBeTruthy();
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(Skeleton);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies width and height styles', () => {
    const { container } = render(Skeleton, {
      props: { width: '200px', height: '20px' },
    });
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('applies circle variant', () => {
    const { container } = render(Skeleton, {
      props: { circle: true, height: '48px' },
    });
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.style.width).toBe('48px');
    expect(el.style.height).toBe('48px');
  });

  it('applies circle variant with width only', () => {
    const { container } = render(Skeleton, {
      props: { circle: true, width: '64px' },
    });
    const el = container.firstElementChild as HTMLElement;
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('applies custom className', () => {
    const { container } = render(Skeleton, {
      props: { className: 'custom' },
    });
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('renders as a div element', () => {
    const { container } = render(Skeleton);
    expect(container.querySelector('div.skeleton')).toBeTruthy();
  });
});

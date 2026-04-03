import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Grid } from '../../components/layout';

describe('Grid', () => {
  it('renders with grid class', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } });
    expect(container.firstElementChild!.classList.contains('grid')).toBe(true);
  });

  it('applies column count class', () => {
    const { container } = render(Grid, {
      props: { cols: 3 },
      slots: { default: '<div>Item</div>' },
    });
    expect(container.firstElementChild!.classList.contains('grid-cols-3')).toBe(true);
  });

  it('applies responsive column classes', () => {
    const { container } = render(Grid, {
      props: { cols: 1, colsSm: 2, colsMd: 3, colsLg: 4, colsXl: 6 },
      slots: { default: '<div>Item</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('grid-cols-1')).toBe(true);
    expect(el.classList.contains('sm:grid-cols-2')).toBe(true);
    expect(el.classList.contains('md:grid-cols-3')).toBe(true);
    expect(el.classList.contains('lg:grid-cols-4')).toBe(true);
    expect(el.classList.contains('xl:grid-cols-6')).toBe(true);
  });

  it('applies default gap of 4', () => {
    const { container } = render(Grid, { slots: { default: '<div>Item</div>' } });
    expect(container.firstElementChild!.classList.contains('gap-4')).toBe(true);
  });

  it('uses axis-specific gap when gapX or gapY is set', () => {
    const { container } = render(Grid, {
      props: { gapX: 2, gapY: 8 },
      slots: { default: '<div>Item</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('gap-x-2')).toBe(true);
    expect(el.classList.contains('gap-y-8')).toBe(true);
    expect(el.classList.contains('gap-4')).toBe(false);
  });

  it('uses gapX only when gapY is not set', () => {
    const { container } = render(Grid, {
      props: { gapX: 6 },
      slots: { default: '<div>Item</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('gap-x-6')).toBe(true);
    expect(el.classList.contains('gap-y-4')).toBe(false);
  });

  it('uses gapY only when gapX is not set', () => {
    const { container } = render(Grid, {
      props: { gapY: 10 },
      slots: { default: '<div>Item</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('gap-y-10')).toBe(true);
    expect(el.classList.contains('gap-x-4')).toBe(false);
  });

  it('renders slot content', () => {
    const { container } = render(Grid, { slots: { default: '<span>Child</span>' } });
    expect(container.querySelector('span')?.textContent).toBe('Child');
  });
});

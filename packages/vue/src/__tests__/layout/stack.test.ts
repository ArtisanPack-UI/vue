import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Stack } from '../../components/layout';

describe('Stack', () => {
  it('renders with vertical direction by default', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } });
    const el = container.firstElementChild!;
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
  });

  it('renders with horizontal direction', () => {
    const { container } = render(Stack, {
      props: { direction: 'horizontal' },
      slots: { default: '<div>Item</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('flex-row')).toBe(true);
  });

  it('applies gap class', () => {
    const { container } = render(Stack, {
      props: { gap: 4 },
      slots: { default: '<div>Item</div>' },
    });
    expect(container.firstElementChild!.classList.contains('gap-4')).toBe(true);
  });

  it('applies default gap of 2', () => {
    const { container } = render(Stack, { slots: { default: '<div>Item</div>' } });
    expect(container.firstElementChild!.classList.contains('gap-2')).toBe(true);
  });

  it('applies alignment class', () => {
    const { container } = render(Stack, {
      props: { align: 'center' },
      slots: { default: '<div>Item</div>' },
    });
    expect(container.firstElementChild!.classList.contains('items-center')).toBe(true);
  });

  it('applies justify class', () => {
    const { container } = render(Stack, {
      props: { justify: 'between' },
      slots: { default: '<div>Item</div>' },
    });
    expect(container.firstElementChild!.classList.contains('justify-between')).toBe(true);
  });

  it('applies wrap class when wrap is true', () => {
    const { container } = render(Stack, {
      props: { wrap: true },
      slots: { default: '<div>Item</div>' },
    });
    expect(container.firstElementChild!.classList.contains('flex-wrap')).toBe(true);
  });

  it('renders slot content', () => {
    const { container } = render(Stack, { slots: { default: '<span>Child</span>' } });
    expect(container.querySelector('span')?.textContent).toBe('Child');
  });
});

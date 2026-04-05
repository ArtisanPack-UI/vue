import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent, h } from 'vue';
import { render, screen } from '@testing-library/vue';
import { useBreakpoint } from '../composables/use-breakpoint';

/**
 * Helper to create a test component that consumes useBreakpoint.
 */
function createBreakpointApp() {
  return defineComponent({
    setup() {
      const { current, isSm, isMd, isLg, isXl, is2xl } = useBreakpoint();
      return { current, isSm, isMd, isLg, isXl, is2xl };
    },
    render() {
      return h('div', [
        h('span', { 'data-testid': 'current' }, this.current),
        h('span', { 'data-testid': 'is-sm' }, String(this.isSm)),
        h('span', { 'data-testid': 'is-md' }, String(this.isMd)),
        h('span', { 'data-testid': 'is-lg' }, String(this.isLg)),
        h('span', { 'data-testid': 'is-xl' }, String(this.isXl)),
        h('span', { 'data-testid': 'is-2xl' }, String(this.is2xl)),
      ]);
    },
  });
}

describe('useBreakpoint', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should detect xs breakpoint for small viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });

    const App = createBreakpointApp();
    render(App);

    expect(screen.getByTestId('current').textContent).toBe('xs');
    expect(screen.getByTestId('is-sm').textContent).toBe('false');
    expect(screen.getByTestId('is-md').textContent).toBe('false');
  });

  it('should detect md breakpoint for medium viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

    const App = createBreakpointApp();
    render(App);

    expect(screen.getByTestId('current').textContent).toBe('md');
    expect(screen.getByTestId('is-sm').textContent).toBe('true');
    expect(screen.getByTestId('is-md').textContent).toBe('true');
    expect(screen.getByTestId('is-lg').textContent).toBe('false');
  });

  it('should detect lg breakpoint for large viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1100, writable: true });

    const App = createBreakpointApp();
    render(App);

    expect(screen.getByTestId('current').textContent).toBe('lg');
    expect(screen.getByTestId('is-sm').textContent).toBe('true');
    expect(screen.getByTestId('is-md').textContent).toBe('true');
    expect(screen.getByTestId('is-lg').textContent).toBe('true');
    expect(screen.getByTestId('is-xl').textContent).toBe('false');
  });

  it('should detect xl breakpoint for extra large viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true });

    const App = createBreakpointApp();
    render(App);

    expect(screen.getByTestId('current').textContent).toBe('xl');
    expect(screen.getByTestId('is-sm').textContent).toBe('true');
    expect(screen.getByTestId('is-md').textContent).toBe('true');
    expect(screen.getByTestId('is-lg').textContent).toBe('true');
    expect(screen.getByTestId('is-xl').textContent).toBe('true');
    expect(screen.getByTestId('is-2xl').textContent).toBe('false');
  });

  it('should detect 2xl breakpoint for widest viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1600, writable: true });

    const App = createBreakpointApp();
    render(App);

    expect(screen.getByTestId('current').textContent).toBe('2xl');
    expect(screen.getByTestId('is-sm').textContent).toBe('true');
    expect(screen.getByTestId('is-2xl').textContent).toBe('true');
  });
});

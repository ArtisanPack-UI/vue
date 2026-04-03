import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { ThemeToggle } from '../../components/utility';
import { provideTheme } from '../../composables/use-theme';

/** Wrapper that provides theme context for ThemeToggle. */
function renderWithTheme(props: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    setup() {
      provideTheme('light');
      return () => h(ThemeToggle, props);
    },
  });
  return render(Wrapper);
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Mock matchMedia for jsdom
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
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders a button', () => {
    renderWithTheme();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('has an accessible aria-label', () => {
    renderWithTheme();
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });

  it('cycles through light → dark → system on click', async () => {
    renderWithTheme();
    const button = screen.getByRole('button');

    // Initially light — label says "Switch to dark mode"
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');

    await fireEvent.click(button);
    expect(button.getAttribute('aria-label')).toBe('Switch to system mode');

    await fireEvent.click(button);
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('applies custom className', () => {
    const { container } = renderWithTheme({ className: 'custom-toggle' });
    expect(container.querySelector('.custom-toggle')).toBeTruthy();
  });

  it('applies size classes', () => {
    const { container } = renderWithTheme({ size: 'sm' });
    expect(container.querySelector('.btn-sm')).toBeTruthy();
  });

  it('persists preference to localStorage', async () => {
    renderWithTheme({ persist: true, storageKey: 'test-theme' });
    const button = screen.getByRole('button');

    await fireEvent.click(button);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-theme', 'dark');
  });

  it('restores preference from localStorage on mount', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('dark');
    renderWithTheme({ persist: true, storageKey: 'test-theme' });

    const button = screen.getByRole('button');
    // After onMounted restores 'dark', label should say "Switch to system mode"
    await waitFor(() => {
      expect(button.getAttribute('aria-label')).toBe('Switch to system mode');
    });
  });

  it('renders SVG icons inside the button', () => {
    const { container } = renderWithTheme();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('applies btn-ghost class', () => {
    const { container } = renderWithTheme();
    expect(container.querySelector('.btn-ghost')).toBeTruthy();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { render, screen } from '@testing-library/vue';
import { provideTheme, useTheme, type ColorScheme } from '../composables/use-theme';
import { createArtisanPackUI } from '../plugin';

/**
 * Helper component that provides and consumes the theme context.
 */
function createTestApp(defaultColorScheme?: ColorScheme) {
  const Child = defineComponent({
    setup() {
      const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();
      return { colorScheme, resolvedColorScheme, setColorScheme };
    },
    render() {
      return h('div', [
        h('span', { 'data-testid': 'color-scheme' }, this.colorScheme),
        h('span', { 'data-testid': 'resolved' }, this.resolvedColorScheme),
        h(
          'button',
          { 'data-testid': 'set-dark', onClick: () => this.setColorScheme('dark') },
          'Dark',
        ),
        h(
          'button',
          { 'data-testid': 'set-light', onClick: () => this.setColorScheme('light') },
          'Light',
        ),
        h(
          'button',
          { 'data-testid': 'set-system', onClick: () => this.setColorScheme('system') },
          'System',
        ),
      ]);
    },
  });

  return defineComponent({
    setup() {
      provideTheme(defaultColorScheme);
    },
    render() {
      return h(Child);
    },
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    // Mock matchMedia to return light mode by default
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

  it('should default to system color scheme', () => {
    const App = createTestApp();
    render(App);

    expect(screen.getByTestId('color-scheme').textContent).toBe('system');
  });

  it('should resolve system preference to light when OS prefers light', () => {
    const App = createTestApp('system');
    render(App);

    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('should resolve system preference to dark when OS prefers dark', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    const App = createTestApp('system');
    render(App);

    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('should allow setting color scheme to dark', async () => {
    const App = createTestApp();
    render(App);

    screen.getByTestId('set-dark').click();
    await nextTick();

    expect(screen.getByTestId('color-scheme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('should allow setting color scheme to light', async () => {
    const App = createTestApp('dark');
    render(App);

    screen.getByTestId('set-light').click();
    await nextTick();

    expect(screen.getByTestId('color-scheme').textContent).toBe('light');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('should accept a default color scheme', () => {
    const App = createTestApp('dark');
    render(App);

    expect(screen.getByTestId('color-scheme').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('should read plugin-level default when no argument is passed to provideTheme', () => {
    const injectedScheme = ref<string | undefined>(undefined);

    const Child = defineComponent({
      setup() {
        const { colorScheme } = useTheme();
        injectedScheme.value = colorScheme.value;
        return () => h('div');
      },
    });

    const Root = defineComponent({
      setup() {
        provideTheme(); // no explicit arg — should read plugin default
        return () => h(Child);
      },
    });

    const app = createApp(Root);
    app.use(createArtisanPackUI({ defaultColorScheme: 'dark' }));
    app.mount(document.createElement('div'));

    expect(injectedScheme.value).toBe('dark');

    app.unmount();
  });

  it('should throw when useTheme is called without provideTheme', () => {
    const BrokenChild = defineComponent({
      setup() {
        useTheme();
      },
      render() {
        return h('div');
      },
    });

    expect(() => render(BrokenChild)).toThrow(
      'useTheme() must be used within a component tree where provideTheme() has been called.',
    );
  });
});

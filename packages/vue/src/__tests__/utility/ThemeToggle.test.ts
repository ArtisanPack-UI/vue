import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { themeScript, type ThemeChoice } from '@artisanpack-ui/behavior';
import { ThemeScript, ThemeToggle } from '../../components/utility';
import { provideTheme, type ThemeContextValue } from '../../composables/use-theme';

/** Renders a toggle under a 2.x provideTheme() and hands back the provider. */
function renderUnderProvider(defaultScheme: 'light' | 'dark' | 'system') {
  let theme: ThemeContextValue | undefined;
  render(
    defineComponent({
      setup() {
        theme = provideTheme(defaultScheme);
        return () => h(ThemeToggle);
      },
    }),
  );
  return () => theme!;
}

let dark = false;
const listeners = new Set<() => void>();

beforeEach(() => {
  dark = false;
  listeners.clear();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return dark;
      },
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const radios = () => screen.getAllByRole('radio');
const checked = () => radios().find((radio) => radio.getAttribute('aria-checked') === 'true');

describe('ThemeToggle', () => {
  it('renders a radio group on the segmented tabs track, system checked by default', () => {
    const { container } = render(ThemeToggle, { props: { persist: false } });
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe('apui-theme-toggle apui-tabs');
    expect(root.getAttribute('data-variant')).toBe('segmented');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe('Theme');
    expect(radios().map((radio) => radio.textContent)).toEqual([
      'Light',
      'Dark',
      'High contrast',
      'System',
    ]);
    expect(checked()?.getAttribute('data-value')).toBe('system');
    expect(radios().filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
  });

  it('server-renders the checked choice', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(ThemeToggle, { modelValue: 'dark', choices: ['light', 'dark'] }),
      }),
    );
    expect(html).toContain('role="radiogroup"');
    expect(html).toMatch(/data-value="dark" aria-checked="true" tabindex="0"/);
  });

  it('applies, stores and reports a choice, and checks it when unbound', async () => {
    const { emitted } = render(ThemeToggle);
    await fireEvent.click(screen.getByRole('radio', { name: 'High contrast' }));
    expect(emitted()['update:modelValue']).toEqual([['high-contrast']]);
    expect(checked()?.getAttribute('data-value')).toBe('high-contrast');
    expect(document.documentElement.getAttribute('data-theme')).toBe('high-contrast');
    expect(localStorage.getItem('apui-theme')).toBe('high-contrast');
  });

  it('shows the stored choice and resolves system against the OS', async () => {
    localStorage.setItem('site-theme', 'light');
    dark = true;
    render(ThemeToggle, { props: { storageKey: 'site-theme' } });
    await nextTick();
    expect(checked()?.getAttribute('data-value')).toBe('light');
    await fireEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('site-theme')).toBe('system');
  });

  it('follows the OS live while it is system', async () => {
    render(ThemeToggle, { props: { modelValue: 'system', persist: false } });
    dark = true;
    listeners.forEach((listener) => listener());
    await nextTick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('binds with v-model and skips storage without persist', async () => {
    const theme = ref<ThemeChoice>('light');
    render(
      defineComponent({
        render: () =>
          h(ThemeToggle, {
            modelValue: theme.value,
            persist: false,
            'onUpdate:modelValue': (value: ThemeChoice) => (theme.value = value),
          }),
      }),
    );
    await fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(theme.value).toBe('dark');
    expect(checked()?.getAttribute('data-value')).toBe('dark');
    expect(localStorage.getItem('apui-theme')).toBeNull();
  });

  it('moves, checks and focuses with the arrow keys, following the text direction', async () => {
    render(ThemeToggle, { props: { persist: false } });
    const group = screen.getByRole('radiogroup');
    await fireEvent.keyDown(group, { key: 'Home' });
    expect(document.activeElement?.getAttribute('data-value')).toBe('light');
    await fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('data-value')).toBe('dark');

    // jsdom doesn't inherit direction from dir, so the group computes it itself.
    group.style.direction = 'rtl';
    await fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(document.activeElement?.getAttribute('data-value')).toBe('high-contrast');
  });

  it('keeps the names when only icons show', () => {
    const { container } = render(ThemeToggle, { props: { iconOnly: true, size: 'sm' } });
    expect(container.firstElementChild?.getAttribute('data-icon-only')).toBe('');
    expect(screen.getByRole('radio', { name: 'High contrast' })).toBeTruthy();
    expect(container.querySelectorAll('.apui-sr-only')).toHaveLength(4);
  });

  it('is an icon button that switches light and dark', async () => {
    render(ThemeToggle, { props: { variant: 'icon', persist: false, modelValue: 'light' } });
    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.getAttribute('data-icon-only')).toBe('');
    await fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('opens a menu of radio items with system last', async () => {
    const { emitted } = render(ThemeToggle, {
      props: { variant: 'menu', size: 'sm', modelValue: 'dark' },
    });
    const trigger = screen.getByRole('button', { name: 'Theme' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('data-size')).toBe('sm');
    await fireEvent.click(trigger);
    await nextTick();
    const items = screen.getAllByRole('menuitemradio', { hidden: true });
    expect(items.map((item) => item.textContent)).toEqual([
      'Light',
      'Dark',
      'High contrast',
      'Match system',
    ]);
    expect(items[1]!.getAttribute('aria-checked')).toBe('true');
    expect(items[3]!.previousElementSibling?.getAttribute('data-part')).toBe('separator');
    await fireEvent.click(items[2]!);
    expect(emitted()['update:modelValue']).toEqual([['high-contrast']]);
  });

  it('drives a 2.x provideTheme(): seeds from it, sets it on a pick, follows it', async () => {
    const theme = renderUnderProvider('dark');
    await nextTick();
    expect(checked()?.getAttribute('data-value')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await fireEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(theme().colorScheme.value).toBe('system');

    // High contrast is a light theme to a provider that only knows light and dark.
    await fireEvent.click(screen.getByRole('radio', { name: 'High contrast' }));
    expect(theme().colorScheme.value).toBe('light');
    await nextTick();
    expect(checked()?.getAttribute('data-value')).toBe('high-contrast');

    theme().setColorScheme('dark');
    await nextTick();
    expect(checked()?.getAttribute('data-value')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('apui-theme')).toBe('dark');
  });

  it('pushes a stored choice into the provider', async () => {
    localStorage.setItem('apui-theme', 'light');
    const theme = renderUnderProvider('dark');
    await nextTick();
    expect(checked()?.getAttribute('data-value')).toBe('light');
    expect(theme().colorScheme.value).toBe('light');
  });

  it('works without a provider', () => {
    expect(() => render(ThemeToggle, { props: { variant: 'icon' } })).not.toThrow();
  });

  it('takes translated labels', () => {
    render(ThemeToggle, { props: { label: 'Tema', lightLabel: 'Claro', systemLabel: 'Sistema' } });
    expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe('Tema');
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Sistema' })).toBeTruthy();
  });
});

describe('ThemeScript', () => {
  it('renders the blocking head snippet', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(ThemeScript, { storageKey: 'site-theme', defaultValue: 'dark', nonce: 'abc' }),
      }),
    );
    expect(html).toBe(
      `<script nonce="abc">${themeScript({ storageKey: 'site-theme', defaultValue: 'dark' })}</script>`,
    );
  });

  it('runs when client-rendered: Vue creates and inserts the script element', () => {
    // Unlike React, which inserts client-rendered scripts inert, so its
    // ThemeScript needs a mount fallback.
    localStorage.setItem('site-theme', 'high-contrast');
    render(ThemeScript, { props: { storageKey: 'site-theme' } });
    expect(document.documentElement.getAttribute('data-theme')).toBe('high-contrast');
  });
});

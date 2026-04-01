import { describe, it, expect } from 'vitest';
import { createApp, defineComponent, h } from 'vue';
import { createArtisanPackUI } from '../plugin';

describe('createArtisanPackUI', () => {
  it('should return a valid Vue plugin', () => {
    const plugin = createArtisanPackUI();
    expect(plugin).toBeDefined();
    expect(typeof plugin.install).toBe('function');
  });

  it('should install without errors on a Vue app', () => {
    const app = createApp(defineComponent({ render: () => h('div') }));
    const plugin = createArtisanPackUI();

    expect(() => app.use(plugin)).not.toThrow();
  });

  it('should register components globally with the configured prefix', () => {
    const MockButton = defineComponent({
      render: () => h('button', 'mock'),
    });

    const app = createApp(defineComponent({ render: () => h('div') }));
    const plugin = createArtisanPackUI({
      prefix: 'Ap',
      components: { Button: MockButton },
    });

    app.use(plugin);

    // Vue stores registered components internally; verify it was registered
    expect(app.component('ApButton')).toBe(MockButton);
  });

  it('should use custom prefix for component registration', () => {
    const MockCard = defineComponent({
      render: () => h('div', 'card'),
    });

    const app = createApp(defineComponent({ render: () => h('div') }));
    const plugin = createArtisanPackUI({
      prefix: 'Ui',
      components: { Card: MockCard },
    });

    app.use(plugin);

    expect(app.component('UiCard')).toBe(MockCard);
  });

  it('should not register any components when none are provided', () => {
    const app = createApp(defineComponent({ render: () => h('div') }));
    const plugin = createArtisanPackUI();

    // Should install without any global components
    expect(() => app.use(plugin)).not.toThrow();
  });

  it('should provide the default color scheme', () => {
    const app = createApp(defineComponent({ render: () => h('div') }));
    const plugin = createArtisanPackUI({ defaultColorScheme: 'dark' });

    app.use(plugin);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provides = (app as any)._context.provides;
    expect(provides['artisanpack-default-color-scheme']).toBe('dark');
  });
});

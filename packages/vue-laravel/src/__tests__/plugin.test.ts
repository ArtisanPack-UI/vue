import { describe, it, expect, vi } from 'vitest';
import { createApp, defineComponent } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
  Link: { name: 'InertiaLink', template: '<a><slot /></a>' },
  Head: { name: 'InertiaHead', template: '<div />' },
  usePage: () => ({ props: {} }),
  useForm: vi.fn(() => ({
    processing: false,
    recentlySuccessful: false,
    isDirty: false,
    errors: {},
    reset: vi.fn(),
    clearErrors: vi.fn(),
    submit: vi.fn(),
  })),
  router: { visit: vi.fn() },
}));

vi.mock('@artisanpack-ui/vue', () => ({
  useToast: () => ({
    show: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  }),
  Menu: { name: 'Menu', template: '<ul><slot /></ul>' },
  Breadcrumbs: { name: 'Breadcrumbs', template: '<nav><slot /></nav>' },
  Pagination: { name: 'Pagination', template: '<nav><slot /></nav>' },
  Input: { name: 'Input', template: '<input />' },
  Select: { name: 'Select', template: '<select><slot /></select>' },
  Textarea: { name: 'Textarea', template: '<textarea />' },
  Checkbox: { name: 'Checkbox', template: '<input type="checkbox" />' },
  Toggle: { name: 'Toggle', template: '<input type="checkbox" />' },
  Password: { name: 'Password', template: '<input type="password" />' },
  Radio: { name: 'Radio', template: '<div />' },
  Alert: { name: 'Alert', template: '<div role="alert"><slot /></div>' },
}));

import { createArtisanPackUILaravel } from '../plugin';

describe('createArtisanPackUILaravel', () => {
  it('returns a Vue plugin with install method', () => {
    const plugin = createArtisanPackUILaravel();
    expect(plugin).toBeDefined();
    expect(typeof plugin.install).toBe('function');
  });

  it('registers components with default Ap prefix', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    const plugin = createArtisanPackUILaravel();

    app.use(plugin);

    // Check a few key components are registered
    expect(app.component('ApInertiaInput')).toBeDefined();
    expect(app.component('ApInertiaMenu')).toBeDefined();
    expect(app.component('ApFlashAlerts')).toBeDefined();
    expect(app.component('ApAppLayout')).toBeDefined();
  });

  it('registers components with custom prefix', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    const plugin = createArtisanPackUILaravel({ prefix: 'My' });

    app.use(plugin);

    expect(app.component('MyInertiaInput')).toBeDefined();
    expect(app.component('MyFlashAlerts')).toBeDefined();
  });

  it('registers all expected components', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    app.use(createArtisanPackUILaravel());

    const expectedNames = [
      'ApInertiaMenu',
      'ApInertiaBreadcrumbs',
      'ApInertiaPagination',
      'ApInertiaForm',
      'ApInertiaInput',
      'ApInertiaSelect',
      'ApInertiaTextarea',
      'ApInertiaCheckbox',
      'ApInertiaToggle',
      'ApInertiaPassword',
      'ApInertiaRadio',
      'ApAppLayout',
      'ApAuthLayout',
      'ApGuestLayout',
      'ApFlashAlerts',
      'ApFlashToasts',
    ];

    for (const name of expectedNames) {
      expect(app.component(name)).toBeDefined();
    }
  });
});

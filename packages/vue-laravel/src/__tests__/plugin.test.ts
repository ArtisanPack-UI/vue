import { describe, it, expect, vi } from 'vitest';
import { createApp, defineComponent, inject } from 'vue';

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
  RadioGroup: { name: 'RadioGroup', template: '<fieldset />' },
  Stack: { name: 'Stack', template: '<div><slot /></div>' },
  BreadcrumbsItem: { name: 'BreadcrumbsItem', template: '<li><slot /></li>' },
  Toaster: { name: 'Toaster', template: '<div />' },
  toast: { create: vi.fn() },
}));

import { createArtisanPackUILaravel } from '../plugin';
import * as exported from '../components';
import { FLASH_COLOR_MAP_KEY } from '../composables/useFlashMessages';

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
      'ApInertiaRadioGroup',
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

  it('registers every exported component', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    app.use(createArtisanPackUILaravel());

    const componentNames = Object.entries(exported)
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([name]) => name);

    expect(componentNames).toContain('InertiaRadioGroup');
    for (const name of componentNames) {
      expect(app.component(`Ap${name}`), name).toBe(exported[name as keyof typeof exported]);
    }
  });

  it('provides flashColorMap to the flash composable', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    app.use(createArtisanPackUILaravel({ flashColorMap: { status: 'success' } }));

    expect(app.runWithContext(() => inject(FLASH_COLOR_MAP_KEY))).toEqual({ status: 'success' });
  });

  it('provides no flash color map without the option', () => {
    const app = createApp(defineComponent({ template: '<div />' }));
    app.use(createArtisanPackUILaravel());

    expect(app.runWithContext(() => inject(FLASH_COLOR_MAP_KEY, null))).toBeNull();
  });
});

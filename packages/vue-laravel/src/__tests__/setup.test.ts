import { describe, it, expect, vi } from 'vitest';

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

describe('vue-laravel package setup', () => {
  it('should have a valid module entry point', async () => {
    const mod = await import('../index');
    expect(mod).toBeDefined();
  });

  it('should export composables', async () => {
    const mod = await import('../index');
    expect(mod.useInertiaForm).toBeDefined();
    expect(typeof mod.useInertiaForm).toBe('function');
    expect(mod.useFlashMessages).toBeDefined();
    expect(typeof mod.useFlashMessages).toBe('function');
    expect(mod.useAuth).toBeDefined();
    expect(typeof mod.useAuth).toBe('function');
  });

  it('should export the plugin factory', async () => {
    const mod = await import('../index');
    expect(mod.createArtisanPackUILaravel).toBeDefined();
    expect(typeof mod.createArtisanPackUILaravel).toBe('function');
  });

  it('should export navigation components', async () => {
    const mod = await import('../index');
    expect(mod.InertiaMenu).toBeDefined();
    expect(mod.InertiaBreadcrumbs).toBeDefined();
    expect(mod.InertiaPagination).toBeDefined();
  });

  it('should export form components', async () => {
    const mod = await import('../index');
    expect(mod.InertiaForm).toBeDefined();
    expect(mod.InertiaInput).toBeDefined();
    expect(mod.InertiaSelect).toBeDefined();
    expect(mod.InertiaTextarea).toBeDefined();
    expect(mod.InertiaCheckbox).toBeDefined();
    expect(mod.InertiaToggle).toBeDefined();
    expect(mod.InertiaPassword).toBeDefined();
    expect(mod.InertiaRadio).toBeDefined();
    expect(mod.INERTIA_FORM_KEY).toBeDefined();
  });

  it('should export layout components', async () => {
    const mod = await import('../index');
    expect(mod.AppLayout).toBeDefined();
    expect(mod.AuthLayout).toBeDefined();
    expect(mod.GuestLayout).toBeDefined();
  });

  it('should export feedback components', async () => {
    const mod = await import('../index');
    expect(mod.FlashAlerts).toBeDefined();
    expect(mod.FlashToasts).toBeDefined();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp, defineComponent, effectScope, reactive } from 'vue';
import type { EffectScope } from 'vue';
import type { ToasterInstance } from '@artisanpack-ui/vue';

const mockToast = vi.hoisted(() => ({
  store: {},
  create: vi.fn(() => 'toast-1'),
  update: vi.fn(),
  dismiss: vi.fn(),
  remove: vi.fn(),
}));

const mockPageProps = reactive({
  auth: { user: null },
  flash: {} as Record<string, string | undefined>,
  errors: {},
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({
    props: mockPageProps,
  }),
}));

vi.mock('@artisanpack-ui/vue', () => ({
  toast: mockToast,
}));

import { useFlashMessages } from '../../composables/useFlashMessages';
import { createArtisanPackUILaravel } from '../../plugin';

describe('useFlashMessages', () => {
  let scope: EffectScope;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPageProps.flash = {};
    scope = effectScope();
  });

  afterEach(() => {
    scope.stop();
  });

  it('creates a success toast with toast.create() for a flash success message', () => {
    mockPageProps.flash = { success: 'Item created' };
    scope.run(() => useFlashMessages());

    expect(mockToast.create).toHaveBeenCalledWith({
      title: 'Item created',
      color: 'success',
      duration: 5000,
    });
  });

  it('creates an error toast for a flash error message', () => {
    mockPageProps.flash = { error: 'Something went wrong' };
    scope.run(() => useFlashMessages());
    expect(mockToast.create).toHaveBeenCalledWith({
      title: 'Something went wrong',
      color: 'error',
      duration: 5000,
    });
  });

  it('creates a toast per flash message, and again when the flash props change', async () => {
    mockPageProps.flash = { success: 'Saved', warning: 'Low disk space' };
    scope.run(() => useFlashMessages());
    expect(mockToast.create).toHaveBeenCalledTimes(2);

    mockPageProps.flash = { info: 'Next page' };
    await Promise.resolve();
    expect(mockToast.create).toHaveBeenCalledTimes(3);
    expect(mockToast.create).toHaveBeenLastCalledWith({
      title: 'Next page',
      color: 'info',
      duration: 5000,
    });
  });

  it('skips empty flash values', () => {
    mockPageProps.flash = { success: '', error: undefined };
    scope.run(() => useFlashMessages());
    expect(mockToast.create).not.toHaveBeenCalled();
  });

  it('uses a custom duration', () => {
    mockPageProps.flash = { info: 'Note' };
    scope.run(() => useFlashMessages({ duration: 3000 }));
    expect(mockToast.create).toHaveBeenCalledWith({ title: 'Note', color: 'info', duration: 3000 });
  });

  it('uses a custom color map, keeping the defaults for keys it leaves out', () => {
    mockPageProps.flash = { notice: 'Hey there', success: 'Saved' };
    scope.run(() => useFlashMessages({ colorMap: { notice: 'warning' } }));
    expect(mockToast.create).toHaveBeenCalledWith({
      title: 'Hey there',
      color: 'warning',
      duration: 5000,
    });
    expect(mockToast.create).toHaveBeenCalledWith({
      title: 'Saved',
      color: 'success',
      duration: 5000,
    });
  });

  it('defaults to info for unknown flash keys', () => {
    mockPageProps.flash = { custom: 'Something custom' };
    scope.run(() => useFlashMessages());
    expect(mockToast.create).toHaveBeenCalledWith({
      title: 'Something custom',
      color: 'info',
      duration: 5000,
    });
  });

  it('does nothing when flash is undefined', () => {
    (mockPageProps as Record<string, unknown>).flash = undefined;
    scope.run(() => useFlashMessages());
    expect(mockToast.create).not.toHaveBeenCalled();
  });

  it('sends the toasts to a given toaster instead of the page toast', () => {
    const toaster = { ...mockToast, create: vi.fn(() => 'own-1') } as unknown as ToasterInstance;
    mockPageProps.flash = { success: 'Saved' };
    let result: ReturnType<typeof useFlashMessages> | undefined;
    scope.run(() => {
      result = useFlashMessages({ toaster });
    });
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'Saved',
      color: 'success',
      duration: 5000,
    });
    expect(mockToast.create).not.toHaveBeenCalled();
    expect(result!.toast).toBe(toaster);
  });

  it('returns the toaster it uses', () => {
    let result: ReturnType<typeof useFlashMessages> | undefined;
    scope.run(() => {
      result = useFlashMessages();
    });
    expect(result!.toast).toBe(mockToast);
  });

  describe("with the plugin's flashColorMap", () => {
    function mountWith(
      pluginMap: Record<string, string> | undefined,
      options?: Parameters<typeof useFlashMessages>[0],
    ) {
      const app = createApp(
        defineComponent({
          setup() {
            useFlashMessages(options);
            return () => null;
          },
        }),
      );
      app.use(
        createArtisanPackUILaravel(
          pluginMap
            ? {
                flashColorMap: pluginMap as Record<
                  string,
                  'success' | 'warning' | 'error' | 'info'
                >,
              }
            : {},
        ),
      );
      app.mount(document.createElement('div'));
      return app;
    }

    it('colors flash keys from the plugin option', () => {
      mockPageProps.flash = { status: 'Profile updated', error: 'Nope' };
      const app = mountWith({ status: 'success', error: 'warning' });
      expect(mockToast.create).toHaveBeenCalledWith({
        title: 'Profile updated',
        color: 'success',
        duration: 5000,
      });
      expect(mockToast.create).toHaveBeenCalledWith({
        title: 'Nope',
        color: 'warning',
        duration: 5000,
      });
      app.unmount();
    });

    it("lets the composable's own colorMap win over the plugin's", () => {
      mockPageProps.flash = { status: 'Profile updated' };
      const app = mountWith({ status: 'success' }, { colorMap: { status: 'accent' } });
      expect(mockToast.create).toHaveBeenCalledWith({
        title: 'Profile updated',
        color: 'accent',
        duration: 5000,
      });
      app.unmount();
    });
  });
});

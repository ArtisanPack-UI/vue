import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reactive } from 'vue';

const mockToast = {
  show: vi.fn(() => 'toast-1'),
  success: vi.fn(() => 'toast-2'),
  error: vi.fn(() => 'toast-3'),
  warning: vi.fn(() => 'toast-4'),
  info: vi.fn(() => 'toast-5'),
  dismiss: vi.fn(),
  dismissAll: vi.fn(),
};

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
  useToast: () => mockToast,
}));

import { useFlashMessages } from '../../composables/useFlashMessages';

describe('useFlashMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPageProps.flash = {};
  });

  it('shows a success toast for flash success message', async () => {
    mockPageProps.flash = { success: 'Item created' };
    useFlashMessages();

    // The watcher fires immediately
    expect(mockToast.show).toHaveBeenCalledWith({
      message: 'Item created',
      color: 'success',
      duration: 5000,
    });
  });

  it('shows an error toast for flash error message', () => {
    mockPageProps.flash = { error: 'Something went wrong' };
    useFlashMessages();
    expect(mockToast.show).toHaveBeenCalledWith({
      message: 'Something went wrong',
      color: 'error',
      duration: 5000,
    });
  });

  it('shows multiple toasts for multiple flash messages', () => {
    mockPageProps.flash = { success: 'Saved', warning: 'Low disk space' };
    useFlashMessages();
    expect(mockToast.show).toHaveBeenCalledTimes(2);
  });

  it('skips empty flash values', () => {
    mockPageProps.flash = { success: '', error: undefined };
    useFlashMessages();
    expect(mockToast.show).not.toHaveBeenCalled();
  });

  it('uses custom duration', () => {
    mockPageProps.flash = { info: 'Note' };
    useFlashMessages({ duration: 3000 });
    expect(mockToast.show).toHaveBeenCalledWith({
      message: 'Note',
      color: 'info',
      duration: 3000,
    });
  });

  it('uses custom color map', () => {
    mockPageProps.flash = { notice: 'Hey there' };
    useFlashMessages({ colorMap: { notice: 'warning' } });
    expect(mockToast.show).toHaveBeenCalledWith({
      message: 'Hey there',
      color: 'warning',
      duration: 5000,
    });
  });

  it('defaults to info for unknown flash keys', () => {
    mockPageProps.flash = { custom: 'Something custom' };
    useFlashMessages();
    expect(mockToast.show).toHaveBeenCalledWith({
      message: 'Something custom',
      color: 'info',
      duration: 5000,
    });
  });

  it('does nothing when flash is undefined', () => {
    (mockPageProps as Record<string, unknown>).flash = undefined;
    useFlashMessages();
    expect(mockToast.show).not.toHaveBeenCalled();
  });

  it('returns the toast API', () => {
    const { toast } = useFlashMessages();
    expect(toast).toBe(mockToast);
  });
});

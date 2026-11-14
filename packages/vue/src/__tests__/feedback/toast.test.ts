/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import { ToastMessage, ToastProvider, Toaster, toast } from '../../components/feedback';
import { useToast } from '../../components/feedback/ToastProvider/use-toast';
import { defaultToaster } from '../../components/feedback/Toast/toaster';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="toast"][data-part="${name}"]`);
const toasts = () => [...document.body.querySelectorAll<HTMLElement>('.apui-toast')];
const titles = () => toasts().map((el) => partOf('title', el)!.textContent?.trim());

/** Dismissal waits out Zag's exit delay; allow for a busy test run. */
const REMOVAL = { timeout: 5000 };

/** Lets the machines' effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

/**
 * Test helper component that consumes the toast API and exposes buttons
 * for triggering each toast variant.
 */
const TestConsumer = defineComponent({
  setup() {
    const api = useToast();
    return { api };
  },
  render() {
    return h('div', [
      h('button', { onClick: () => this.api.success('Saved!') }, 'Success'),
      h('button', { onClick: () => this.api.error('Failed!') }, 'Error'),
      h('button', { onClick: () => this.api.warning('Careful!') }, 'Warning'),
      h('button', { onClick: () => this.api.info('FYI!') }, 'Info'),
      h('button', { onClick: () => this.api.show({ message: 'Brief', duration: 50 }) }, 'Brief'),
      h(
        'button',
        { onClick: () => this.api.show({ message: 'Custom', duration: 0 }) },
        'Persistent',
      ),
      h('button', { onClick: () => this.api.dismissAll() }, 'Dismiss All'),
    ]);
  },
});

function renderWithProvider(
  providerProps: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) {
  return render(ToastProvider, {
    props: providerProps,
    attrs,
    slots: { default: () => h(TestConsumer) },
  });
}

describe('ToastProvider (deprecated alias on Toaster)', () => {
  afterEach(() => {
    toast.remove();
    defaultToaster.remove();
  });

  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderWithProvider();
    renderWithProvider();
    const calls = warn.mock.calls.filter(([m]) => String(m).includes('ToastProvider'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('ToastProvider is deprecated; use Toaster and toast.create().');
    warn.mockRestore();
  });

  it('throws when useToast is used outside provider', () => {
    expect(() => {
      const Bad = defineComponent({
        setup() {
          useToast();
          return () => null;
        },
      });
      render(Bad);
    }).toThrow('useToast must be used within a ToastProvider');
  });

  it('renders the design-system Toaster region, with no DaisyUI markup', () => {
    renderWithProvider();
    const region = partOf('group')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toContain('Notifications');
    expect(region.getAttribute('data-placement')).toBe('bottom-end');
    expect(document.body.querySelector('.toast, .alert, .btn')).toBeNull();
  });

  it('shows design-system toasts in each color from the 2.x helpers', async () => {
    renderWithProvider();
    for (const name of ['Success', 'Error', 'Warning', 'Info']) {
      await fireEvent.click(screen.getByText(name));
    }
    await settle();
    const byTitle = Object.fromEntries(
      toasts().map((el) => [partOf('title', el)!.textContent?.trim(), el]),
    );
    expect(byTitle['Saved!']!.getAttribute('data-color')).toBe('success');
    expect(byTitle['Failed!']!.getAttribute('data-color')).toBe('error');
    expect(byTitle['Failed!']!.getAttribute('role')).toBe('alert');
    expect(byTitle['Careful!']!.getAttribute('data-color')).toBe('warning');
    expect(byTitle['FYI!']!.getAttribute('data-color')).toBe('info');
    expect(byTitle['FYI!']!.getAttribute('role')).toBe('status');
  });

  it('keeps its toasts to itself, away from the page toast', async () => {
    render(Toaster);
    renderWithProvider();
    await fireEvent.click(screen.getByText('Persistent'));
    await settle();
    expect(titles()).toEqual(['Custom']);
    expect(defaultToaster.store.getVisibleToasts()).toHaveLength(0);
  });

  it('auto-dismisses after the toast duration', async () => {
    renderWithProvider();
    await fireEvent.click(screen.getByText('Brief'));
    await settle();
    expect(titles()).toEqual(['Brief']);
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('dismisses a toast from its close button and all of them with dismissAll', async () => {
    renderWithProvider();
    await fireEvent.click(screen.getByText('Persistent'));
    await settle();
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);

    await fireEvent.click(screen.getByText('Persistent'));
    await fireEvent.click(screen.getByText('Persistent'));
    await settle();
    expect(toasts()).toHaveLength(2);
    await fireEvent.click(screen.getByText('Dismiss All'));
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('maps max and the 2.x position classes, and passes Toaster props through', async () => {
    renderWithProvider(
      { max: 1, position: ['toast-start', 'toast-top'] },
      { label: 'Alerts', closeLabel: 'Fermer' },
    );
    const region = partOf('group')!;
    expect(region.getAttribute('data-placement')).toBe('top-start');
    expect(region.getAttribute('aria-label')).toContain('Alerts');
    await fireEvent.click(screen.getByText('Persistent'));
    await fireEvent.click(screen.getByText('Persistent'));
    await settle();
    expect(toasts()).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
  });

  it('maps toast-center to a centered placement', () => {
    renderWithProvider({ position: ['toast-center', 'toast-bottom'] });
    expect(partOf('group')!.getAttribute('data-placement')).toBe('bottom');
  });
});

describe('ToastMessage (deprecated alias of Toast)', () => {
  it('renders a static Toast from a 2.x item and emits dismiss with its id', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, emitted } = render(ToastMessage, {
      props: { toast: { id: 'toast-7', message: 'Upload failed', color: 'error' } },
    });
    expect(warn.mock.calls.some(([m]) => String(m).includes('ToastMessage is deprecated'))).toBe(
      true,
    );
    warn.mockRestore();
    const root = container.querySelector<HTMLElement>('.apui-toast')!;
    expect(root.getAttribute('data-color')).toBe('error');
    expect(root.getAttribute('role')).toBe('alert');
    expect(partOf('title', root)!.textContent?.trim()).toBe('Upload failed');
    expect(container.querySelector('.alert, .btn')).toBeNull();
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(emitted()['dismiss']).toEqual([['toast-7']]);
  });
});

/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { ToastProvider } from '../../components/feedback';
import { useToast } from '../../components/feedback/Toast/use-toast';

/**
 * Test helper component that consumes the toast API and exposes buttons
 * for triggering each toast variant.
 */
const TestConsumer = defineComponent({
  setup() {
    const toast = useToast();
    return { toast };
  },
  render() {
    return h('div', [
      h('button', { onClick: () => this.toast.success('Saved!') }, 'Success'),
      h('button', { onClick: () => this.toast.error('Failed!') }, 'Error'),
      h('button', { onClick: () => this.toast.warning('Careful!') }, 'Warning'),
      h('button', { onClick: () => this.toast.info('FYI!') }, 'Info'),
      h(
        'button',
        { onClick: () => this.toast.show({ message: 'Custom', duration: 0 }) },
        'Persistent',
      ),
      h('button', { onClick: () => this.toast.dismissAll() }, 'Dismiss All'),
    ]);
  },
});

function renderWithProvider(providerProps: Record<string, unknown> = {}) {
  return render(ToastProvider, {
    props: providerProps,
    slots: {
      default: () => h(TestConsumer),
    },
  });
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('shows a success toast', async () => {
    renderWithProvider();
    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeTruthy();
  });

  it('applies correct color class for each variant', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!').closest('.alert')?.classList.contains('alert-success')).toBe(
      true,
    );

    await fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Failed!').closest('.alert')?.classList.contains('alert-error')).toBe(
      true,
    );

    await fireEvent.click(screen.getByText('Warning'));
    expect(
      screen.getByText('Careful!').closest('.alert')?.classList.contains('alert-warning'),
    ).toBe(true);

    await fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('FYI!').closest('.alert')?.classList.contains('alert-info')).toBe(true);
  });

  it('uses role="alert" for warning/error and role="status" for info/success', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Failed!').closest('.alert')?.getAttribute('role')).toBe('alert');

    await fireEvent.click(screen.getByText('Warning'));
    expect(screen.getByText('Careful!').closest('.alert')?.getAttribute('role')).toBe('alert');

    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!').closest('.alert')?.getAttribute('role')).toBe('status');

    await fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('FYI!').closest('.alert')?.getAttribute('role')).toBe('status');
  });

  it('auto-dismisses after default duration', async () => {
    renderWithProvider({ defaultDuration: 1000 });

    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeTruthy();

    vi.advanceTimersByTime(1000);
    await vi.waitFor(() => {
      expect(screen.queryByText('Saved!')).toBeFalsy();
    });
  });

  it('uses 5000ms as default auto-dismiss duration', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeTruthy();

    vi.advanceTimersByTime(4999);
    expect(screen.getByText('Saved!')).toBeTruthy();

    vi.advanceTimersByTime(1);
    await vi.waitFor(() => {
      expect(screen.queryByText('Saved!')).toBeFalsy();
    });
  });

  it('does not auto-dismiss when duration is 0', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Persistent'));
    expect(screen.getByText('Custom')).toBeTruthy();

    vi.advanceTimersByTime(10000);
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  it('dismisses individual toast via close button', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Saved!')).toBeTruthy();

    await fireEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(screen.queryByText('Saved!')).toBeFalsy();
  });

  it('dismisses all toasts', async () => {
    renderWithProvider({ defaultDuration: 0 });

    await fireEvent.click(screen.getByText('Success'));
    await fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Saved!')).toBeTruthy();
    expect(screen.getByText('Failed!')).toBeTruthy();

    await fireEvent.click(screen.getByText('Dismiss All'));
    expect(screen.queryByText('Saved!')).toBeFalsy();
    expect(screen.queryByText('Failed!')).toBeFalsy();
  });

  it('respects max toast limit', async () => {
    renderWithProvider({ max: 2, defaultDuration: 0 });

    await fireEvent.click(screen.getByText('Success'));
    await fireEvent.click(screen.getByText('Error'));
    await fireEvent.click(screen.getByText('Warning'));

    expect(screen.queryByText('Saved!')).toBeFalsy();
    expect(screen.getByText('Failed!')).toBeTruthy();
    expect(screen.getByText('Careful!')).toBeTruthy();
  });

  it('renders toast container with aria-live and accessible name', async () => {
    renderWithProvider();

    await fireEvent.click(screen.getByText('Success'));
    const container = screen.getByRole('log');
    expect(container.getAttribute('aria-live')).toBe('polite');
    expect(container.getAttribute('aria-label')).toBe('Notifications');
  });

  it('does not render toast container when empty', () => {
    renderWithProvider();
    expect(screen.queryByRole('log')).toBeFalsy();
  });
});

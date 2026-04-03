import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Alert } from '../../components/feedback';

describe('Alert', () => {
  it('renders slot content', () => {
    render(Alert, { slots: { default: 'Something happened' } });
    expect(screen.getByText('Something happened')).toBeTruthy();
  });

  it('has role="alert"', () => {
    render(Alert, { slots: { default: 'Message' } });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('applies color class', () => {
    const { container } = render(Alert, {
      props: { color: 'success' },
      slots: { default: 'Done' },
    });
    expect(container.querySelector('.alert-success')).toBeTruthy();
  });

  it('applies all color variants', () => {
    const colors = ['info', 'success', 'warning', 'error'] as const;
    colors.forEach((color) => {
      const { container, unmount } = render(Alert, {
        props: { color },
        slots: { default: 'Test' },
      });
      expect(container.querySelector(`.alert-${color}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders icon slot when provided', () => {
    render(Alert, {
      slots: {
        default: 'Message',
        icon: '<span data-testid="icon">!</span>',
      },
    });
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('does not show dismiss button by default', () => {
    render(Alert, { slots: { default: 'Message' } });
    expect(screen.queryByLabelText('Dismiss alert')).toBeFalsy();
  });

  it('shows dismiss button when dismissible', () => {
    render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Message' },
    });
    expect(screen.getByLabelText('Dismiss alert')).toBeTruthy();
  });

  it('hides alert when dismissed (uncontrolled)', async () => {
    render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Message' },
    });
    await fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(screen.queryByRole('alert')).toBeFalsy();
  });

  it('emits dismiss event when dismissed', async () => {
    const { emitted } = render(Alert, {
      props: { dismissible: true },
      slots: { default: 'Message' },
    });
    await fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(emitted().dismiss).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Alert, {
      props: { className: 'custom-class' },
      slots: { default: 'Message' },
    });
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('uses polite aria-live for info and success', () => {
    const { unmount } = render(Alert, {
      props: { color: 'info' },
      slots: { default: 'Message' },
    });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('polite');
    unmount();

    render(Alert, {
      props: { color: 'success' },
      slots: { default: 'Message' },
    });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('polite');
  });

  it('uses assertive aria-live for warning and error', () => {
    const { unmount } = render(Alert, {
      props: { color: 'warning' },
      slots: { default: 'Message' },
    });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
    unmount();

    render(Alert, {
      props: { color: 'error' },
      slots: { default: 'Message' },
    });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
  });

  it('defaults to polite aria-live without color', () => {
    render(Alert, { slots: { default: 'Message' } });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('polite');
  });

  it('supports controlled visible prop', async () => {
    const { rerender } = render(Alert, {
      props: { visible: true },
      slots: { default: 'Controlled' },
    });
    expect(screen.getByText('Controlled')).toBeTruthy();

    await rerender({ visible: false });
    expect(screen.queryByRole('alert')).toBeFalsy();
  });

  it('does not hide internally when controlled and dismissed', async () => {
    const { emitted } = render(Alert, {
      props: { visible: true, dismissible: true },
      slots: { default: 'Controlled' },
    });
    await fireEvent.click(screen.getByLabelText('Dismiss alert'));
    expect(emitted().dismiss).toBeTruthy();
    // Still visible because parent controls visibility
    expect(screen.getByText('Controlled')).toBeTruthy();
  });
});

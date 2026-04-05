import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { ErrorDisplay } from '../../components/feedback';

describe('ErrorDisplay', () => {
  it('renders default title', () => {
    render(ErrorDisplay);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('renders custom title', () => {
    render(ErrorDisplay, { props: { title: '404 Not Found' } });
    expect(screen.getByText('404 Not Found')).toBeTruthy();
  });

  it('renders message', () => {
    render(ErrorDisplay, { props: { message: 'Please try again later' } });
    expect(screen.getByText('Please try again later')).toBeTruthy();
  });

  it('has role="alert"', () => {
    render(ErrorDisplay);
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders icon slot', () => {
    render(ErrorDisplay, {
      slots: { icon: '<span data-testid="error-icon">⚠</span>' },
    });
    expect(screen.getByTestId('error-icon')).toBeTruthy();
  });

  it('shows retry button when retryable is true', () => {
    render(ErrorDisplay, { props: { retryable: true } });
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('does not show retry button by default', () => {
    render(ErrorDisplay);
    expect(screen.queryByText('Try again')).toBeFalsy();
  });

  it('emits retry when retry button is clicked', async () => {
    const { emitted } = render(ErrorDisplay, {
      props: { retryable: true },
    });
    await fireEvent.click(screen.getByText('Try again'));
    expect(emitted().retry).toBeTruthy();
  });

  it('renders custom retry label', () => {
    render(ErrorDisplay, {
      props: { retryable: true, retryLabel: 'Reload' },
    });
    expect(screen.getByText('Reload')).toBeTruthy();
  });

  it('renders default slot content', () => {
    render(ErrorDisplay, { slots: { default: 'Extra details' } });
    expect(screen.getByText('Extra details')).toBeTruthy();
  });

  it('applies custom className', () => {
    render(ErrorDisplay, { props: { className: 'custom' } });
    expect(screen.getByRole('alert').classList.contains('custom')).toBe(true);
  });
});

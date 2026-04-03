import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import { Clipboard } from '../../components/utility';

describe('Clipboard', () => {
  const writeTextMock = vi.fn().mockResolvedValue(undefined);
  let originalClipboard: typeof navigator.clipboard;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    writeTextMock.mockClear();
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
    vi.restoreAllMocks();
  });

  it('renders with default label', () => {
    render(Clipboard, { props: { text: 'hello' } });
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('renders with custom label', () => {
    render(Clipboard, { props: { text: 'hello', label: 'Copy Code' } });
    expect(screen.getByText('Copy Code')).toBeTruthy();
  });

  it('copies text to clipboard on click', async () => {
    render(Clipboard, { props: { text: 'hello world' } });
    await fireEvent.click(screen.getByRole('button'));
    expect(writeTextMock).toHaveBeenCalledWith('hello world');
  });

  it('shows success label after copying', async () => {
    render(Clipboard, { props: { text: 'hello' } });
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeTruthy();
  });

  it('shows custom success label', async () => {
    render(Clipboard, {
      props: { text: 'hello', successLabel: 'Done!' },
    });
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Done!')).toBeTruthy();
  });

  it('resets to default label after successDuration', async () => {
    vi.useFakeTimers();
    render(Clipboard, { props: { text: 'hello', successDuration: 1000 } });

    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Copied!')).toBeTruthy();

    vi.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeTruthy();
    });

    vi.useRealTimers();
  });

  it('emits copy event on success', async () => {
    const { emitted } = render(Clipboard, { props: { text: 'hello' } });
    await fireEvent.click(screen.getByRole('button'));
    expect(emitted().copy).toBeTruthy();
  });

  it('emits error event on failure', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('Denied'));
    const { emitted } = render(Clipboard, { props: { text: 'hello' } });
    await fireEvent.click(screen.getByRole('button'));
    expect(emitted().error).toBeTruthy();
  });

  it('has btn class', () => {
    const { container } = render(Clipboard, { props: { text: 'hello' } });
    expect(container.querySelector('.btn')).toBeTruthy();
  });

  it('applies color class', () => {
    const { container } = render(Clipboard, {
      props: { text: 'hello', color: 'primary' },
    });
    expect(container.querySelector('.btn-primary')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Clipboard, {
      props: { text: 'hello', size: 'sm' },
    });
    expect(container.querySelector('.btn-sm')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Clipboard, {
      props: { text: 'hello', className: 'custom-btn' },
    });
    expect(container.querySelector('.custom-btn')).toBeTruthy();
  });

  it('has accessible aria-label', async () => {
    render(Clipboard, { props: { text: 'hello' } });
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Copy');

    await fireEvent.click(button);
    expect(button.getAttribute('aria-label')).toBe('Copied!');
  });

  it('renders custom slot content', () => {
    render(Clipboard, {
      props: { text: 'hello' },
      slots: { default: '<span data-testid="custom">Custom</span>' },
    });
    expect(screen.getByTestId('custom')).toBeTruthy();
  });

  it('renders custom success slot content after copy', async () => {
    render(Clipboard, {
      props: { text: 'hello' },
      slots: { success: '<span data-testid="success-icon">OK</span>' },
    });
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('success-icon')).toBeTruthy();
  });
});

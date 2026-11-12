import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { ErrorDisplay } from '../../components/feedback';

describe('ErrorDisplay (deprecated alias of ErrorState)', () => {
  it('renders an ErrorState from the 2.x props', () => {
    const { container } = render(ErrorDisplay, { props: { message: 'Try later.' } });
    const root = screen.getByRole('alert');
    expect(root.className).toContain('apui-error-state');
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeTruthy();
    expect(container.querySelector('[data-part="description"]')!.textContent).toBe('Try later.');
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
  });

  it('adds a retry button that emits retry', async () => {
    const { emitted } = render(ErrorDisplay, {
      props: { title: 'Failed', retryable: true, retryLabel: 'Réessayer' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(emitted().retry).toHaveLength(1);
  });

  it('keeps className on the root', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(ErrorDisplay, { props: { className: 'legacy' } });
    expect(screen.getByRole('alert').className).toContain('legacy');
  });

  it('renders the message and the default slot together in the description', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(ErrorDisplay, {
      props: { message: 'Try later.' },
      slots: { default: '<a href="/status">Status</a>' },
    });
    expect(container.querySelector('[data-part="description"]')!.innerHTML).toBe(
      'Try later.<a href="/status">Status</a>',
    );
  });
});

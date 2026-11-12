import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Clipboard } from '../../components/utility';

const URL = 'https://horizonhomes.com/l/grove-greenfield';

const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Clipboard', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders an outline copy button with an empty live region', () => {
    const { container } = render(Clipboard, { props: { value: URL } });
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('SPAN');
    expect(root.className).toBe('apui-clipboard');
    expect(root.getAttribute('data-variant')).toBe('button');
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.getAttribute('data-state')).toBe('idle');
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button.className).toBe('apui-button');
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.querySelector('[data-part="icon"] > svg')).not.toBeNull();
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('copies, says Copied, announces it and goes back after the timeout', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const { container, emitted } = render(Clipboard, { props: { value: URL, timeout: 1000 } });
    await fireEvent.click(screen.getByRole('button'));
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(emitted().copy).toEqual([[URL]]);
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-state')).toBe('copied');
    expect(screen.getByRole('button').textContent).toContain('Copied');
    expect(screen.getByRole('status').textContent).toBe('Copied to clipboard');
    await vi.advanceTimersByTimeAsync(1000);
    await nextTick();
    expect(root.getAttribute('data-state')).toBe('idle');
  });

  it('still copies the deprecated 2.x text prop, after value and modelValue', async () => {
    const { container, emitted, rerender } = render(Clipboard, {
      props: { text: URL, variant: 'field' },
    });
    expect(container.firstElementChild!.hasAttribute('text')).toBe(false);
    expect(container.querySelector('[data-part="value"]')!.textContent).toBe(URL);
    await fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(emitted().copy).toEqual([[URL]]);
    await rerender({ text: 'old', modelValue: 'model' });
    await fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(writeText).toHaveBeenLastCalledWith('model');
    await rerender({ text: 'old', modelValue: 'model', value: 'new' });
    await fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(writeText).toHaveBeenLastCalledWith('new');
  });

  it('announces a failure instead of copying silently', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    (document as unknown as { execCommand: unknown }).execCommand = () => false;
    const { container, emitted } = render(Clipboard, {
      props: { value: URL, errorMessage: 'No se pudo copiar.' },
    });
    await fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(emitted().error).toHaveLength(1);
    expect(container.firstElementChild!.getAttribute('data-state')).toBe('failed');
    expect(screen.getByRole('status').textContent).toBe('No se pudo copiar.');
  });

  it('names the icon button and shows its confirmation as the tooltip', async () => {
    render(Clipboard, {
      props: { value: 'LST-4127', variant: 'icon', label: 'Copy reference', copiedLabel: 'Done' },
    });
    const button = screen.getByRole('button', { name: 'Copy reference' });
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.hasAttribute('data-icon-only')).toBe(true);
    expect(button.querySelector('[data-part="label"]')).toBeNull();
    await fireEvent.click(button);
    await flush();
    expect(button.getAttribute('aria-label')).toBe('Done');
    expect(screen.getByRole('status').querySelector('svg')).not.toBeNull();
  });

  it('shows the value in a field joined to the button', () => {
    const { container } = render(Clipboard, {
      props: { value: URL, variant: 'field', size: 'md' },
    });
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('DIV');
    expect(root.querySelector('[data-part="field"] > [data-part="value"]')!.textContent).toBe(URL);
    expect(screen.getByRole('button').getAttribute('data-size')).toBe('md');
  });
});

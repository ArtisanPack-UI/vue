import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Code } from '../../components/display';

const SNIPPET = 'const a = 1;\n\n  return a;\n';

const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Code', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the header, a labeled LTR region and one span per line', () => {
    const { container } = render(Code, {
      props: {
        code: SNIPPET,
        fileName: 'a.ts',
        language: 'TypeScript',
        numbered: true,
        highlight: [3],
      },
    });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-code');
    expect(root.hasAttribute('data-numbered')).toBe(true);
    const header = root.querySelector('[data-part="header"]')!;
    expect(header.querySelector('[data-part="file"]')!.textContent).toBe('a.ts');
    const badge = header.querySelector('[data-part="language"]')!;
    expect(badge.className).toBe('apui-badge');
    expect(badge.getAttribute('data-variant')).toBe('outline');
    const copy = header.querySelector('button[data-part="copy"]')!;
    expect(copy.getAttribute('data-size')).toBe('xs');
    expect(copy.textContent).toContain('Copy');
    const pre = screen.getByRole('region', { name: 'a.ts' });
    expect(pre.tagName).toBe('PRE');
    expect(pre.getAttribute('tabindex')).toBe('0');
    const lines = [...pre.querySelectorAll('[data-part="line"]')];
    expect(lines.map((line) => line.textContent)).toEqual(['const a = 1;', '', '  return a;']);
    expect(lines.map((line) => line.getAttribute('data-n'))).toEqual(['1', '2', '3']);
    expect(lines.map((line) => line.hasAttribute('data-highlight'))).toEqual([false, false, true]);
    // Newlines separate the lines, empty ones included, so the pre reads line by line.
    expect(pre.textContent).toBe('const a = 1;\n\n  return a;');
  });

  it('copies the code without line numbers and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    render(Code, {
      props: {
        code: SNIPPET,
        numbered: true,
        copiedLabel: 'Copiado',
        copiedMessage: 'Copiado al portapapeles',
      },
    });
    await fireEvent.click(screen.getByRole('button'));
    await flush();
    // The exact source, its final newline included.
    expect(writeText).toHaveBeenCalledWith(SNIPPET);
    expect(screen.getByRole('button').textContent).toContain('Copiado');
    expect(screen.getByRole('button').getAttribute('data-state')).toBe('copied');
    expect(screen.getByRole('status').textContent).toBe('Copiado al portapapeles');
  });

  it('clears a stale "Copied" when the code changes, even mid-copy', async () => {
    let release: () => void = () => {};
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(new Promise<void>((resolve) => (release = resolve)));
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const { rerender } = render(Code, { props: { code: 'a' } });
    const button = () => screen.getByRole('button');
    await fireEvent.click(button());
    await flush();
    expect(button().getAttribute('data-state')).toBe('copied');
    await rerender({ code: 'b' });
    await flush();
    expect(button().getAttribute('data-state')).toBe('idle');
    expect(button().textContent).toContain('Copy');

    await fireEvent.click(button());
    await rerender({ code: 'c' });
    release();
    await flush();
    expect(button().getAttribute('data-state')).toBe('idle');
  });

  it('names the region by label, file name, language, then "Code"', () => {
    const name = (props: Record<string, unknown>) => {
      const { container, unmount } = render(Code, { props: { code: 'x', ...props } });
      const value = container.querySelector('pre')!.getAttribute('aria-label');
      unmount();
      return value;
    };
    expect(name({ label: 'Example', fileName: 'a.ts' })).toBe('Example');
    expect(name({ language: 'Shell' })).toBe('Shell');
    expect(name({})).toBe('Code');
  });

  it('leaves the header out when there is nothing to show', () => {
    const { container } = render(Code, { props: { code: 'x', copyable: false } });
    expect(container.querySelector('[data-part="header"]')).toBeNull();
  });

  it('renders inline code as a code element', () => {
    const { container } = render(Code, { props: { inline: true, code: 'data-theme="dark"' } });
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('CODE');
    expect(root.className).toBe('apui-code');
    expect(root.hasAttribute('data-inline')).toBe(true);
    expect(root.textContent).toBe('data-theme="dark"');
  });
});

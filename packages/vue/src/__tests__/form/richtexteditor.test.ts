import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { RichTextEditor } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="rich-text-editor"][data-part="${name}"]`);

describe('RichTextEditor', () => {
  it('renders the contract anatomy with the content as a labelled textbox', () => {
    const { container } = render(RichTextEditor, {
      props: {
        label: 'Description',
        required: true,
        hint: 'Shown on the listing.',
        error: 'Too short.',
        counter: true,
        placeholder: 'Write…',
      },
      attrs: { id: 'rte' },
    });
    const parts = [...container.querySelectorAll('[data-scope="rich-text-editor"]')].map((el) =>
      el.getAttribute('data-part'),
    );
    expect([...new Set(parts)]).toEqual([
      'label',
      'required',
      'box',
      'toolbar',
      'button',
      'divider',
      'content',
      'placeholder',
      'footer',
      'count',
      'hint',
      'error',
    ]);
    const content = screen.getByRole('textbox');
    expect(content.getAttribute('aria-multiline')).toBe('true');
    expect(content.getAttribute('aria-labelledby')).toBe('rte-label');
    expect(content.getAttribute('aria-describedby')).toBe('rte-hint rte-error');
    expect(content.getAttribute('aria-invalid')).toBe('true');
    expect(content.getAttribute('contenteditable')).toBe('true');
    expect(screen.getByRole('toolbar').getAttribute('aria-label')).toBe('Formatting');
    expect(partOf(container, 'count')!.textContent).toBe('0 words · 0 characters');
  });

  it('renders the toolbar with one tab stop and pressed state on toggles', () => {
    const { container } = render(RichTextEditor, { attrs: { 'aria-label': 'Body' } });
    const buttons = [...container.querySelectorAll('[data-part="button"]')];
    expect(buttons.map((el) => el.getAttribute('data-command'))).toEqual([
      'bold',
      'italic',
      'underline',
      'strike',
      'heading2',
      'heading3',
      'bulletList',
      'orderedList',
      'quote',
      'code',
      'link',
      'image',
      'undo',
      'redo',
    ]);
    expect(buttons.filter((el) => el.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('false');
    expect(buttons.at(-1)!.hasAttribute('aria-pressed')).toBe(false);
    expect(buttons[0]!.getAttribute('aria-label')).toBe('Bold');
  });

  it('uses presets and drops underline for Markdown', () => {
    const { container: compact } = render(RichTextEditor, { props: { toolbar: 'compact' } });
    expect(compact.querySelectorAll('[data-part="button"]')).toHaveLength(4);
    const { container: markdown } = render(RichTextEditor, { props: { output: 'markdown' } });
    expect(markdown.querySelector('[data-command="underline"]')).toBeNull();
    expect(markdown.querySelector('.apui-rich-text-editor')!.getAttribute('data-output')).toBe(
      'markdown',
    );
  });

  it('shows the value sanitized and reports edits', async () => {
    const { emitted } = render(RichTextEditor, {
      props: { modelValue: '<p onclick="x()">Hi <b>there</b><script>alert(1)</script></p>' },
    });
    const content = screen.getByRole('textbox');
    expect(content.innerHTML).toBe('<p>Hi <strong>there</strong></p>');
    content.innerHTML = '<p>Hello <em>world</em></p>';
    await fireEvent.input(content);
    expect(emitted()['update:modelValue']).toEqual([['<p>Hello <em>world</em></p>']]);
  });

  it('reads and writes Markdown', async () => {
    const { emitted } = render(RichTextEditor, {
      props: { output: 'markdown', modelValue: '## Title' },
    });
    const content = screen.getByRole('textbox');
    expect(content.innerHTML).toBe('<h2>Title</h2>');
    content.innerHTML = '<h2>Title</h2><ul><li>item</li></ul>';
    await fireEvent.input(content);
    expect(emitted()['update:modelValue']).toEqual([['## Title\n\n- item']]);
  });

  it('loads a new value from v-model and hides the placeholder', async () => {
    const { container, rerender } = render(RichTextEditor, {
      props: { placeholder: 'Write…', counter: true },
    });
    expect(partOf(container, 'placeholder')!.hasAttribute('hidden')).toBe(false);
    await rerender({ placeholder: 'Write…', counter: true, modelValue: '<p>Two words</p>' });
    await nextTick();
    expect(screen.getByRole('textbox').innerHTML).toBe('<p>Two words</p>');
    expect(partOf(container, 'placeholder')!.hasAttribute('hidden')).toBe(true);
    expect(partOf(container, 'count')!.textContent).toBe('2 words · 9 characters');
  });

  it('asks for a link URL and keeps only safe ones', async () => {
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue('javascript:alert(1)');
    render(RichTextEditor);
    await fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect(prompt).toHaveBeenCalledWith('Link URL', 'https://');
    prompt.mockRestore();
  });

  it('skips Mod+K while read-only, following the current props', async () => {
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null);
    const { container, rerender } = render(RichTextEditor, { attrs: { 'aria-label': 'Body' } });
    await rerender({ readonly: true });
    const content = container.querySelector('[data-part="content"]')!;
    await fireEvent.keyDown(content, { key: 'k', ctrlKey: true });
    expect(prompt).not.toHaveBeenCalled();
    await rerender({ readonly: false });
    await fireEvent.keyDown(content, { key: 'k', ctrlKey: true });
    expect(prompt).toHaveBeenCalledTimes(1);
    prompt.mockRestore();
  });

  it('disables editing and the toolbar', () => {
    const { container } = render(RichTextEditor, { props: { disabled: true } });
    expect(screen.getByRole('textbox').getAttribute('contenteditable')).toBe('false');
    expect(container.querySelectorAll('[data-part="button"]:not([disabled])')).toHaveLength(0);
    const { container: readonly } = render(RichTextEditor, { props: { readonly: true } });
    expect(readonly.querySelector('[data-part="content"]')!.getAttribute('aria-readonly')).toBe(
      'true',
    );
  });

  it('puts name on the hidden input and class on the root', () => {
    const { container } = render(RichTextEditor, {
      props: { modelValue: '<p>x</p>' },
      attrs: { name: 'body', class: 'mt-2' },
    });
    const root = container.querySelector('.apui-rich-text-editor')!;
    expect(root.classList.contains('mt-2')).toBe(true);
    expect(root.hasAttribute('name')).toBe(false);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe('body');
    expect(hidden.value).toBe('<p>x</p>');
  });
});

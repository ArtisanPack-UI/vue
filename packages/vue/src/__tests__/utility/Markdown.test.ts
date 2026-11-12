import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { renderMarkdown } from '@artisanpack-ui/behavior';
import { nextTick } from 'vue';
import { Markdown } from '../../components/utility';

const SOURCE = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room

> Viewings run 30 minutes.

| Unit | Rent |
|---|---:|
| 2B | $1,400 |
`;

/** The HTML as the DOM serializes it, so `<br />` compares with `<br>`. */
const serialized = (html: string) => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host.innerHTML;
};

describe('Markdown', () => {
  it('renders the shared HTML in the prose root', () => {
    const { container } = render(Markdown, {
      props: { source: SOURCE },
      attrs: { class: 'extra' },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe('apui-markdown apui-prose extra');
    expect(root.getAttribute('data-mode')).toBe('preview');
    expect(root.innerHTML).toBe(serialized(renderMarkdown(SOURCE)));
    expect(root.querySelector('th[data-align="end"]')!.textContent).toBe('Rent');
  });

  it('still takes the 2.x content prop', () => {
    const { container } = render(Markdown, { props: { content: '# Hi' } });
    expect(container.querySelector('.apui-markdown > h1')!.textContent).toBe('Hi');
  });

  it('renders task items as disabled, labelled checkboxes', () => {
    render(Markdown, { props: { source: SOURCE } });
    const done = screen.getByRole('checkbox', {
      name: 'Confirm time with agent',
    }) as HTMLInputElement;
    expect(done.disabled).toBe(true);
    expect(done.checked).toBe(true);
    expect(done.closest('li')!.getAttribute('data-part')).toBe('task');
  });

  it('escapes raw HTML and drops unsafe URLs, and filters it with sanitize off', () => {
    const source = '<b onclick="x()">b</b> <script>alert(1)</script> [x](javascript:alert(1))';
    const safe = render(Markdown, { props: { source } }).container;
    expect(safe.querySelector('b, script, a')).toBeNull();
    expect(safe.textContent).toContain('<b onclick="x()">b</b>');
    const raw = render(Markdown, { props: { source, sanitize: false } }).container;
    expect(raw.querySelector('b')!.attributes).toHaveLength(0);
    expect(raw.querySelector('script, a')).toBeNull();
  });

  it('opens split mode on the split tab with one Textarea beside the preview', () => {
    const { container } = render(Markdown, { props: { source: SOURCE, mode: 'split' } });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-markdown');
    expect(root.getAttribute('data-mode')).toBe('split');
    expect(screen.getByRole('tablist', { name: 'Markdown mode' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Split' }).getAttribute('aria-selected')).toBe('true');
    expect(container.querySelectorAll('textarea')).toHaveLength(1);
    const split = root.querySelector('[data-scope="markdown"][data-part="split"]')!;
    expect(
      (split.querySelector('[data-part="editor"] textarea') as HTMLTextAreaElement).value,
    ).toBe(SOURCE);
    const preview = screen.getByRole('region', { name: 'Rendered preview' });
    expect(preview.className).toBe('apui-prose');
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toBeTruthy();
  });

  it('emits source-change and update:source, and switches tabs', async () => {
    const { emitted } = render(Markdown, { props: { source: '# One', mode: 'write' } });
    await fireEvent.update(screen.getByRole('textbox', { name: 'Markdown source' }), '# Two');
    expect(emitted()['source-change']).toEqual([['# Two']]);
    expect(emitted()['update:source']).toEqual([['# Two']]);
    await fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    await nextTick();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('region', { name: 'Rendered preview' }).innerHTML).toBe(
      '<h1>Two</h1>\n',
    );
  });

  it('takes translated labels and per-part classes', () => {
    const { container } = render(Markdown, {
      props: {
        source: 'x',
        mode: 'split',
        tabsLabel: 'Modo',
        writeLabel: 'Escribir',
        previewLabel: 'Vista previa',
        splitLabel: 'Dividir',
        editorLabel: 'Fuente',
        outputLabel: 'Vista',
        classes: { root: 'r', editor: 'e', preview: 'p', split: 's' },
      },
    });
    expect(screen.getByRole('tablist', { name: 'Modo' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())).toEqual([
      'Escribir',
      'Vista previa',
      'Dividir',
    ]);
    expect(screen.getByRole('textbox', { name: 'Fuente' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Vista' }).className).toBe('apui-prose p');
    expect(container.firstElementChild!.className).toBe('apui-markdown r');
    expect(container.querySelector('[data-part="editor"]')!.className).toBe('e');
    expect(container.querySelector('[data-part="split"]')!.className).toBe('s');
  });
});

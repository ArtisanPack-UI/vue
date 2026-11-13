import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { CodeEditor } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="code-editor"][data-part="${name}"]`);

const allParts = (container: Element) => [
  ...new Set(
    [...container.querySelectorAll('[data-scope="code-editor"]')].map((el) =>
      el.getAttribute('data-part'),
    ),
  ),
];

describe('CodeEditor', () => {
  it('renders the contract anatomy with every part in order', () => {
    const { container } = render(CodeEditor, {
      props: {
        label: 'Source',
        required: true,
        hint: 'Two spaces.',
        error: 'Fix it.',
        rows: 3,
        tabs: ['a.ts', 'b.ts'],
        languages: [{ value: 'ts', label: 'TypeScript' }],
        language: 'ts',
        diagnostics: [{ line: 2, message: 'Bad type.' }],
      },
      attrs: { id: 'code' },
    });
    expect(allParts(container)).toEqual([
      'label',
      'required',
      'box',
      'header',
      'tabs',
      'tab',
      'languageSelect',
      'body',
      'gutter',
      'line',
      'control',
      'diagnostics',
      'diagnostic',
      'status',
      'instructions',
      'hint',
      'error',
    ]);
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    expect(partOf(container, 'label')!.getAttribute('for')).toBe('code');
    expect(control.tagName).toBe('TEXTAREA');
    expect(control.getAttribute('aria-describedby')).toBe('code-hint code-error code-instructions');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('spellcheck')).toBe('false');
    const body = partOf(container, 'body')!;
    expect(body.getAttribute('dir')).toBe('ltr');
    expect(body.getAttribute('role')).toBe('tabpanel');
    expect(body.getAttribute('aria-labelledby')).toBe('code-tab-0');
    expect(container.querySelectorAll('[data-part="line"]')).toHaveLength(3);
    expect(container.querySelector('[data-severity="error"][data-part="line"]')!.textContent).toBe(
      '2',
    );
    expect(partOf(container, 'diagnostic')!.textContent).toContain('Line 2');
    const status = partOf(container, 'status')!.textContent!;
    expect(status).toContain('1 error');
    expect(status).toContain('Ln 1, Col 1');
    expect(status).toContain('Spaces: 2');
    expect(status).toContain('TypeScript');
  });

  it('has no header without tabs or languages and grows with the value', () => {
    const { container } = render(CodeEditor, {
      props: { rows: 2, modelValue: 'a\nb\nc\nd' },
      attrs: { 'aria-label': 'Code' },
    });
    expect(partOf(container, 'header')).toBeNull();
    expect(container.querySelectorAll('[data-part="line"]')).toHaveLength(4);
    expect((partOf(container, 'control') as HTMLTextAreaElement).rows).toBe(4);
  });

  it('indents with Tab and reports the value', async () => {
    const { container, emitted } = render(CodeEditor, {
      props: { modelValue: 'ab' },
      attrs: { 'aria-label': 'Code' },
    });
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    control.setSelectionRange(1, 1);
    await fireEvent.keyDown(control, { key: 'Tab' });
    expect(control.value).toBe('a  b');
    expect(emitted()['update:modelValue']).toEqual([['a  b']]);
  });

  it('lets Tab leave after Escape', async () => {
    const { container } = render(CodeEditor, { attrs: { 'aria-label': 'Code' } });
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    await fireEvent.keyDown(control, { key: 'Escape' });
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    control.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(false);
  });

  it('selects tabs by click and arrow key and reports them', async () => {
    const { container, emitted } = render(CodeEditor, {
      props: { tabs: ['a', { value: 'b', label: 'B file' }] },
      attrs: { 'aria-label': 'Code' },
    });
    const tabs = [...container.querySelectorAll('[data-part="tab"]')] as HTMLElement[];
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1]!.getAttribute('tabindex')).toBe('-1');
    expect(tabs[1]!.textContent!.trim()).toBe('B file');
    await fireEvent.keyDown(tabs[0]!, { key: 'ArrowRight' });
    expect(emitted()['tab-change']).toEqual([['b']]);
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    await fireEvent.click(tabs[0]!);
    expect(emitted()['tab-change']).toEqual([['b'], ['a']]);
  });

  it('reports a language change', async () => {
    const { container, emitted } = render(CodeEditor, {
      props: { languages: ['ts', 'php'], language: 'ts' },
      attrs: { 'aria-label': 'Code' },
    });
    const select = partOf(container, 'languageSelect') as HTMLSelectElement;
    expect(select.getAttribute('aria-label')).toBe('Language');
    await fireEvent.update(select, 'php');
    expect(emitted()['language-change']).toEqual([['php']]);
  });

  it('routes class to the root and other attributes to the textarea', () => {
    const { container } = render(CodeEditor, {
      props: { readonly: true },
      attrs: { class: 'mt-3', name: 'css', 'aria-label': 'Code' },
    });
    const root = container.querySelector('.apui-code-editor')!;
    expect(root.classList.contains('mt-3')).toBe(true);
    expect(root.hasAttribute('data-readonly')).toBe(true);
    const control = partOf(container, 'control') as HTMLTextAreaElement;
    expect(control.name).toBe('css');
    expect(control.readOnly).toBe(true);
  });

  it('takes label props', () => {
    const { container } = render(CodeEditor, {
      props: { tabs: ['a'], tabsLabel: 'Files', positionLabel: 'L :line C :column' },
      attrs: { 'aria-label': 'Code' },
    });
    expect(partOf(container, 'tabs')!.getAttribute('aria-label')).toBe('Files');
    expect(partOf(container, 'status')!.textContent).toContain('L 1 C 1');
    expect(partOf(container, 'instructions')!.textContent).toContain('press Escape, then Tab');
  });
});

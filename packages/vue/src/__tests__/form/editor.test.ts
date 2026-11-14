import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Editor } from '../../components/form';

const control = () => document.querySelector<HTMLTextAreaElement>('[data-part="control"]')!;

describe('Editor (deprecated alias of CodeEditor)', () => {
  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(Editor, { props: { label: 'One' } });
    render(Editor, { props: { label: 'Two' } });
    const calls = warn.mock.calls.filter(([m]) => String(m).includes('Editor is deprecated'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('Editor is deprecated; use CodeEditor.');
    warn.mockRestore();
  });

  it('renders the design-system CodeEditor, with no DaisyUI markup', () => {
    const { container } = render(Editor, { props: { label: 'HTML Source' } });
    expect(container.querySelector('.apui-code-editor')).toBeTruthy();
    expect(container.querySelector('.textarea, .fieldset, .font-mono')).toBeNull();
    expect(screen.getByLabelText(/HTML Source/)).toBe(control());
  });

  it('defaults to 12 rows and takes rows', () => {
    const first = render(Editor, { props: { label: 'Code' } });
    expect(control().rows).toBe(12);
    first.unmount();
    render(Editor, { props: { label: 'Code', rows: 20 } });
    expect(control().rows).toBe(20);
  });

  it('carries over id, placeholder, disabled, readonly and required', () => {
    render(Editor, {
      props: {
        label: 'Code',
        id: 'source',
        placeholder: 'Paste here',
        disabled: true,
        readonly: true,
        required: true,
      },
    });
    expect(control().id).toBe('source');
    expect(control().placeholder).toBe('Paste here');
    expect(control().disabled).toBe(true);
    expect(control().readOnly).toBe(true);
    expect(control().required).toBe(true);
  });

  it('shows the hint and the error', () => {
    const { rerender } = render(Editor, { props: { label: 'Code', hint: 'Use HTML' } });
    expect(screen.getByText('Use HTML')).toBeTruthy();
    return rerender({ error: 'Invalid markup' }).then(() => {
      expect(screen.getByText('Invalid markup')).toBeTruthy();
      expect(control().getAttribute('aria-invalid')).toBe('true');
    });
  });

  it('supports v-model', async () => {
    const { emitted } = render(Editor, { props: { label: 'Code', modelValue: '<p>' } });
    expect(control().value).toBe('<p>');
    await fireEvent.update(control(), '<div>');
    expect(emitted()['update:modelValue']).toEqual([['<div>']]);
  });
});

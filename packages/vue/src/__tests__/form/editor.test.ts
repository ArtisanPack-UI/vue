import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Editor } from '../../components/form';

describe('Editor', () => {
  it('renders with label', () => {
    render(Editor, { props: { label: 'HTML Source' } });
    expect(screen.getByText('HTML Source')).toBeTruthy();
  });

  it('renders a textarea element', () => {
    render(Editor);
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  it('has monospace font class', () => {
    render(Editor);
    const textarea = document.querySelector('textarea');
    expect(textarea?.classList.contains('font-mono')).toBe(true);
  });

  it('defaults to 12 rows', () => {
    render(Editor);
    const textarea = document.querySelector('textarea');
    expect(textarea?.getAttribute('rows')).toBe('12');
  });

  it('accepts custom rows', () => {
    render(Editor, { props: { rows: 20 } });
    const textarea = document.querySelector('textarea');
    expect(textarea?.getAttribute('rows')).toBe('20');
  });

  it('shows required indicator', () => {
    render(Editor, { props: { label: 'Code', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Editor, { props: { hint: 'Enter HTML' } });
    expect(screen.getByText('Enter HTML')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Editor, { props: { hint: 'Help', error: 'Invalid syntax' } });
    expect(screen.getByText('Invalid syntax')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('applies textarea-error class on error', () => {
    render(Editor, { props: { error: 'Error' } });
    const textarea = document.querySelector('textarea');
    expect(textarea?.classList.contains('textarea-error')).toBe(true);
  });

  it('sets aria-invalid on error', () => {
    render(Editor, { props: { error: 'Error' } });
    const textarea = document.querySelector('textarea');
    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports v-model', () => {
    render(Editor, { props: { modelValue: 'const x = 1;' } });
    expect((document.querySelector('textarea') as HTMLTextAreaElement).value).toBe('const x = 1;');
  });
});

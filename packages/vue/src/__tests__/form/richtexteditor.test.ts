import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { RichTextEditor } from '../../components/form';

describe('RichTextEditor', () => {
  it('renders with label', () => {
    render(RichTextEditor, { props: { label: 'Description' } });
    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('renders a contenteditable div', () => {
    render(RichTextEditor);
    const editor = screen.getByRole('textbox');
    expect(editor.getAttribute('contenteditable')).toBe('true');
  });

  it('has role="textbox"', () => {
    render(RichTextEditor);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('has aria-multiline="true"', () => {
    render(RichTextEditor);
    expect(screen.getByRole('textbox').getAttribute('aria-multiline')).toBe('true');
  });

  it('shows required indicator', () => {
    render(RichTextEditor, { props: { label: 'Content', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(RichTextEditor, { props: { hint: 'Format with toolbar' } });
    expect(screen.getByText('Format with toolbar')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(RichTextEditor, { props: { hint: 'Help', error: 'Content required' } });
    expect(screen.getByText('Content required')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('applies border-error on error', () => {
    render(RichTextEditor, { props: { error: 'Error' } });
    const container = document.querySelector('.border.rounded-lg');
    expect(container?.classList.contains('border-error')).toBe(true);
  });

  it('sets aria-invalid on error', () => {
    render(RichTextEditor, { props: { error: 'Error' } });
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('applies custom minHeight', () => {
    render(RichTextEditor, { props: { minHeight: '300px' } });
    const editor = screen.getByRole('textbox');
    expect((editor as HTMLElement).style.minHeight).toBe('300px');
  });

  it('defaults to 200px minHeight', () => {
    render(RichTextEditor);
    const editor = screen.getByRole('textbox');
    expect((editor as HTMLElement).style.minHeight).toBe('200px');
  });

  it('renders toolbar slot', () => {
    render(RichTextEditor, {
      slots: {
        toolbar: '<button>Bold</button>',
      },
    });
    expect(screen.getByText('Bold')).toBeTruthy();
    expect(document.querySelector('.bg-base-200')).toBeTruthy();
  });

  it('sets aria-label from label prop', () => {
    render(RichTextEditor, { props: { label: 'Notes' } });
    expect(screen.getByRole('textbox').getAttribute('aria-label')).toBe('Notes');
  });
});

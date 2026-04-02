import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Textarea } from '../../components/form';

describe('Textarea', () => {
  it('renders with label', () => {
    render(Textarea, { props: { label: 'Comments' } });
    expect(screen.getByText('Comments')).toBeTruthy();
  });

  it('renders a textarea element', () => {
    render(Textarea, { props: { label: 'Text' } });
    expect(document.querySelector('textarea')).toBeTruthy();
  });

  it('shows required indicator', () => {
    render(Textarea, { props: { label: 'Required', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Textarea, { props: { hint: 'Enter details' } });
    expect(screen.getByText('Enter details')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Textarea, { props: { hint: 'Help', error: 'Too short' } });
    expect(screen.getByText('Too short')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('applies textarea-error class on error', () => {
    render(Textarea, { props: { error: 'Error' } });
    expect(document.querySelector('textarea')?.classList.contains('textarea-error')).toBe(true);
  });

  it('adds dashed border when readonly', () => {
    render(Textarea, { props: { readonly: true } });
    expect(document.querySelector('textarea')?.classList.contains('border-dashed')).toBe(true);
  });

  it('renders inline label', () => {
    render(Textarea, { props: { label: 'Inline', inline: true } });
    const inlineLabel = document.querySelector('.fieldset-label');
    expect(inlineLabel?.textContent?.trim()).toBe('Inline');
    expect(document.querySelector('.fieldset-legend')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    render(Textarea, { props: { error: 'Error' } });
    expect(document.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports v-model', () => {
    render(Textarea, { props: { modelValue: 'Hello' } });
    expect((document.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Hello');
  });
});

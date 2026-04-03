import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Textarea } from '../../components/form';

describe('Textarea', () => {
  it('renders with label', () => {
    render(Textarea, { props: { label: 'Comments' } });
    expect(screen.getByText('Comments')).toBeTruthy();
  });

  it('renders a textarea element', () => {
    const { container } = render(Textarea, { props: { label: 'Text' } });
    expect(container.querySelector('textarea')).toBeTruthy();
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
    const { container } = render(Textarea, { props: { error: 'Error' } });
    expect(container.querySelector('textarea')?.classList.contains('textarea-error')).toBe(true);
  });

  it('adds dashed border when readonly', () => {
    const { container } = render(Textarea, { props: { readonly: true } });
    expect(container.querySelector('textarea')?.classList.contains('border-dashed')).toBe(true);
  });

  it('renders inline label', () => {
    const { container } = render(Textarea, { props: { label: 'Inline', inline: true } });
    const inlineLabel = container.querySelector('.fieldset-label');
    expect(inlineLabel?.textContent?.trim()).toBe('Inline');
    expect(container.querySelector('.fieldset-legend')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    const { container } = render(Textarea, { props: { error: 'Error' } });
    expect(container.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports v-model', () => {
    const { container } = render(Textarea, { props: { modelValue: 'Hello' } });
    expect((container.querySelector('textarea') as HTMLTextAreaElement).value).toBe('Hello');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Input } from '../../components/form';

describe('Input', () => {
  it('renders with label', () => {
    render(Input, { props: { label: 'Email' } });
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders label as legend by default', () => {
    render(Input, { props: { label: 'Name' } });
    const legend = document.querySelector('.fieldset-legend');
    expect(legend?.textContent?.trim()).toContain('Name');
  });

  it('shows required indicator', () => {
    render(Input, { props: { label: 'Name', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Input, { props: { hint: 'Enter your name' } });
    expect(screen.getByText('Enter your name')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Input, { props: { hint: 'Help text', error: 'Required field' } });
    expect(screen.getByText('Required field')).toBeTruthy();
    expect(screen.queryByText('Help text')).toBeNull();
  });

  it('sets aria-invalid when error is present', () => {
    render(Input, { props: { error: 'Error' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('error has alert role', () => {
    render(Input, { props: { error: 'Error' } });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders clearable button', async () => {
    const { emitted } = render(Input, { props: { clearable: true } });
    const clearBtn = screen.getByLabelText('Clear input');
    expect(clearBtn).toBeTruthy();
    await fireEvent.click(clearBtn);
    expect(emitted().clear).toBeTruthy();
  });

  it('renders inline label inside input wrapper', () => {
    render(Input, { props: { label: 'Inline', inline: true } });
    const inlineLabel = document.querySelector('.label');
    expect(inlineLabel?.textContent?.trim()).toBe('Inline');
    // Legend should not be rendered in inline mode
    const legend = document.querySelector('.fieldset-legend');
    expect(legend).toBeNull();
  });

  it('supports v-model', async () => {
    render(Input, { props: { modelValue: 'initial' } });
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });

  it('applies input-error class on error', () => {
    render(Input, { props: { error: 'Error' } });
    const label = document.querySelector('label.input');
    expect(label?.classList.contains('input-error')).toBe(true);
  });
});

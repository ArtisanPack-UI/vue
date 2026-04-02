import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Password } from '../../components/form';

describe('Password', () => {
  it('renders with label', () => {
    render(Password, { props: { label: 'Password' } });
    expect(screen.getByText('Password')).toBeTruthy();
  });

  it('renders as password type by default', () => {
    render(Password);
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('password');
  });

  it('toggles visibility on toggle click', async () => {
    render(Password, { props: { label: 'Pass' } });
    const input = document.querySelector('input') as HTMLInputElement;
    const toggleBtn = screen.getByLabelText('Show password');
    expect(input.type).toBe('password');

    await fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');

    const hideBtn = screen.getByLabelText('Hide password');
    await fireEvent.click(hideBtn);
    expect(input.type).toBe('password');
  });

  it('hides toggle button when hideToggle is true', () => {
    render(Password, { props: { hideToggle: true } });
    expect(screen.queryByLabelText('Show password')).toBeNull();
    expect(screen.queryByLabelText('Hide password')).toBeNull();
  });

  it('shows clearable button', async () => {
    const { emitted } = render(Password, { props: { clearable: true } });
    const clearBtn = screen.getByLabelText('Clear password');
    await fireEvent.click(clearBtn);
    expect(emitted().clear).toBeTruthy();
  });

  it('shows required indicator', () => {
    render(Password, { props: { label: 'Pass', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Password, { props: { hint: 'Min 8 characters' } });
    expect(screen.getByText('Min 8 characters')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Password, { props: { hint: 'Help', error: 'Too weak' } });
    expect(screen.getByText('Too weak')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('renders inline label', () => {
    render(Password, { props: { label: 'Inline', inline: true } });
    expect(document.querySelector('.fieldset-legend')).toBeNull();
    const inlineLabel = document.querySelector('.label');
    expect(inlineLabel?.textContent?.trim()).toBe('Inline');
  });

  it('sets aria-invalid on error', () => {
    render(Password, { props: { error: 'Error' } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });
});

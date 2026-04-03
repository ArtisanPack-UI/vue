import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Toggle } from '../../components/form';

describe('Toggle', () => {
  it('renders with label', () => {
    render(Toggle, { props: { label: 'Notifications' } });
    expect(screen.getByText('Notifications')).toBeTruthy();
  });

  it('renders a checkbox with role="switch"', () => {
    render(Toggle, { props: { label: 'Toggle' } });
    expect(screen.getByRole('switch')).toBeTruthy();
  });

  it('applies color variant class', () => {
    render(Toggle, { props: { label: 'Color', color: 'success' } });
    expect(screen.getByRole('switch').classList.contains('toggle-success')).toBe(true);
  });

  it('shows required indicator', () => {
    render(Toggle, { props: { label: 'Required', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('reverses order with right prop', () => {
    const { container } = render(Toggle, { props: { label: 'Right', right: true } });
    const label = container.querySelector('label');
    expect(label?.classList.contains('flex-row-reverse')).toBe(true);
  });

  it('shows hint text', () => {
    render(Toggle, { props: { hint: 'Toggle this' } });
    expect(screen.getByText('Toggle this')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Toggle, { props: { hint: 'Help', error: 'Error' } });
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    render(Toggle, { props: { error: 'Error' } });
    expect(screen.getByRole('switch').getAttribute('aria-invalid')).toBe('true');
  });

  it('supports v-model', () => {
    render(Toggle, { props: { label: 'Toggle', modelValue: true } });
    expect((screen.getByRole('switch') as HTMLInputElement).checked).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Checkbox } from '../../components/form';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(Checkbox, { props: { label: 'Accept terms' } });
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });

  it('renders a checkbox input', () => {
    render(Checkbox, { props: { label: 'Check' } });
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('shows required indicator', () => {
    render(Checkbox, { props: { label: 'Required', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('applies color variant class', () => {
    render(Checkbox, { props: { label: 'Color', color: 'primary' } });
    expect(screen.getByRole('checkbox').classList.contains('checkbox-primary')).toBe(true);
  });

  it('shows hint text', () => {
    render(Checkbox, { props: { hint: 'Hint text' } });
    expect(screen.getByText('Hint text')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Checkbox, { props: { hint: 'Hint', error: 'Error' } });
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.queryByText('Hint')).toBeNull();
  });

  it('renders card layout', () => {
    const { container } = render(Checkbox, { props: { label: 'Card', card: true } });
    const label = container.querySelector('label');
    expect(label?.classList.contains('p-4')).toBe(true);
  });

  it('reverses order with right prop', () => {
    const { container } = render(Checkbox, { props: { label: 'Right', right: true } });
    const label = container.querySelector('label');
    expect(label?.classList.contains('flex-row-reverse')).toBe(true);
  });

  it('supports v-model', async () => {
    const { emitted } = render(Checkbox, { props: { label: 'Toggle', modelValue: true } });
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    await fireEvent.click(checkbox);
    expect(emitted()['update:modelValue']).toBeTruthy();
  });

  it('sets aria-invalid on error', () => {
    render(Checkbox, { props: { error: 'Required' } });
    expect(screen.getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
  });
});

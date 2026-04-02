import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { ColorPicker } from '../../components/form';

describe('ColorPicker', () => {
  it('renders with label', () => {
    render(ColorPicker, { props: { label: 'Brand Color' } });
    expect(screen.getByText('Brand Color')).toBeTruthy();
  });

  it('renders a color input', () => {
    render(ColorPicker);
    const input = document.querySelector('input[type="color"]');
    expect(input).toBeTruthy();
  });

  it('displays hex value', () => {
    render(ColorPicker, { props: { modelValue: '#ff0000' } });
    expect(screen.getByText('#ff0000')).toBeTruthy();
  });

  it('shows required indicator', () => {
    render(ColorPicker, { props: { label: 'Color', required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows clearable button', () => {
    render(ColorPicker, { props: { clearable: true } });
    expect(screen.getByLabelText('Clear color')).toBeTruthy();
  });

  it('shows random button', () => {
    render(ColorPicker, { props: { random: true } });
    expect(screen.getByLabelText('Generate random color')).toBeTruthy();
  });

  it('emits randomColor when random button clicked', async () => {
    const { emitted } = render(ColorPicker, { props: { random: true } });
    await fireEvent.click(screen.getByLabelText('Generate random color'));
    expect(emitted().randomColor).toBeTruthy();
    const color = emitted().randomColor[0][0] as string;
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('emits clear when clear button clicked', async () => {
    const { emitted } = render(ColorPicker, { props: { clearable: true } });
    await fireEvent.click(screen.getByLabelText('Clear color'));
    expect(emitted().clear).toBeTruthy();
  });

  it('shows hint text', () => {
    render(ColorPicker, { props: { hint: 'Pick a color' } });
    expect(screen.getByText('Pick a color')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(ColorPicker, { props: { hint: 'Help', error: 'Invalid color' } });
    expect(screen.getByText('Invalid color')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('sets aria-invalid on error', () => {
    render(ColorPicker, { props: { error: 'Error' } });
    const input = document.querySelector('input[type="color"]');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Pin } from '../../components/form';

describe('Pin', () => {
  it('renders the correct number of inputs', () => {
    render(Pin, { props: { length: 6 } });
    const inputs = document.querySelectorAll('input');
    expect(inputs).toHaveLength(6);
  });

  it('renders 4 inputs for length=4', () => {
    render(Pin, { props: { length: 4 } });
    expect(document.querySelectorAll('input')).toHaveLength(4);
  });

  it('has role="group" container', () => {
    render(Pin, { props: { length: 4 } });
    const groups = screen.getAllByRole('group');
    const pinGroup = groups.find((el) => el.getAttribute('aria-label') === 'PIN input');
    expect(pinGroup).toBeTruthy();
  });

  it('sets inputmode="numeric" when numeric', () => {
    render(Pin, { props: { length: 4, numeric: true } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('inputmode')).toBe('numeric');
  });

  it('renders as password type when hide is true', () => {
    render(Pin, { props: { length: 4, hide: true } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('password');
  });

  it('renders as text type by default', () => {
    render(Pin, { props: { length: 4 } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('type')).toBe('text');
  });

  it('applies color variant class', () => {
    render(Pin, { props: { length: 4, color: 'primary' } });
    const input = document.querySelector('input');
    expect(input?.classList.contains('input-primary')).toBe(true);
  });

  it('shows error message', () => {
    render(Pin, { props: { length: 4, error: 'Invalid code' } });
    expect(screen.getByText('Invalid code')).toBeTruthy();
  });

  it('applies input-error class on error', () => {
    render(Pin, { props: { length: 4, error: 'Error' } });
    const input = document.querySelector('input');
    expect(input?.classList.contains('input-error')).toBe(true);
  });

  it('has aria-label for each input', () => {
    render(Pin, { props: { length: 4 } });
    const inputs = document.querySelectorAll('input');
    expect(inputs[0].getAttribute('aria-label')).toBe('PIN digit 1 of 4');
    expect(inputs[3].getAttribute('aria-label')).toBe('PIN digit 4 of 4');
  });

  it('has autocomplete="one-time-code"', () => {
    render(Pin, { props: { length: 4 } });
    const input = document.querySelector('input');
    expect(input?.getAttribute('autocomplete')).toBe('one-time-code');
  });

  it('has maxlength=1 on each input', () => {
    render(Pin, { props: { length: 4 } });
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      expect(input.getAttribute('maxlength')).toBe('1');
    });
  });
});

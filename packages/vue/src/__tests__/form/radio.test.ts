import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Radio } from '../../components/form';

const options = [
  { id: 'sm', name: 'Small' },
  { id: 'md', name: 'Medium' },
  { id: 'lg', name: 'Large' },
];

describe('Radio', () => {
  it('renders with group label', () => {
    render(Radio, { props: { label: 'Size', options } });
    expect(screen.getByText('Size')).toBeTruthy();
  });

  it('renders all options', () => {
    render(Radio, { props: { options } });
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('renders option labels', () => {
    render(Radio, { props: { options } });
    expect(screen.getByText('Small')).toBeTruthy();
    expect(screen.getByText('Medium')).toBeTruthy();
    expect(screen.getByText('Large')).toBeTruthy();
  });

  it('has radiogroup role', () => {
    render(Radio, { props: { label: 'Size', options } });
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('applies color variant class', () => {
    render(Radio, { props: { options, color: 'primary' } });
    const radios = screen.getAllByRole('radio');
    expect(radios[0].classList.contains('radio-primary')).toBe(true);
  });

  it('shows hint text', () => {
    render(Radio, { props: { options, hint: 'Select a size' } });
    expect(screen.getByText('Select a size')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Radio, { props: { options, hint: 'Help', error: 'Required' } });
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('renders card layout', () => {
    const { container } = render(Radio, { props: { options, card: true } });
    const labels = container.querySelectorAll('label');
    expect(labels[0].classList.contains('p-4')).toBe(true);
  });

  it('renders inline layout', () => {
    const { container } = render(Radio, { props: { options, inline: true } });
    const optionContainer = container.querySelector('.flex.gap-3');
    expect(optionContainer?.classList.contains('flex-col')).toBe(false);
  });

  it('disables individual options', () => {
    const opts = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B', disabled: true },
    ];
    render(Radio, { props: { options: opts } });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[1].disabled).toBe(true);
  });

  it('supports custom option keys', () => {
    const opts = [
      { value: '1', text: 'One' },
      { value: '2', text: 'Two' },
    ];
    render(Radio, { props: { options: opts, optionValue: 'value', optionLabel: 'text' } });
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
  });

  it('shows per-option hint text', () => {
    const opts = [{ id: 'a', name: 'A', hint: 'First option' }];
    render(Radio, { props: { options: opts } });
    expect(screen.getByText('First option')).toBeTruthy();
  });
});

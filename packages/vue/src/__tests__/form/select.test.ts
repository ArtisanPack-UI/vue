import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Select } from '../../components/form';

const options = [
  { id: 'us', name: 'United States' },
  { id: 'ca', name: 'Canada' },
];

describe('Select', () => {
  it('renders with label', () => {
    render(Select, { props: { label: 'Country', options } });
    expect(screen.getByText('Country')).toBeTruthy();
  });

  it('renders a select element', () => {
    render(Select, { props: { options } });
    expect(document.querySelector('select')).toBeTruthy();
  });

  it('renders all options', () => {
    render(Select, { props: { options } });
    const opts = document.querySelectorAll('option');
    expect(opts).toHaveLength(2);
  });

  it('renders placeholder option', () => {
    render(Select, { props: { options, placeholder: 'Select a country' } });
    const placeholder = document.querySelector('option[disabled]');
    expect(placeholder?.textContent?.trim()).toBe('Select a country');
  });

  it('shows required indicator', () => {
    render(Select, { props: { label: 'Country', options, required: true } });
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('shows hint text', () => {
    render(Select, { props: { options, hint: 'Choose one' } });
    expect(screen.getByText('Choose one')).toBeTruthy();
  });

  it('shows error and hides hint', () => {
    render(Select, { props: { options, hint: 'Help', error: 'Required' } });
    expect(screen.getByText('Required')).toBeTruthy();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('applies select-error class on error', () => {
    render(Select, { props: { options, error: 'Error' } });
    const label = document.querySelector('label.select');
    expect(label?.classList.contains('select-error')).toBe(true);
  });

  it('renders inline label', () => {
    render(Select, { props: { label: 'Inline', options, inline: true } });
    expect(document.querySelector('.fieldset-legend')).toBeNull();
    const inlineLabel = document.querySelector('label.fieldset-label');
    expect(inlineLabel?.textContent?.trim()).toBe('Inline');
  });

  it('supports custom option keys', () => {
    const opts = [
      { value: '1', text: 'One' },
      { value: '2', text: 'Two' },
    ];
    render(Select, { props: { options: opts, optionValue: 'value', optionLabel: 'text' } });
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Two')).toBeTruthy();
  });
});

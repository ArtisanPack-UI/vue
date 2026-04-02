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
    const { container } = render(Select, { props: { options } });
    expect(container.querySelector('select')).toBeTruthy();
  });

  it('renders all options', () => {
    const { container } = render(Select, { props: { options } });
    const opts = container.querySelectorAll('option');
    expect(opts).toHaveLength(2);
  });

  it('renders placeholder option', () => {
    const { container } = render(Select, {
      props: { options, placeholder: 'Select a country' },
    });
    const placeholder = container.querySelector('option[disabled]');
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
    const { container } = render(Select, { props: { options, error: 'Error' } });
    const label = container.querySelector('label.select');
    expect(label?.classList.contains('select-error')).toBe(true);
  });

  it('renders inline label', () => {
    const { container } = render(Select, {
      props: { label: 'Inline', options, inline: true },
    });
    expect(container.querySelector('.fieldset-legend')).toBeNull();
    const inlineLabel = container.querySelector('label.fieldset-label');
    expect(inlineLabel?.textContent?.trim()).toContain('Inline');
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

  it('sets aria-invalid on error', () => {
    const { container } = render(Select, { props: { options, error: 'Required field' } });
    const select = container.querySelector('select');
    expect(select?.getAttribute('aria-invalid')).toBe('true');
  });
});

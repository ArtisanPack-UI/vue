import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { CheckboxGroup } from '../../components/form';

const topics = [
  { value: 'offers', label: 'Offers', description: 'Hourly' },
  { value: 'prices', label: 'Prices' },
  { value: 'news', label: 'News', disabled: true },
];

describe('CheckboxGroup', () => {
  it('renders each option as a Checkbox in the items part', () => {
    const { container } = render(CheckboxGroup, {
      props: { label: 'Notify me', options: topics, columns: 2 },
      attrs: { name: 'topics[]' },
    });
    const root = container.querySelector('fieldset')!;
    expect(root.getAttribute('data-columns')).toBe('2');
    expect(root.querySelectorAll('[data-part="items"] > .apui-checkbox')).toHaveLength(3);
    expect(screen.getByLabelText('Offers').getAttribute('name')).toBe('topics[]');
    expect(screen.getByLabelText('Offers').getAttribute('value')).toBe('offers');
    expect((screen.getByLabelText('News') as HTMLInputElement).disabled).toBe(true);
  });

  it('emits the checked values in option order', async () => {
    const { emitted } = render(CheckboxGroup, {
      props: { options: topics, modelValue: ['prices'] },
    });
    await fireEvent.click(screen.getByLabelText('Offers'));
    expect(emitted()['update:modelValue']![0]).toEqual([['offers', 'prices']]);
  });

  it('select all is mixed while some are checked and toggles every enabled option', async () => {
    const { container, emitted } = render(CheckboxGroup, {
      props: { options: topics, selectAll: true, modelValue: ['offers'] },
    });
    expect(
      container
        .querySelector('[data-part="select-all"] .apui-checkbox')!
        .getAttribute('data-state'),
    ).toBe('indeterminate');
    await fireEvent.click(screen.getByLabelText('Select all'));
    expect(emitted()['update:modelValue']![0]).toEqual([['offers', 'prices']]);
  });

  it('keeps values that no option stands for', async () => {
    const { emitted } = render(CheckboxGroup, {
      props: { options: topics, modelValue: ['legacy', 'prices'] },
    });
    await fireEvent.click(screen.getByLabelText('Offers'));
    expect(emitted()['update:modelValue']![0]).toEqual([['offers', 'prices', 'legacy']]);
  });

  it('translates the select-all label', () => {
    render(CheckboxGroup, {
      props: { options: ['A'], selectAll: true, selectAllLabel: 'Tout sélectionner' },
    });
    expect(screen.getByLabelText('Tout sélectionner')).toBeTruthy();
  });

  it('links the group error and marks every option invalid', () => {
    const { container } = render(CheckboxGroup, {
      props: { options: ['A', 'B'], error: 'Pick one.' },
      attrs: { id: 'g' },
    });
    expect(container.querySelector('fieldset')!.getAttribute('aria-describedby')).toBe('g-error');
    expect(container.querySelectorAll('.apui-checkbox[data-invalid]')).toHaveLength(2);
  });
});

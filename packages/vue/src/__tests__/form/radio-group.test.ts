import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { RadioGroup } from '../../components/form';

const plans = [
  { value: 'starter', label: 'Starter', description: 'Up to 5', meta: '$0' },
  { value: 'growth', label: 'Growth' },
  { value: 'team', label: 'Team', disabled: true },
];

describe('RadioGroup', () => {
  it('renders a fieldset with the legend, items, hint and error', () => {
    const { container } = render(RadioGroup, {
      props: { label: 'Plan', hint: 'H', error: 'E', required: true, options: plans },
      attrs: { id: 'p' },
    });
    const root = container.querySelector('fieldset')!;
    expect(root.className).toBe('apui-radio-group');
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(root.getAttribute('data-variant')).toBe('default');
    expect(root.getAttribute('aria-describedby')).toBe('p-hint p-error');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'items',
      'hint',
      'error',
    ]);
  });

  it('names every radio alike and links descriptions', () => {
    render(RadioGroup, { props: { options: plans }, attrs: { id: 'p', name: 'plan' } });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((radio) => radio.name)).toEqual(['plan', 'plan', 'plan']);
    expect(radios[0]!.getAttribute('aria-describedby')).toBe('p-0-description');
    expect(radios[2]!.disabled).toBe(true);
  });

  it('supports v-model with the original value type', async () => {
    const { emitted } = render(RadioGroup, {
      props: {
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ],
        modelValue: 1,
      },
    });
    expect((screen.getByLabelText('One') as HTMLInputElement).checked).toBe(true);
    await fireEvent.click(screen.getByLabelText('Two'));
    expect(emitted()['update:modelValue']).toEqual([[2]]);
  });

  it('marks every radio invalid with an error', () => {
    render(RadioGroup, { props: { options: ['A', 'B'], error: 'Pick one.' } });
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio.getAttribute('aria-invalid')).toBe('true');
    }
  });

  it('renders no description or meta in segments', () => {
    const { container } = render(RadioGroup, { props: { variant: 'segmented', options: plans } });
    expect(container.querySelector('[data-part="item-description"]')).toBeNull();
    expect(container.querySelector('[data-part="item-meta"]')).toBeNull();
    expect(screen.getAllByRole('radio')[0]!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('emits the variant and orientation', () => {
    const { container } = render(RadioGroup, {
      props: { options: ['A'], variant: 'segmented', orientation: 'horizontal' },
    });
    expect(container.querySelector('fieldset')!.getAttribute('data-variant')).toBe('segmented');
    expect(container.querySelector('fieldset')!.getAttribute('data-orientation')).toBe(
      'horizontal',
    );
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { CheckboxGroup, ColorPicker, File, RadioGroup, Rating } from '../../components/form';

/** Form-choice components (#53) render no axe violations in their common states. */
describe('Form choice components accessibility', () => {
  const cases: [string, unknown, Record<string, unknown>][] = [
    [
      'RadioGroup cards',
      RadioGroup,
      {
        label: 'Plan',
        variant: 'cards',
        hint: 'Change any time.',
        options: [
          { value: 'a', label: 'Starter', description: 'Up to 5', meta: '$0' },
          { value: 'b', label: 'Growth' },
        ],
        modelValue: 'a',
      },
    ],
    [
      'CheckboxGroup with select all',
      CheckboxGroup,
      {
        label: 'Topics',
        selectAll: true,
        error: 'Pick one.',
        options: ['A', 'B'],
        modelValue: ['A'],
      },
    ],
    ['Rating input', Rating, { label: 'Rate the viewing', modelValue: 3, count: 4 }],
    ['Rating read-only', Rating, { readonly: true, modelValue: 3.5, count: 12 }],
    [
      'ColorPicker',
      ColorPicker,
      { label: 'Accent', modelValue: '#1f74bf', swatches: ['#1f74bf', '#c92f33'] },
    ],
    [
      'File with files',
      File,
      {
        label: 'Photos',
        hint: 'JPG only',
        modelValue: [
          { name: 'a.jpg', size: 1000 },
          { name: 'b.jpg', progress: 40 },
        ],
      },
    ],
  ];

  it.each(cases)('%s has no a11y violations', async (_name, component, props) => {
    const { container } = render(component as never, { props } as never);
    expect(await axe(container)).toHaveNoViolations();
  });
});

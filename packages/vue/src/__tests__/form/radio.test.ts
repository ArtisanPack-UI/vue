import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Radio } from '../../components/form';

const options = [
  { id: 'sm', name: 'Small', hint: 'Up to 2 people' },
  { id: 'md', name: 'Medium' },
  { id: 'lg', name: 'Large', disabled: true },
];

describe('Radio (deprecated alias of RadioGroup)', () => {
  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(Radio, { props: { options } });
    render(Radio, { props: { options } });
    const calls = warn.mock.calls.filter(([m]) => String(m).includes('Radio is deprecated'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('Radio is deprecated; use RadioGroup.');
    warn.mockRestore();
  });

  it('renders the design-system RadioGroup, with no DaisyUI markup', () => {
    const { container } = render(Radio, { props: { label: 'Size', options } });
    const root = container.querySelector('fieldset')!;
    expect(root.className).toBe('apui-radio-group');
    expect(root.getAttribute('data-variant')).toBe('default');
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(container.querySelector('.radio, .fieldset, .fieldset-legend')).toBeNull();
    expect(screen.getByText('Size')).toBeTruthy();
  });

  it('maps the 2.x option keys to value, label and description', () => {
    render(Radio, { props: { options } });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((radio) => radio.value)).toEqual(['sm', 'md', 'lg']);
    expect(screen.getByLabelText(/Small/)).toBe(radios[0]);
    expect(screen.getByText('Up to 2 people')).toBeTruthy();
    expect(radios[2]!.disabled).toBe(true);
  });

  it('reads custom option keys and falls back to the index for a missing value', () => {
    render(Radio, {
      props: {
        optionValue: 'code',
        optionLabel: 'title',
        options: [{ code: 'a', title: 'Alpha' }, { title: 'Beta' }],
      },
    });
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((radio) => radio.value)).toEqual(['a', '1']);
    expect(screen.getByLabelText('Beta')).toBe(radios[1]);
  });

  it('maps inline, card and cardClass', () => {
    const { container } = render(Radio, {
      props: { options, inline: true, card: true, cardClass: 'my-card' },
    });
    const root = container.querySelector('fieldset')!;
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    expect(root.getAttribute('data-variant')).toBe('cards');
    expect(container.querySelectorAll('[data-part="item"].my-card')).toHaveLength(3);
  });

  it('passes id and name through and consumes color', () => {
    const { container } = render(Radio, {
      props: { options, id: 'size', name: 'size', color: 'primary' },
    });
    const root = container.querySelector('fieldset')!;
    expect(root.id).toBe('size');
    expect(root.hasAttribute('color')).toBe(false);
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios.every((radio) => radio.name === 'size')).toBe(true);
  });

  it('shows the error and marks the radios invalid', () => {
    render(Radio, { props: { options, error: 'Pick a size.' } });
    expect(screen.getByText('Pick a size.')).toBeTruthy();
    expect(screen.getAllByRole('radio')[0]!.getAttribute('aria-invalid')).toBe('true');
  });

  it('supports v-model', async () => {
    const { emitted } = render(Radio, { props: { options, modelValue: 'sm' } });
    expect((screen.getAllByRole('radio')[0] as HTMLInputElement).checked).toBe(true);
    await fireEvent.click(screen.getAllByRole('radio')[1]!);
    expect(emitted()['update:modelValue']).toEqual([['md']]);
  });
});

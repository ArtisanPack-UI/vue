import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { ColorPicker } from '../../components/form';

const part = (name: string) =>
  document.querySelector(`[data-scope="color-picker"][data-part="${name}"]`)!;

describe('ColorPicker', () => {
  it('renders the field with the text value outside the popover', () => {
    render(ColorPicker, {
      props: {
        label: 'Primary',
        hint: 'H',
        error: 'E',
        required: true,
        modelValue: '#1F74BF',
        portal: false,
      },
      attrs: { id: 'c' },
    });
    const control = screen.getByLabelText(/Primary/) as HTMLInputElement;
    expect(control.getAttribute('data-part')).toBe('control');
    expect(control.value).toBe('#1f74bf');
    expect(control.getAttribute('aria-describedby')).toBe('c-hint c-error');
    expect(control.closest('[data-part="box"]')).not.toBeNull();
    expect(part('root').classList.contains('apui-color-picker')).toBe(true);
    expect(part('root').getAttribute('data-format')).toBe('hex');
    expect(
      screen.getByRole('button', { name: 'Choose a color' }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(part('content').hasAttribute('hidden')).toBe(true);
  });

  it('opens the popover with the area, sliders, format select and swatches', async () => {
    const { emitted } = render(ColorPicker, {
      props: {
        label: 'Accent',
        modelValue: '#1f74bf',
        swatches: ['#1f74bf', '#0b9488'],
        portal: false,
      },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Choose a color' }));
    await nextTick();
    expect(emitted()['update:open']).toEqual([[true]]);
    expect(screen.getByRole('dialog', { name: 'Choose a color' })).toBeTruthy();
    expect(
      screen
        .getByRole('slider', { name: 'Saturation and brightness' })
        .getAttribute('aria-valuetext'),
    ).toMatch(/%, \d+%$/);
    expect(screen.getByRole('slider', { name: 'Hue' }).getAttribute('aria-valuetext')).toMatch(
      /°$/,
    );
    expect(screen.getByRole('slider', { name: 'Opacity' }).getAttribute('aria-valuetext')).toBe(
      '100%',
    );
    expect((screen.getByRole('combobox', { name: 'Format' }) as HTMLSelectElement).value).toBe(
      'hex',
    );
    expect(screen.getByRole('button', { name: '#1F74BF' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('emits a chosen swatch, typed text and a format switch', async () => {
    const { emitted } = render(ColorPicker, {
      props: { label: 'Accent', swatches: ['#0b9488'], open: true, portal: false },
    });
    await fireEvent.click(screen.getByRole('button', { name: '#0B9488' }));
    expect(emitted()['update:modelValue']!.at(-1)).toEqual(['#0b9488']);

    const control = screen.getByLabelText('Accent') as HTMLInputElement;
    control.value = 'rgb(201 47 51)';
    await fireEvent.input(control);
    await fireEvent.keyDown(control, { key: 'Enter' });
    expect(emitted()['update:modelValue']!.at(-1)).toEqual(['#c92f33']);

    // Zag's Vue props listen for input on a select, which browsers fire with change.
    const select = screen.getByRole('combobox', { name: 'Format' }) as HTMLSelectElement;
    select.value = 'oklch';
    await fireEvent.input(select);
    await nextTick();
    expect(emitted()['format-change']).toEqual([['oklch']]);
    expect((emitted()['update:modelValue']!.at(-1) as string[])[0]).toMatch(/^oklch\(/);
    expect(part('root').getAttribute('data-format')).toBe('oklch');
  });

  it('leaves out the opacity slider without alpha and translates labels', () => {
    render(ColorPicker, {
      props: {
        label: 'Brand',
        alpha: false,
        modelValue: '#1f74bf80',
        open: true,
        portal: false,
        triggerLabel: 'Elegir color',
        hueLabel: 'Tono',
      },
    });
    expect(screen.queryByRole('slider', { name: 'Opacity' })).toBeNull();
    expect(screen.getByRole('slider', { name: 'Tono' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Elegir color' })).toBeTruthy();
    expect((screen.getByLabelText('Brand') as HTMLInputElement).value).toBe('#1f74bf');
  });

  it('hides the eyedropper without the EyeDropper API', () => {
    render(ColorPicker, { props: { label: 'Brand', open: true, portal: false } });
    expect(part('eye-dropper-trigger').hasAttribute('hidden')).toBe(true);
  });

  it('disables the field and the trigger', () => {
    render(ColorPicker, { props: { label: 'Locked', disabled: true, modelValue: '#000000' } });
    expect((screen.getByLabelText('Locked') as HTMLInputElement).disabled).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'Choose a color' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

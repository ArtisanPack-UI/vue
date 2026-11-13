import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { Range } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="range"][data-part="${name}"]`);
const controls = (container: Element) =>
  [
    ...container.querySelectorAll('[data-scope="range"][data-part="control"]'),
  ] as HTMLInputElement[];

describe('Range', () => {
  it('renders one native range over the drawn track', () => {
    const { container } = render(Range, {
      props: {
        label: 'Radius',
        modelValue: 20,
        max: 50,
        format: '{value} km',
        hint: 'H',
        error: 'E',
      },
      attrs: { id: 'r' },
    });
    const root = container.querySelector('.apui-range')!;
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect(root.getAttribute('data-show-value')).toBe('focus');
    expect(root.getAttribute('style')).toContain('--apui-_from: 0%');
    expect(root.getAttribute('style')).toContain('--apui-_to: 40%');
    const [control] = controls(container);
    expect(controls(container)).toHaveLength(1);
    expect(control!.getAttribute('type')).toBe('range');
    expect(control!.id).toBe('r');
    expect(control!.getAttribute('data-thumb')).toBe('end');
    expect(control!.getAttribute('aria-valuetext')).toBe('20 km');
    expect(control!.getAttribute('aria-describedby')).toBe('r-hint r-error');
    expect(partOf(container, 'label')!.getAttribute('for')).toBe('r');
    expect(partOf(container, 'bubble')!.textContent).toBe('20 km');
    expect(partOf(container, 'thumb')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to the midpoint without rendering a value', () => {
    const { container } = render(Range, { props: { label: 'Volume' } });
    expect(controls(container)[0]!.hasAttribute('value')).toBe(false);
    expect(container.querySelector('.apui-range')!.getAttribute('style')).toContain(
      '--apui-_to: 50%',
    );
    expect(partOf(container, 'control')!.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('omits the bubble when showValue is never', () => {
    const { container } = render(Range, { props: { label: 'V', showValue: 'never' } });
    expect(partOf(container, 'bubble')).toBeNull();
  });

  it('places marks at their values', () => {
    const { container } = render(Range, {
      props: {
        label: 'V',
        max: 50,
        marks: [
          { value: 0, label: '0 km' },
          { value: 25, label: '25 km' },
        ],
      },
    });
    const marks = [...container.querySelectorAll('[data-part="mark"]')];
    expect(marks.map((mark) => mark.getAttribute('style'))).toEqual([
      '--apui-_at: 0%;',
      '--apui-_at: 50%;',
    ]);
  });

  it('emits the number as the thumb moves', async () => {
    const { container, emitted } = render(Range, { props: { label: 'V', modelValue: 10 } });
    await fireEvent.update(controls(container)[0]!, '30');
    expect(emitted()['update:modelValue']).toEqual([[30]]);
    expect(container.querySelector('.apui-range')!.getAttribute('style')).toContain(
      '--apui-_to: 30%',
    );
  });

  it('renders two named thumbs with dual and keeps them from crossing', async () => {
    const { container, emitted } = render(Range, {
      props: { label: 'Price', dual: true, modelValue: [20, 60], thumbLabels: { start: 'Desde' } },
      attrs: { id: 'p' },
    });
    const root = container.querySelector('.apui-range')!;
    expect(root.hasAttribute('data-dual')).toBe(true);
    const [start, end] = controls(container);
    expect(start!.id).toBe('p');
    expect(end!.id).toBe('p-end');
    expect(start!.getAttribute('aria-labelledby')).toBe('p-label p-start-label');
    expect(end!.getAttribute('aria-labelledby')).toBe('p-label p-end-label');
    expect(container.querySelector('#p-start-label')!.textContent).toBe('Desde');
    expect(container.querySelector('#p-end-label')!.textContent).toBe('Maximum');
    expect(root.getAttribute('style')).toContain('--apui-_from: 20%');
    await fireEvent.update(start!, '80');
    expect(start!.value).toBe('60');
    expect(emitted()['update:modelValue']).toEqual([[[60, 60]]]);
    await fireEvent.update(end!, '90');
    expect(emitted()['update:modelValue']![1]).toEqual([[60, 90]]);
  });

  it('defaults dual to the whole range', () => {
    const { container } = render(Range, { props: { label: 'P', dual: true } });
    expect(controls(container).map((control) => control.getAttribute('value'))).toEqual([
      '0',
      '100',
    ]);
  });

  it('posts dual thumbs into one array and names each thumb once', () => {
    const { container } = render(Range, {
      props: { dual: true, min: 0, max: 100 },
      attrs: { name: 'price', 'aria-label': 'Price', 'aria-required': 'true' },
    });
    const [start, end] = controls(container);
    expect(start.getAttribute('name')).toBe('price[]');
    expect(end.getAttribute('name')).toBe('price[]');
    expect(start.hasAttribute('aria-label')).toBe(false);
    expect(end.hasAttribute('aria-label')).toBe(false);
    expect(start.getAttribute('aria-required')).toBe('true');
    expect(end.hasAttribute('aria-required')).toBe(false);
    expect(start.getAttribute('aria-labelledby')).toBe(
      `${start.id}-aria-label ${start.id}-start-label`,
    );
    expect(end.getAttribute('aria-labelledby')).toBe(
      `${start.id}-aria-label ${start.id}-end-label`,
    );
    expect(document.getElementById(`${start.id}-aria-label`)!.textContent).toBe('Price');
  });

  it('keeps name and aria-label on the one input without dual', () => {
    const { container } = render(Range, { attrs: { name: 'radius', 'aria-label': 'Radius' } });
    const [control] = controls(container);
    expect(control.getAttribute('name')).toBe('radius');
    expect(control.getAttribute('aria-label')).toBe('Radius');
  });
});

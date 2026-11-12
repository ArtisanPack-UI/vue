import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import Stat from '../../components/display/Stat/Stat.vue';

describe('Stat', () => {
  it('renders the root with its defaults', () => {
    const { container } = render(Stat, { props: { label: 'Profit', value: '$15,708.98' } });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-stat');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.hasAttribute('data-emphasis')).toBe(false);
    expect(root.querySelector('[data-part="top"] > [data-part="label"]')!.textContent).toBe(
      'Profit',
    );
    expect(root.querySelector('[data-part="value"]')!.textContent).toBe('$15,708.98');
  });

  it.each([
    [10.94, 'up', 'Increase 10.9%'],
    [-5.4, 'down', 'Decrease 5.4%'],
    [0, 'flat', 'No change 0.0%'],
  ])('formats change %s as the delta, with hidden text and an arrow', (change, trend, text) => {
    const { container } = render(Stat, {
      props: { value: '1', change, description: 'vs last month' },
    });
    const delta = container.querySelector('[data-part="foot"] > [data-part="delta"]')!;
    expect(delta.getAttribute('data-trend')).toBe(trend);
    expect(delta.querySelector('svg')).not.toBeNull();
    expect(delta.textContent).toBe(text);
    expect(container.querySelector('[data-part="description"]')!.textContent).toBe('vs last month');
  });

  it('prefers delta and trend over change, and translates labels', () => {
    const { container } = render(Stat, {
      props: { value: '34.6', delta: '6.2 hrs', trend: 'up', change: -1, upLabel: 'Sube' },
    });
    const delta = container.querySelector('[data-part="delta"]')!;
    expect(delta.getAttribute('data-trend')).toBe('up');
    expect(delta.textContent).toBe('Sube 6.2 hrs');
  });

  it('a delta without a trend has no arrow or hidden text', () => {
    const { container } = render(Stat, { props: { value: '7', delta: 'days in a row' } });
    const delta = container.querySelector('[data-part="delta"]')!;
    expect(delta.hasAttribute('data-trend')).toBe(false);
    expect(delta.querySelector('svg')).toBeNull();
    expect(delta.textContent).toBe('days in a row');
  });

  it('renders the unit, the icon slot and the default slot as the value', () => {
    const { container } = render(Stat, {
      props: { label: 'Latency', unit: 'ms', icon: 'wallet' },
      slots: {
        default: () => h('strong', '182'),
        icon: () => h('svg', { 'data-custom': '' }),
      },
    });
    expect(container.querySelector('[data-part="value"] > strong')!.textContent).toBe('182');
    expect(container.querySelector('[data-part="value"] > [data-part="unit"]')!.textContent).toBe(
      'ms',
    );
    expect(
      container.querySelector('[data-part="icon"][aria-hidden="true"] > svg[data-custom]'),
    ).not.toBeNull();
  });

  it('emphasis, bare, size, color and classes', () => {
    const { container } = render(Stat, {
      props: {
        value: '1',
        emphasis: true,
        bare: true,
        size: 'lg',
        color: 'primary',
        classes: { root: 'r', value: 'v' },
      },
    });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-stat r');
    expect(root.hasAttribute('data-emphasis')).toBe(true);
    expect(root.hasAttribute('data-bare')).toBe(true);
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect(container.querySelector('[data-part="value"]')!.className).toBe('v');
  });
});

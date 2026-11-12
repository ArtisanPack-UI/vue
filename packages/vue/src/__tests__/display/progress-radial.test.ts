import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ProgressRadial } from '../../components/display';

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="progress-radial"][data-part="${name}"]`);

describe('ProgressRadial', () => {
  it('draws the ring from size, thickness and value', () => {
    const { container } = render(ProgressRadial, {
      props: { value: 68, size: 80, thickness: 7, label: 'complete' },
    });
    const root = screen.getByRole('progressbar', { name: 'complete' });
    expect(root.className).toBe('apui-progress-radial');
    expect(root.getAttribute('aria-valuenow')).toBe('68');
    expect(root.getAttribute('style')).toContain('--apui-_s: 80px');
    const svg = part(container, 'svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 80 80');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    const bar = part(container, 'bar')!;
    expect(bar.getAttribute('cx')).toBe('40.0');
    expect(bar.getAttribute('r')).toBe('36.5');
    expect(bar.getAttribute('stroke-width')).toBe('7');
    expect(bar.getAttribute('stroke-dasharray')).toBe('229.3');
    expect(bar.getAttribute('stroke-dashoffset')).toBe('73.4');
    expect(part(container, 'track')!.hasAttribute('stroke-dasharray')).toBe(false);
    expect(part(container, 'value')!.textContent).toBe('68%complete');
  });

  it('spins a quarter arc without aria-valuenow while indeterminate', () => {
    const { container } = render(ProgressRadial, {
      props: { indeterminate: true },
      attrs: { 'aria-label': 'Calculating' },
    });
    const root = container.firstElementChild!;
    expect(root.hasAttribute('aria-valuenow')).toBe(false);
    expect(root.getAttribute('data-indeterminate')).toBe('');
    expect(part(root, 'value')).toBeNull();
    const bar = part(root, 'bar')!;
    expect(Number(bar.getAttribute('stroke-dashoffset'))).toBeCloseTo(
      Number(bar.getAttribute('stroke-dasharray')) * 0.75,
      0,
    );
  });

  it('hides the value and names the ring with aria-label', () => {
    const { container } = render(ProgressRadial, {
      props: { value: 50, hideValue: true, label: 'Profile complete', valueText: 'half' },
    });
    const root = screen.getByRole('progressbar', { name: 'Profile complete' });
    expect(root.hasAttribute('aria-labelledby')).toBe(false);
    expect(root.getAttribute('aria-valuetext')).toBe('half');
    expect(part(container, 'value')).toBeNull();
  });
});

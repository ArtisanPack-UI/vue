import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Progress } from '../../components/display';

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="progress"][data-part="${name}"]`);

describe('Progress', () => {
  it('is a progressbar named by its label, with the value in the head', () => {
    const { container } = render(Progress, {
      props: { value: 64, label: 'Uploading 12 photos', valueText: '8 of 12' },
    });
    const root = screen.getByRole('progressbar', { name: 'Uploading 12 photos' });
    expect(root.className).toBe('apui-progress');
    expect(root.getAttribute('aria-valuemin')).toBe('0');
    expect(root.getAttribute('aria-valuemax')).toBe('100');
    expect(root.getAttribute('aria-valuenow')).toBe('64');
    expect(root.getAttribute('aria-valuetext')).toBe('8 of 12');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect(part(container, 'value')!.textContent).toBe('8 of 12');
    expect((part(container, 'bar') as HTMLElement).getAttribute('style')).toContain(
      '--apui-_v: 64%',
    );
  });

  it('shows the percentage for a labelled bar, clamps, and has no head unlabelled', () => {
    const labelled = render(Progress, { props: { value: 150, max: 200, label: 'Visits' } });
    expect(part(labelled.container, 'value')!.textContent).toBe('75%');
    const clamped = render(Progress, { props: { value: 500 }, attrs: { 'aria-label': 'Over' } });
    const root = screen.getByRole('progressbar', { name: 'Over' });
    expect(root.getAttribute('aria-valuenow')).toBe('100');
    expect(part(clamped.container, 'head')).toBeNull();
    expect(root.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('leaves aria-valuenow out while indeterminate', () => {
    const { container } = render(Progress, {
      props: { indeterminate: true, label: 'Preparing export' },
    });
    const root = container.firstElementChild!;
    expect(root.hasAttribute('aria-valuenow')).toBe(false);
    expect(root.getAttribute('data-indeterminate')).toBe('');
    expect(part(root, 'bar')!.hasAttribute('style')).toBe(false);
    expect(part(root, 'value')).toBeNull();
  });

  it('renders one bar per segment, the done ones marked', () => {
    const { container } = render(Progress, { props: { segmented: true, value: 3, max: 5 } });
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-segmented')).toBe('');
    const bars = root.querySelectorAll('[data-part="bar"]');
    expect(bars).toHaveLength(5);
    expect(root.querySelectorAll('[data-part="bar"][data-done]')).toHaveLength(3);
    expect(root.getAttribute('aria-valuemax')).toBe('5');
  });

  it('takes modelValue when value is not set', () => {
    const { container } = render(Progress, { props: { modelValue: 30 } });
    expect(container.firstElementChild!.getAttribute('aria-valuenow')).toBe('30');
  });
});

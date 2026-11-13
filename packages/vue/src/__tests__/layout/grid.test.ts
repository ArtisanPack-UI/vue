import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Grid } from '../../components/layout';

describe('Grid', () => {
  it('renders the defaults as data attributes', () => {
    render(Grid, { slots: { default: '<div>A</div>' } });
    const root = document.querySelector<HTMLElement>('.apui-grid')!;
    expect(root.getAttribute('data-columns')).toBe('1');
    expect(root.getAttribute('data-gap')).toBe('4');
    expect(root.getAttribute('data-align')).toBe('stretch');
    expect(root.getAttribute('data-justify')).toBe('stretch');
    expect(root.getAttribute('style')).toBeNull();
    expect(root.className).toBe('apui-grid');
  });

  it('clamps columns, accepts numeric gaps and sets the min item width', () => {
    render(Grid, {
      props: { columns: 20, gap: 6, minItemWidth: '16rem', align: 'center', justify: 'end' },
    });
    const root = document.querySelector<HTMLElement>('.apui-grid')!;
    expect(root.getAttribute('data-columns')).toBe('12');
    expect(root.getAttribute('data-gap')).toBe('6');
    expect(root.style.getPropertyValue('--apui-grid-min-item-width')).toBe('16rem');
    expect(root.getAttribute('data-align')).toBe('center');
    expect(root.getAttribute('data-justify')).toBe('end');
  });
});

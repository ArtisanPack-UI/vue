import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Sparkline } from '../../components/display';

const data = [5, 10, 8, 15, 12, 20, 18, 25];

describe('Sparkline', () => {
  it('renders an SVG element', () => {
    const { container } = render(Sparkline, { props: { data } });
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders nothing when data is empty', () => {
    const { container } = render(Sparkline, { props: { data: [] } });
    expect(container.querySelector('svg')).toBeFalsy();
  });

  it('renders a line path by default', () => {
    const { container } = render(Sparkline, { props: { data } });
    const path = container.querySelector('path[stroke]');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('fill')).toBe('none');
  });

  it('renders area fill when type is area', () => {
    const { container } = render(Sparkline, {
      props: { data, type: 'area' },
    });
    const paths = container.querySelectorAll('path');
    // Should have both the fill path and the stroke path
    expect(paths.length).toBe(2);
  });

  it('renders bars when type is bar', () => {
    const { container } = render(Sparkline, {
      props: { data, type: 'bar' },
    });
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(data.length);
  });

  it('uses default width based on data length', () => {
    const { container } = render(Sparkline, { props: { data } });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe(String(data.length * 8));
  });

  it('uses custom width', () => {
    const { container } = render(Sparkline, {
      props: { data, width: 200 },
    });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('200');
  });

  it('uses custom height', () => {
    const { container } = render(Sparkline, {
      props: { data, height: 60 },
    });
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('60');
  });

  it('has correct ARIA role and accessible name', () => {
    const { container } = render(Sparkline, { props: { data } });
    const el = container.querySelector('[role="img"]');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('aria-label')).toBe('Sparkline chart');
  });

  it('applies custom className', () => {
    const { container } = render(Sparkline, {
      props: { data, className: 'my-sparkline' },
    });
    expect(container.querySelector('.my-sparkline')).toBeTruthy();
  });
});

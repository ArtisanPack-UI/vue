import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Chart } from '../../components/data';
import { defineComponent, h } from 'vue';

// Mock vue3-apexcharts as a simple component
vi.mock('vue3-apexcharts', () => {
  const MockChart = defineComponent({
    name: 'VueApexCharts',
    // eslint-disable-next-line vue/require-prop-types
    props: ['type', 'height', 'width', 'options', 'series'],
    render() {
      return h(
        'div',
        {
          class: 'apexcharts-mock',
          'data-type': this.type,
          'data-height': String(this.height),
        },
        JSON.stringify(this.series),
      );
    },
  });
  return { default: MockChart, __esModule: true };
});

const labels = ['Jan', 'Feb', 'Mar'];
const series = [
  { name: 'Sales', data: [10, 20, 30] },
  { name: 'Revenue', data: [5, 15, 25] },
];
const pieData = [
  { label: 'Chrome', value: 60, color: '#4285f4' },
  { label: 'Safari', value: 20, color: '#34a853' },
  { label: 'Firefox', value: 12, color: '#ff6d01' },
];

describe('Chart', () => {
  it('renders title', async () => {
    render(Chart, { props: { labels, series, title: 'Monthly Stats' } });
    expect(screen.getByText('Monthly Stats')).toBeTruthy();
  });

  it('renders the ApexCharts component', async () => {
    const { container } = render(Chart, { props: { labels, series } });
    // Wait for async component
    await vi.dynamicImportSettled();
    expect(container.querySelector('.apexcharts-mock')).toBeTruthy();
  });

  it('passes bar type by default', async () => {
    const { container } = render(Chart, { props: { labels, series } });
    await vi.dynamicImportSettled();
    const mock = container.querySelector('.apexcharts-mock');
    expect(mock?.getAttribute('data-type')).toBe('bar');
  });

  it('passes line type', async () => {
    const { container } = render(Chart, { props: { labels, series, type: 'line' } });
    await vi.dynamicImportSettled();
    const mock = container.querySelector('.apexcharts-mock');
    expect(mock?.getAttribute('data-type')).toBe('line');
  });

  it('passes height', async () => {
    const { container } = render(Chart, { props: { labels, series, height: 250 } });
    await vi.dynamicImportSettled();
    const mock = container.querySelector('.apexcharts-mock');
    expect(mock?.getAttribute('data-height')).toBe('250');
  });

  it('renders series data for multi-series charts', async () => {
    const { container } = render(Chart, { props: { labels, series } });
    await vi.dynamicImportSettled();
    const text = container.querySelector('.apexcharts-mock')?.textContent || '';
    expect(text).toContain('Sales');
    expect(text).toContain('Revenue');
  });

  it('renders numeric array for pie charts', async () => {
    const { container } = render(Chart, { props: { data: pieData, type: 'pie' } });
    await vi.dynamicImportSettled();
    const text = container.querySelector('.apexcharts-mock')?.textContent || '';
    expect(text).toContain('60');
    expect(text).toContain('20');
    expect(text).toContain('12');
  });

  it('applies custom className', () => {
    const { container } = render(Chart, {
      props: { labels, series, className: 'custom-chart' },
    });
    expect(container.querySelector('.custom-chart')).toBeTruthy();
  });
});

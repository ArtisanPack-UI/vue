<script setup lang="ts">
/** @module Chart */
import { computed, defineAsyncComponent } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { ChartProps } from './types';

const VueApexCharts = defineAsyncComponent(() =>
  import('vue3-apexcharts').then((m) => m.default || m),
);

const props = withDefaults(defineProps<ChartProps>(), {
  type: 'bar',
  height: 350,
  showLegend: true,
  animated: true,
});

const daisyToHex: Record<string, string> = {
  primary: '#6366f1',
  secondary: '#a855f7',
  accent: '#06b6d4',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: '#64748b',
};

const defaultPalette = [
  '#6366f1',
  '#f43f5e',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  return daisyToHex[color] || color;
}

const isSingleSeries = computed(() =>
  ['pie', 'donut', 'radialBar', 'polarArea'].includes(props.type || 'bar'),
);

const chartSeries = computed(() => {
  if (isSingleSeries.value) {
    return props.data ? props.data.map((d) => d.value) : [];
  }
  if (props.series) {
    return props.series.map((s) => ({
      name: s.name,
      data: s.data,
    }));
  }
  return [];
});

const defaultColor = computed(() => resolveColor(props.color));

const chartColors = computed(() => {
  if (isSingleSeries.value) {
    if (!props.data) return [];
    return props.data.map(
      (d, i) =>
        resolveColor(d.color) || defaultColor.value || defaultPalette[i % defaultPalette.length],
    );
  }
  if (props.series) {
    return props.series.map(
      (s, i) =>
        resolveColor(s.color) || defaultColor.value || defaultPalette[i % defaultPalette.length],
    );
  }
  if (defaultColor.value) return [defaultColor.value];
  return defaultPalette;
});

const chartLabels = computed(() => {
  if (isSingleSeries.value && props.data) {
    return props.data.map((d) => d.label);
  }
  return props.labels || [];
});

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const s = source[key];
    const t = target[key];
    if (
      s !== null &&
      typeof s === 'object' &&
      !Array.isArray(s) &&
      t !== null &&
      typeof t === 'object' &&
      !Array.isArray(t)
    ) {
      result[key] = deepMerge(t as Record<string, unknown>, s as Record<string, unknown>);
    } else {
      result[key] = s;
    }
  }
  return result;
}

const chartOptions = computed(() => {
  const base: Record<string, unknown> = {
    chart: {
      type: props.type,
      background: 'transparent',
      toolbar: { show: false },
      animations: {
        enabled: props.animated,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: chartColors.value,
    labels: chartLabels.value,
    xaxis: {
      categories: chartLabels.value,
      labels: { style: { colors: 'var(--color-base-content)' } },
    },
    yaxis: {
      labels: { style: { colors: 'var(--color-base-content)' } },
    },
    legend: {
      show: props.showLegend,
      labels: { colors: 'var(--color-base-content)' },
    },
    grid: {
      borderColor: 'var(--color-base-300)',
    },
    tooltip: {
      theme: 'dark',
    },
    dataLabels: {
      enabled: isSingleSeries.value,
    },
    stroke: {
      curve: 'smooth' as const,
    },
  };

  if (props.options) {
    return deepMerge(base, props.options);
  }
  return base;
});
</script>

<template>
  <div :class="cn('w-full', props.className)">
    <h3 v-if="title" class="text-lg font-semibold mb-2">
      {{ title }}
    </h3>
    <VueApexCharts
      :type="type"
      :height="height"
      :width="width"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

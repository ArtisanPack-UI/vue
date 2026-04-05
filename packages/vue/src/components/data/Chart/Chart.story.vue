<script setup lang="ts">
import Chart from './Chart.vue';
import type { ChartType } from './types';
import type { DaisyColor } from '@artisanpack-ui/tokens';
import { computed, ref } from 'vue';

const playgroundType = ref<ChartType>('bar');
const playgroundHeight = ref(350);
const playgroundAnimated = ref(true);
const playgroundShowLegend = ref(true);
const playgroundTitle = ref('');
const playgroundColor = ref<DaisyColor | ''>('');

const singleSeriesTypes: ChartType[] = ['pie', 'donut', 'radialBar', 'polarArea'];
const isSeriesBased = computed(() => !singleSeriesTypes.includes(playgroundType.value));
const resolvedColor = computed(
  () => (playgroundColor.value || undefined) as DaisyColor | undefined,
);
</script>

<template>
  <Story title="Data/Chart" group="data">
    <Variant title="Playground">
      <template #controls>
        <HstSelect
          v-model="playgroundType"
          title="Type"
          :options="[
            { value: 'bar', label: 'Bar' },
            { value: 'line', label: 'Line' },
            { value: 'area', label: 'Area' },
            { value: 'donut', label: 'Donut' },
            { value: 'pie', label: 'Pie' },
            { value: 'radialBar', label: 'Radial Bar' },
            { value: 'radar', label: 'Radar' },
            { value: 'polarArea', label: 'Polar Area' },
          ]"
        />
        <HstNumber v-model="playgroundHeight" title="Height" />
        <HstCheckbox v-model="playgroundAnimated" title="Animated" />
        <HstCheckbox v-model="playgroundShowLegend" title="Show Legend" />
        <HstText v-model="playgroundTitle" title="Title" />
        <HstSelect
          v-model="playgroundColor"
          title="Color"
          :options="[
            { value: '', label: 'Default Palette' },
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'accent', label: 'Accent' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' },
            { value: 'info', label: 'Info' },
          ]"
        />
      </template>

      <div style="max-width: 600px">
        <Chart
          v-if="isSeriesBased"
          :type="playgroundType"
          :series="[{ name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70] }]"
          :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :height="playgroundHeight"
          :animated="playgroundAnimated"
          :show-legend="playgroundShowLegend"
          :title="playgroundTitle || undefined"
          :color="resolvedColor"
        />
        <Chart
          v-else
          :type="playgroundType"
          :data="[
            { label: 'Desktop', value: 55 },
            { label: 'Mobile', value: 35 },
            { label: 'Tablet', value: 10 },
          ]"
          :height="playgroundHeight"
          :animated="playgroundAnimated"
          :show-legend="playgroundShowLegend"
          :title="playgroundTitle || undefined"
          :color="resolvedColor"
        />
      </div>
    </Variant>

    <Variant title="Bar Chart">
      <div style="max-width: 600px">
        <Chart
          type="bar"
          :series="[{ name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70] }]"
          :options="{ xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] } }"
          :height="350"
        />
      </div>
    </Variant>

    <Variant title="Line Chart">
      <div style="max-width: 600px">
        <Chart
          type="line"
          :series="[
            { name: 'Revenue', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
            { name: 'Expenses', data: [5, 20, 30, 40, 35, 50, 55, 60, 70] },
          ]"
          :height="350"
          :show-legend="true"
        />
      </div>
    </Variant>

    <Variant title="Area Chart">
      <div style="max-width: 600px">
        <Chart
          type="area"
          :series="[{ name: 'Visitors', data: [31, 40, 28, 51, 42, 109, 100] }]"
          :options="{ xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] } }"
          :height="350"
        />
      </div>
    </Variant>

    <Variant title="Donut Chart">
      <div style="max-width: 400px">
        <Chart
          type="donut"
          :data="[
            { label: 'Desktop', value: 55 },
            { label: 'Mobile', value: 35 },
            { label: 'Tablet', value: 10 },
          ]"
          :height="300"
          :show-legend="true"
        />
      </div>
    </Variant>

    <Variant title="Pie Chart">
      <div style="max-width: 400px">
        <Chart
          type="pie"
          :data="[
            { label: 'Chrome', value: 62 },
            { label: 'Firefox', value: 18 },
            { label: 'Safari', value: 12 },
            { label: 'Other', value: 8 },
          ]"
          :height="300"
          :show-legend="true"
        />
      </div>
    </Variant>

    <Variant title="Radial Bar Chart">
      <div style="max-width: 400px">
        <Chart
          type="radialBar"
          :data="[
            { label: 'CPU', value: 72 },
            { label: 'Memory', value: 58 },
            { label: 'Disk', value: 85 },
          ]"
          :height="300"
          :show-legend="true"
          title="System Usage"
        />
      </div>
    </Variant>

    <Variant title="Radar Chart">
      <div style="max-width: 500px">
        <Chart
          type="radar"
          :series="[
            { name: 'Team A', data: [80, 50, 30, 40, 100, 20] },
            { name: 'Team B', data: [20, 30, 40, 80, 20, 80] },
          ]"
          :labels="['Attack', 'Defense', 'Speed', 'Stamina', 'Skill', 'Luck']"
          :height="350"
          :show-legend="true"
        />
      </div>
    </Variant>

    <Variant title="Polar Area Chart">
      <div style="max-width: 400px">
        <Chart
          type="polarArea"
          :data="[
            { label: 'Q1', value: 42 },
            { label: 'Q2', value: 58 },
            { label: 'Q3', value: 35 },
            { label: 'Q4', value: 71 },
          ]"
          :height="300"
          :show-legend="true"
        />
      </div>
    </Variant>

    <Variant title="With Title and Custom Color">
      <div style="max-width: 600px">
        <Chart
          type="bar"
          title="Monthly Revenue"
          color="primary"
          :series="[{ name: 'Revenue', data: [12, 19, 3, 5, 2, 3] }]"
          :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
          :height="300"
          :animated="false"
        />
      </div>
    </Variant>

    <Variant title="Custom Width">
      <Chart
        type="line"
        :series="[{ name: 'Sales', data: [10, 20, 15, 25, 30] }]"
        :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri']"
        :height="250"
        width="400"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Chart

A chart component powered by ApexCharts supporting 8 chart types with DaisyUI color integration.

## Usage

```vue
<Chart
  type="bar"
  :series="[{ name: 'Sales', data: [30, 40, 35] }]"
  :labels="['Mon', 'Tue', 'Wed']"
  :height="350"
/>
```

## Props

| Prop         | Type               | Default | Description                                                          |
| ------------ | ------------------ | ------- | -------------------------------------------------------------------- |
| `type`       | `ChartType`        | `'bar'` | Chart type: bar, line, area, donut, pie, radialBar, radar, polarArea |
| `series`     | `ChartSeries[]`    | —       | Multi-series data for bar, line, area, and radar charts              |
| `data`       | `ChartDataPoint[]` | —       | Simple data points for pie, donut, radialBar, and polarArea charts   |
| `labels`     | `string[]`         | —       | Labels for x-axis categories or slice labels                         |
| `height`     | `number \| string` | `350`   | Chart height in pixels or CSS value                                  |
| `width`      | `number \| string` | —       | Chart width in pixels or CSS value                                   |
| `color`      | `DaisyColor`       | —       | Default DaisyUI color applied to all series                          |
| `showLegend` | `boolean`          | `true`  | Whether to display the chart legend                                  |
| `animated`   | `boolean`          | `true`  | Whether to enable chart animations                                   |
| `title`      | `string`           | —       | Chart title displayed above the chart                                |
| `options`    | `object`           | —       | ApexCharts options for advanced customization (deep-merged)          |
| `className`  | `string`           | —       | Additional CSS classes                                               |
</docs>

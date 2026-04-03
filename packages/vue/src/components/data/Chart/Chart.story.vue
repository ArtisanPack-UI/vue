<script setup lang="ts">
import Chart from './Chart.vue';
</script>

<template>
  <Story title="Data/Chart" group="data">
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
  </Story>
</template>

<docs lang="md">
# Chart

A chart component powered by ApexCharts supporting bar, line, area, donut, pie, and more.
</docs>

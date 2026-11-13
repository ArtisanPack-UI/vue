<script setup lang="ts">
import Chart from './Chart.vue';

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
const revenue = [
  { name: 'Revenue', data: [4100, 6000, 8200, 10000, 4000, 8000, 4000, 8000, 6000, 4000] },
];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'];
const salesAndTarget = [
  { name: 'Sales', data: [600000, 1800000, 2600000, 3200000, 3600000, 4400000, 6100000, 7400000] },
  {
    name: 'Target',
    data: [3200000, 4400000, 3800000, 5200000, 6100000, 6600000, 7000000, 6400000],
  },
];
const countries = ['United States', 'Mexico', 'Canada', 'Other'];
</script>

<template>
  <Story title="Data/Chart" group="data">
    <Variant title="Bar">
      <Chart
        type="bar"
        title="Weekly revenue"
        description="The Grove at Greenfield · best week labeled"
        :labels="weeks"
        :series="revenue"
        prefix="$"
        notation="compact"
      />
    </Variant>

    <Variant title="Area">
      <Chart
        type="area"
        title="Analytic"
        description="Sales estimation vs target"
        :labels="quarters"
        :series="salesAndTarget"
        prefix="$"
        notation="compact"
        :width="1000"
        :height="260"
      />
    </Variant>

    <Variant title="Line">
      <Chart
        type="line"
        title="Analytic"
        description="Sales estimation vs target"
        :labels="quarters"
        :series="salesAndTarget"
        prefix="$"
        notation="compact"
        :width="1000"
        :height="260"
      />
    </Variant>

    <Variant title="Donut with a data table">
      <Chart
        type="donut"
        title="Active listings"
        description="By country"
        :labels="countries"
        :series="[1240, 990, 723, 260]"
        tabular
      />
    </Variant>
  </Story>
</template>

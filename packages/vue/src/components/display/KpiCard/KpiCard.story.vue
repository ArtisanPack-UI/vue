<script setup lang="ts">
import KpiCard from './KpiCard.vue';
</script>

<template>
  <Story title="Display/KpiCard" group="display">
    <Variant title="Trend and target">
      <KpiCard
        style="max-width: 320px"
        :stat="{
          label: 'Profit',
          value: '$15,708.98',
          icon: 'trending-up',
          color: 'success',
          change: 8.1,
          description: 'vs last month',
        }"
        :sparkline="[2, 4, 2, 6, 8, 6, 10, 12, 14]"
        :target="{ value: 15708.98, max: 25000, label: 'Goal $25,000' }"
      />
    </Variant>

    <Variant title="With a period control">
      <KpiCard
        style="max-width: 360px"
        :stat="{
          label: 'Total income',
          value: '$348,261',
          change: 10.9,
          description: 'vs last month',
        }"
        :sparkline="[1, 3, 2, 7, 6, 10, 12, 11, 16]"
      >
        <template #period>
          <select aria-label="Period">
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
          </select>
        </template>
      </KpiCard>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Stat from './Stat.vue';
</script>

<template>
  <Story title="Display/Stat" group="display">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.value" title="Value" />
        <HstText v-model="state.description" title="Description" />
        <HstText v-model="state.change" title="Change" />
        <HstSelect
          v-model="state.changeDirection"
          title="Direction"
          :options="['', 'up', 'down', 'neutral']"
        />
      </template>

      <template #default="{ state }">
        <Stat
          :title="state.title || 'Revenue'"
          :value="state.value || '$45,231'"
          :description="state.description || 'vs last month'"
          :change="state.change || '+12.5%'"
          :change-direction="state.changeDirection || 'up'"
        />
      </template>
    </Variant>

    <Variant title="Dashboard Stats">
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <Stat
          title="Total Users"
          value="12,345"
          description="All time"
          change="+8.2%"
          change-direction="up"
        />
        <Stat
          title="Revenue"
          value="$89,000"
          description="This month"
          change="-2.1%"
          change-direction="down"
        />
        <Stat
          title="Orders"
          value="1,230"
          description="This week"
          change="0%"
          change-direction="neutral"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Stat

A statistic display with title, value, description, and directional change indicator.
</docs>

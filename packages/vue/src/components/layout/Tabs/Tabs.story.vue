<script setup lang="ts">
import { ref } from 'vue';
import Tab from './Tab.vue';
import Tabs from './Tabs.vue';
import type { TabData } from './types';

const section = ref('overview');
const range = ref('week');
const ranges: TabData[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];
</script>

<template>
  <Story title="Layout/Tabs" group="layout">
    <Variant title="Segmented">
      <Tabs v-model="section" label="Sections">
        <Tab value="overview" label="Overview" icon="list">Your portfolio at a glance.</Tab>
        <Tab value="notifications" label="Notifications" :count="4">Four unread notifications.</Tab>
        <Tab value="history" label="Trade history">Every trade in the last year.</Tab>
        <Tab value="archived" label="Archived" disabled />
      </Tabs>
    </Variant>
    <Variant title="Underline, manual activation">
      <Tabs variant="underline" activation-mode="manual">
        <Tab value="overview" label="Overview">Your portfolio at a glance.</Tab>
        <Tab value="notifications" label="Notifications" :count="4">Four unread notifications.</Tab>
        <Tab value="history" label="Trade history">Every trade in the last year.</Tab>
      </Tabs>
    </Variant>
    <Variant title="Small, from data">
      <Tabs v-model="range" size="sm" label="Range" :tabs="ranges" />
    </Variant>
    <Variant title="Vertical">
      <Tabs orientation="vertical" variant="underline">
        <Tab value="profile" label="Profile">Name and photo.</Tab>
        <Tab value="security" label="Security">Password and two-factor.</Tab>
      </Tabs>
    </Variant>
  </Story>
</template>

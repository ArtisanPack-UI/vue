<script setup lang="ts">
import { ref } from 'vue';
import Calendar from './Calendar.vue';

const selectedDate = ref('');
const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const events = [
  { id: '1', title: 'Team Meeting', date: `${y}-${m}-15`, color: 'primary' as const },
  { id: '2', title: 'Launch Day', date: `${y}-${m}-20`, color: 'success' as const },
  { id: '3', title: 'Deadline', date: `${y}-${m}-25`, color: 'error' as const },
];
</script>

<template>
  <Story title="Data/Calendar" group="data">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.month" title="Month (0-11)" />
        <HstNumber v-model="state.year" title="Year" />
        <HstSelect v-model="state.weekStart" title="Week Start" :options="[0, 1]" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Calendar
            v-model="selectedDate"
            :month="state.month"
            :year="state.year"
            :week-start="state.weekStart"
            :events="events"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Events">
      <div style="max-width: 400px">
        <Calendar v-model="selectedDate" :month="now.getMonth()" :year="y" :events="events" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Calendar

A monthly calendar with date selection, events, and configurable week start.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import Calendar from './Calendar.vue';
import type { CalendarEvent, CalendarView } from './types';

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
    description: 'Weekly sync with the marketing team.',
  },
  {
    id: 2,
    start: '2026-11-03T10:00',
    end: '2026-11-03T12:00',
    title: 'Marketing course',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 3,
    start: '2026-11-03T13:00',
    title: 'Lunch · Edgehill Grill',
    color: 'success',
    category: 'Personal',
  },
  { id: 4, start: '2026-11-05', title: 'Anna’s birthday', color: 'accent', category: 'People' },
  {
    id: 5,
    start: '2026-11-09T11:00',
    title: 'Upgrade Slack plan',
    color: 'secondary',
    category: 'Admin',
  },
  {
    id: 6,
    start: '2026-11-12T11:00',
    title: 'Viewing · Lakeview',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 7,
    start: '2026-11-12T16:00',
    title: 'Hubstaff broadcast',
    color: 'info',
    category: 'Learning',
  },
  {
    id: 8,
    start: '2026-11-12T18:00',
    title: 'Board dinner',
    color: 'success',
    category: 'Personal',
  },
  {
    id: 9,
    start: '2026-11-13T09:30',
    title: 'Meet a new intern',
    color: 'accent',
    category: 'People',
  },
  {
    id: 10,
    start: '2026-11-17',
    title: 'Facebook campaign',
    color: 'error',
    category: 'Marketing',
  },
  {
    id: 11,
    start: '2026-11-19T10:00',
    end: '2026-11-19T11:30',
    title: 'Design review',
    color: 'primary',
    category: 'Viewings',
  },
  {
    id: 12,
    start: '2026-11-24',
    title: 'Open house · Grove',
    color: 'success',
    category: 'Personal',
  },
  { id: 13, start: '2026-11-26', title: 'Thanksgiving', color: 'neutral', category: 'Holidays' },
];

/** Every variant binds its view and date, so previous, next, the tabs and "+N more" work. */
const variant = (view: CalendarView, date: string) => ({ view: ref(view), date: ref(date) });
const month = variant('month', '2026-11-07');
const week = variant('week', '2026-11-12');
const day = variant('day', '2026-11-12');
const agenda = variant('agenda', '2026-11-07');
const controlled = variant('month', '2026-11-07');
const rtl = variant('month', '2026-11-07');
</script>

<template>
  <Story title="Data/Calendar" group="data">
    <Variant title="Month">
      <Calendar
        v-model:view="month.view.value"
        v-model:date="month.date.value"
        :events="events"
        today="2026-11-07"
        :week-starts-on="1"
        creatable
      />
    </Variant>
    <Variant title="Week">
      <Calendar
        v-model:view="week.view.value"
        v-model:date="week.date.value"
        :events="events"
        today="2026-11-07"
        :week-starts-on="1"
      />
    </Variant>
    <Variant title="Day">
      <Calendar
        v-model:view="day.view.value"
        v-model:date="day.date.value"
        :events="events"
        today="2026-11-07"
        :week-starts-on="1"
      />
    </Variant>
    <Variant title="Agenda">
      <Calendar
        v-model:view="agenda.view.value"
        v-model:date="agenda.date.value"
        :events="events"
        today="2026-11-07"
        :week-starts-on="1"
      />
    </Variant>
    <Variant title="Controlled (v-model)">
      <Calendar
        v-model:view="controlled.view.value"
        v-model:date="controlled.date.value"
        :events="events"
        today="2026-11-07"
        :week-starts-on="1"
      />
    </Variant>
    <Variant title="Right to left">
      <div dir="rtl">
        <Calendar
          v-model:view="rtl.view.value"
          v-model:date="rtl.date.value"
          :events="events"
          today="2026-11-07"
          :week-starts-on="1"
        />
      </div>
    </Variant>
  </Story>
</template>

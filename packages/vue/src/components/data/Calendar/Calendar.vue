<script setup lang="ts">
/** @module Calendar */
import { computed, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CalendarProps, CalendarEvent } from './types';

const props = withDefaults(defineProps<CalendarProps>(), {
  weekStart: 0,
  events: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [date: string];
  'date-click': [date: string];
  'month-change': [payload: { month: number; year: number }];
}>();

const autoId = useId();
const monthLabelId = `calendar-month-${autoId}`;

const initialNow = new Date();
const currentMonth = ref(props.month ?? initialNow.getMonth() + 1);
const currentYear = ref(props.year ?? initialNow.getFullYear());

watch(
  () => [props.month, props.year],
  ([m, y]) => {
    if (m !== undefined) currentMonth.value = m;
    if (y !== undefined) currentYear.value = y;
  },
);

const dayLabels = computed(() => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (props.weekStart === 1) {
    return [...days.slice(1), days[0]];
  }
  return days;
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value - 1;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDow = firstDay.getDay();
  if (props.weekStart === 1) {
    startDow = startDow === 0 ? 6 : startDow - 1;
  }

  const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isToday: boolean }> = [];

  // Previous month padding (month is 0-indexed, formatDate expects 1-indexed)
  const prevMonthEnd = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthEnd - i;
    const prevMonth1Indexed = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({
      date: formatDate(prevYear, prevMonth1Indexed, d),
      day: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month
  const today = new Date();
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const isToday =
      d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push({
      date: formatDate(year, month + 1, d),
      day: d,
      isCurrentMonth: true,
      isToday,
    });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month + 2 > 12 ? 1 : month + 2;
    const nextYear = month + 2 > 12 ? year + 1 : year;
    days.push({
      date: formatDate(nextYear, nextMonth, d),
      day: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
});

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
});

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

const eventsByDate = computed(() => {
  const map: Record<string, CalendarEvent[]> = {};
  for (const event of props.events) {
    if (!map[event.date]) map[event.date] = [];
    map[event.date].push(event);
  }
  return map;
});

function getEventsForDate(date: string): CalendarEvent[] {
  return eventsByDate.value[date] ?? [];
}

function isDisabled(date: string): boolean {
  if (props.minDate && date < props.minDate) return true;
  if (props.maxDate && date > props.maxDate) return true;
  return false;
}

function getDateAriaLabel(date: string): string {
  const events = getEventsForDate(date);
  if (events.length === 0) return date;
  return `${date}, ${events.length} ${events.length === 1 ? 'event' : 'events'}`;
}

function selectDate(date: string) {
  if (isDisabled(date)) return;
  emit('update:modelValue', date);
  emit('date-click', date);
}

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  emit('month-change', { month: currentMonth.value, year: currentYear.value });
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  emit('month-change', { month: currentMonth.value, year: currentYear.value });
}

const colorDotMap: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-neutral',
};

const calendarWeeks = computed(() => {
  const days = calendarDays.value;
  const weeks: Array<typeof days> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
});
</script>

<template>
  <div :class="cn('card bg-base-100 shadow-sm p-4', props.className)">
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        aria-label="Previous month"
        @click="prevMonth"
      >
        ‹
      </button>
      <span :id="monthLabelId" class="font-semibold" aria-live="polite">{{ monthLabel }}</span>
      <button type="button" class="btn btn-ghost btn-sm" aria-label="Next month" @click="nextMonth">
        ›
      </button>
    </div>
    <div class="text-center text-sm" role="grid" :aria-labelledby="monthLabelId">
      <div class="grid grid-cols-7 gap-1" role="row">
        <div
          v-for="day in dayLabels"
          :key="day"
          class="font-semibold text-base-content/60 py-1"
          role="columnheader"
        >
          {{ day }}
        </div>
      </div>
      <div
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        class="grid grid-cols-7 gap-1"
        role="row"
      >
        <button
          v-for="cell in week"
          :key="cell.date"
          type="button"
          :class="
            cn(
              'p-1 rounded-lg text-sm relative transition-colors',
              !cell.isCurrentMonth && 'opacity-30',
              cell.isToday && 'font-bold ring-1 ring-primary',
              modelValue === cell.date && 'bg-primary text-primary-content',
              isDisabled(cell.date) && 'opacity-20 cursor-not-allowed',
              !isDisabled(cell.date) && 'hover:bg-base-200 cursor-pointer',
            )
          "
          :disabled="isDisabled(cell.date)"
          :aria-selected="modelValue === cell.date"
          :aria-label="getDateAriaLabel(cell.date)"
          role="gridcell"
          @click="selectDate(cell.date)"
        >
          {{ cell.day }}
          <div
            v-if="getEventsForDate(cell.date).length > 0"
            class="flex justify-center gap-0.5 mt-0.5"
          >
            <span
              v-for="event in getEventsForDate(cell.date).slice(0, 3)"
              :key="event.id"
              :class="
                cn('w-1 h-1 rounded-full', event.color ? colorDotMap[event.color] : 'bg-primary')
              "
            />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

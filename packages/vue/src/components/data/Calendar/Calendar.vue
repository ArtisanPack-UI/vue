<script setup lang="ts">
/**
 * @module Calendar
 *
 * The design-system Calendar (#64): events on a month grid, a week, a day or
 * an agenda list, rendering the `.apui-calendar` markup contract. The days,
 * titles, labels and event order come from the behavior package's
 * `calendarModel`, the same rules Livewire's server-rendered grid ports to
 * PHP. The toolbar uses the design-system Button and the Tabs markup; event
 * details open in the design-system Dialog (the `#details` slot replaces its
 * body). `v-model:view` and `v-model:date` bind the view and date.
 */
import {
  CALENDAR_LABELS,
  CALENDAR_MAX_EVENTS,
  calendarGridKeydown,
  calendarModel,
  rovingKeydown,
  type CalendarEvent,
  type CalendarItem,
  type CalendarView,
} from '@artisanpack-ui/behavior';
import { computed, ref, useAttrs, useId, watch } from 'vue';
import { safeHref } from '../../_shared/design-system';
import Button from '../../form/Button/Button.vue';
import EmptyState from '../../feedback/EmptyState/EmptyState.vue';
import Dialog from '../../layout/Dialog/Dialog.vue';
import Stack from '../../layout/Stack/Stack.vue';
import Text from '../../layout/Text/Text.vue';
import Badge from '../../display/Badge/Badge.vue';
import type { CalendarProps } from './types';

const props = withDefaults(defineProps<CalendarProps>(), {
  view: undefined,
  date: undefined,
  today: undefined,
  events: () => [],
  weekStartsOn: undefined,
  locale: 'en-US',
  timeZone: undefined,
  maxEvents: CALENDAR_MAX_EVENTS,
  creatable: false,
  details: true,
  labels: undefined,
  classes: undefined,
  modelValue: undefined,
  month: undefined,
  year: undefined,
  weekStart: undefined,
  minDate: undefined,
  maxDate: undefined,
  className: undefined,
});

const emit = defineEmits<{
  'view-change': [view: CalendarView];
  'update:view': [view: CalendarView];
  'date-change': [date: string];
  'update:date': [date: string];
  'event-click': [event: CalendarEvent];
  create: [date: string];
  /** @deprecated 2.x: use `update:date`. */
  'update:modelValue': [date: string];
  /** @deprecated 2.x: use `date-change`. The shown month (1–12) and year, when they change. */
  'month-change': [payload: { month: number; year: number }];
}>();

defineSlots<{
  /** Replaces the details Dialog's body. */
  details?: (props: { event: CalendarEvent }) => unknown;
}>();

const VIEWS: readonly CalendarView[] = ['month', 'week', 'day', 'agenda'];

const attrs = useAttrs();
const generated = useId();
const id = computed(() =>
  typeof attrs.id === 'string' && attrs.id !== ''
    ? attrs.id
    : `apui-calendar-${generated.replace(/[^\w-]/g, '')}`,
);
const titleId = computed(() => `${id.value}-title`);
const bodyId = computed(() => `${id.value}-body`);
const tabId = (option: CalendarView) => `${id.value}-tab-${option}`;

/** The 2.x v-model value, or month (1–12, clamped) and year, as a date. */
const legacyDate = (): string | undefined => {
  if (props.modelValue) return props.modelValue;
  if (Number.isFinite(props.year) && Number.isFinite(props.month)) {
    const month = Math.min(12, Math.max(1, Math.trunc(props.month!)));
    return `${String(Math.trunc(props.year!)).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`;
  }
  return undefined;
};

const ownView = ref<CalendarView>(props.view ?? 'month');
const ownDate = ref<string | undefined>(props.date ?? legacyDate());
watch(
  () => props.modelValue,
  () => {
    const value = legacyDate();
    if (value !== undefined) ownDate.value = value;
  },
);
// A 2.x parent writes `month-change` back into `month` and `year`. Only a
// different month re-seeds, so navigating keeps its day instead of the 1st.
watch(
  () => [props.month, props.year],
  () => {
    const value = legacyDate();
    if (value !== undefined && value.slice(0, 7) !== model.value.date.slice(0, 7)) {
      ownDate.value = value;
    }
  },
);
const selected = ref<CalendarItem | null>(null);
/** The cell the arrow keys last focused, for the view and date it was in. */
const roving = ref<{ period: string; date: string } | null>(null);

const classes = computed(() => props.classes ?? {});
const model = computed(() =>
  calendarModel({
    view: props.view ?? ownView.value,
    date: props.date ?? ownDate.value,
    today: props.today,
    events: props.events,
    weekStartsOn: props.weekStartsOn ?? props.weekStart,
    locale: props.locale,
    timeZone: props.timeZone,
    maxEvents: props.maxEvents,
    labels: { ...CALENDAR_LABELS, ...(props.labels ?? {}) },
  }),
);
const text = computed(() => model.value.labels);
const period = computed(() => `${model.value.view}:${model.value.date}`);
/** The one cell in the tab order: the last arrow-key target, else the model's. */
const tabStop = computed(() => {
  const date = roving.value?.period === period.value ? roving.value.date : null;
  if (date !== null && model.value.rows.some((row) => row.some((day) => day.date === date))) {
    return date;
  }
  return model.value.rows.flat().find((day) => day.focus)?.date ?? null;
});

function changeView(next: CalendarView) {
  if (props.view === undefined) ownView.value = next;
  emit('update:view', next);
  emit('view-change', next);
}

function changeDate(next: string) {
  const shown = model.value.date;
  if (props.date === undefined) ownDate.value = next;
  emit('update:date', next);
  emit('date-change', next);
  if (props.modelValue !== undefined) emit('update:modelValue', next);
  if (next.slice(0, 7) !== shown.slice(0, 7)) {
    const [year, month] = next.split('-').map(Number);
    emit('month-change', { month: month!, year: year! });
  }
}

function chooseEvent(item: CalendarItem) {
  emit('event-click', item.event);
  if (props.details) selected.value = item;
}

function openDay(date: string) {
  changeDate(date);
  changeView('day');
}

function onDialogOpen(open: boolean) {
  if (!open) selected.value = null;
}

function onGridKeydown(event: KeyboardEvent) {
  const cell = calendarGridKeydown(event, event.currentTarget as Element);
  const date = cell?.getAttribute('data-date');
  if (date) roving.value = { period: period.value, date };
}

function onTabsKeydown(event: KeyboardEvent) {
  rovingKeydown(event, event.currentTarget as Element, '[role="tab"]');
}

const hrefOf = (item: CalendarItem) => safeHref(item.href);
</script>

<template>
  <div :id="id" :class="['apui-calendar', classes.root, className]" :data-view="model.view">
    <div data-scope="calendar" data-part="toolbar" :class="classes.toolbar">
      <Button
        variant="outline"
        color="neutral"
        size="sm"
        data-scope="calendar"
        data-part="today-trigger"
        :class="classes.todayTrigger"
        @click="changeDate(model.today)"
      >
        {{ text.today }}
      </Button>
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="chevron-left"
        :aria-label="text.previous"
        data-scope="calendar"
        data-part="previous-trigger"
        :class="classes.previousTrigger"
        @click="changeDate(model.previousDate)"
      />
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        icon-only
        leading-icon="chevron-right"
        :aria-label="text.next"
        data-scope="calendar"
        data-part="next-trigger"
        :class="classes.nextTrigger"
        @click="changeDate(model.nextDate)"
      />
      <h2
        :id="titleId"
        data-scope="calendar"
        data-part="title"
        aria-live="polite"
        :class="classes.title"
      >
        {{ model.title }}
      </h2>
      <div
        :class="['apui-tabs', classes.viewTabs]"
        data-variant="segmented"
        data-size="sm"
        data-scope="calendar"
        data-part="view-tabs"
      >
        <div
          data-scope="tabs"
          data-part="list"
          role="tablist"
          :aria-label="text.views"
          @keydown="onTabsKeydown"
        >
          <button
            v-for="option in VIEWS"
            :id="tabId(option)"
            :key="option"
            type="button"
            data-scope="tabs"
            data-part="trigger"
            role="tab"
            :aria-selected="option === model.view ? 'true' : 'false'"
            :aria-controls="bodyId"
            :tabindex="option === model.view ? 0 : -1"
            :data-selected="option === model.view ? '' : undefined"
            @click="changeView(option)"
          >
            {{ text[option] }}
          </button>
        </div>
      </div>
      <Button
        v-if="creatable"
        size="sm"
        leading-icon="plus"
        data-scope="calendar"
        data-part="create-trigger"
        :class="classes.createTrigger"
        @click="emit('create', model.date)"
      >
        {{ text.newEvent }}
      </Button>
    </div>
    <div
      :id="bodyId"
      data-scope="calendar"
      data-part="body"
      role="tabpanel"
      :aria-labelledby="tabId(model.view)"
      :class="classes.body"
    >
      <template v-if="model.view === 'agenda'">
        <EmptyState
          v-if="model.agenda.length === 0"
          size="sm"
          icon="calendar"
          :title="text.empty"
        />
        <ul
          v-else
          data-scope="calendar"
          data-part="grid"
          :aria-labelledby="titleId"
          :class="classes.grid"
        >
          <li
            v-for="day in model.agenda"
            :key="day.date"
            data-scope="calendar"
            data-part="row"
            :data-date="day.date"
            :data-today="day.today ? '' : undefined"
            :class="classes.row"
          >
            <h3
              :id="`${id}-${day.date}`"
              data-scope="calendar"
              data-part="weekday"
              :data-today="day.today ? '' : undefined"
              :class="classes.weekday"
            >
              {{ day.label }}
            </h3>
            <ul
              data-scope="calendar"
              data-part="cell"
              :aria-labelledby="`${id}-${day.date}`"
              :class="classes.cell"
            >
              <li v-for="item in day.events" :key="item.key">
                <component
                  :is="hrefOf(item) ? 'a' : 'button'"
                  :href="hrefOf(item)"
                  :type="hrefOf(item) ? undefined : 'button'"
                  data-scope="calendar"
                  data-part="event"
                  :data-color="item.color"
                  :data-event-key="item.eventKey"
                  :aria-haspopup="!hrefOf(item) && details ? 'dialog' : undefined"
                  :class="classes.event"
                  @click="hrefOf(item) ? undefined : chooseEvent(item)"
                >
                  <span
                    v-if="item.range !== ''"
                    data-scope="calendar"
                    data-part="event-time"
                    :class="classes.eventTime"
                    >{{ item.range }}</span
                  ><span
                    data-scope="calendar"
                    data-part="event-title"
                    :class="classes.eventTitle"
                    >{{ item.title }}</span
                  ><span class="apui-sr-only">, {{ item.context }}</span>
                </component>
              </li>
            </ul>
          </li>
        </ul>
      </template>
      <div
        v-else
        data-scope="calendar"
        data-part="grid"
        role="grid"
        :aria-labelledby="titleId"
        :class="classes.grid"
        @keydown="onGridKeydown"
      >
        <div data-scope="calendar" data-part="row" role="row" :class="classes.row">
          <div
            v-for="(weekday, index) in model.weekdays"
            :key="index"
            data-scope="calendar"
            data-part="weekday"
            role="columnheader"
            :data-today="weekday.today ? '' : undefined"
            :class="classes.weekday"
          >
            {{ weekday.short
            }}<template v-if="weekday.day !== null">
              <span data-scope="calendar" data-part="date" :class="classes.date">{{
                weekday.day
              }}</span></template
            >
          </div>
        </div>
        <div
          v-for="row in model.rows"
          :key="row[0]!.date"
          data-scope="calendar"
          data-part="row"
          role="row"
          :class="classes.row"
        >
          <div
            v-for="day in row"
            :id="`${id}-${day.date}`"
            :key="day.date"
            data-scope="calendar"
            data-part="cell"
            role="gridcell"
            :data-date="day.date"
            :tabindex="day.date === tabStop ? 0 : -1"
            :data-outside="day.outside ? '' : undefined"
            :data-today="day.today ? '' : undefined"
            :aria-current="day.today ? 'date' : undefined"
            :class="classes.cell"
          >
            <span class="apui-sr-only">{{ day.label }}</span>
            <span
              v-if="model.view === 'month'"
              data-scope="calendar"
              data-part="date"
              aria-hidden="true"
              :class="classes.date"
              >{{ day.day }}</span
            >
            <component
              :is="hrefOf(item) ? 'a' : 'button'"
              v-for="item in day.events"
              :key="item.key"
              :href="hrefOf(item)"
              :type="hrefOf(item) ? undefined : 'button'"
              data-scope="calendar"
              data-part="event"
              :data-color="item.color"
              :data-event-key="item.eventKey"
              :aria-haspopup="!hrefOf(item) && details ? 'dialog' : undefined"
              :class="classes.event"
              @click="hrefOf(item) ? undefined : chooseEvent(item)"
            >
              <span
                v-if="(model.view === 'month' ? item.time : item.range) !== ''"
                data-scope="calendar"
                data-part="event-time"
                :class="classes.eventTime"
                >{{ model.view === 'month' ? item.time : item.range }}</span
              ><span data-scope="calendar" data-part="event-title" :class="classes.eventTitle">{{
                item.title
              }}</span
              ><span class="apui-sr-only">, {{ item.context }}</span>
            </component>
            <button
              v-if="day.more > 0"
              type="button"
              data-scope="calendar"
              data-part="more"
              :aria-label="day.moreLabel"
              :class="classes.more"
              @click="openDay(day.date)"
            >
              {{ day.moreText }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <ul
      v-if="model.legend.length > 0"
      data-scope="calendar"
      data-part="legend"
      :aria-label="text.legend"
      :class="classes.legend"
    >
      <li
        v-for="entry in model.legend"
        :key="entry.category"
        data-scope="calendar"
        data-part="legend-item"
        :data-color="entry.color"
        :class="classes.legendItem"
      >
        {{ entry.category }}
      </li>
    </ul>
    <Dialog
      v-if="details"
      :open="selected !== null"
      :title="selected?.title"
      :description="selected?.when"
      @update:open="onDialogOpen"
    >
      <template v-if="selected !== null">
        <slot name="details" :event="selected.event">
          <Stack gap="3">
            <div v-if="selected.category">
              <Badge variant="soft" :color="selected.color">{{ selected.category }}</Badge>
            </div>
            <Text v-if="selected.description">{{ selected.description }}</Text>
          </Stack>
        </slot>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DatePicker from './DatePicker.vue';

const value = ref('');
const currentYear = new Date().getFullYear();
const yearStart = computed(() => `${currentYear}-01-01`);
const yearEnd = computed(() => `${currentYear}-12-31`);
</script>

<template>
  <Story title="Form/DatePicker" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.dateType"
          title="Type"
          :options="['date', 'datetime-local', 'time', 'month', 'week']"
        />
        <HstCheckbox v-model="state.inline" title="Inline" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <DatePicker
            v-model="value"
            :label="state.label || 'Date'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :date-type="state.dateType || 'date'"
            :inline="state.inline"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Date Types">
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
        <DatePicker v-model="value" label="Date" date-type="date" />
        <DatePicker v-model="value" label="Date & Time" date-type="datetime-local" />
        <DatePicker v-model="value" label="Time" date-type="time" />
        <DatePicker v-model="value" label="Month" date-type="month" />
      </div>
    </Variant>

    <Variant title="With Min/Max">
      <div style="max-width: 400px">
        <DatePicker v-model="value" label="Booking Date" :min="yearStart" :max="yearEnd" :hint="`Select a date in ${currentYear}`" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# DatePicker

A date/time picker supporting date, datetime-local, time, month, and week types.
</docs>

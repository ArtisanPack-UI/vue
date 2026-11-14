<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from './DatePicker.vue';
import type { DatePickerValue } from './types';

const moveIn = ref<DatePickerValue>('2026-11-12');
const stay = ref<DatePickerValue>(['2026-11-12', '2026-11-18']);
const viewingAt = ref<DatePickerValue>('2026-11-12T11:00');
</script>

<template>
  <Story title="Form/DatePicker" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstText v-model="state.locale" title="Locale" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 320px; min-height: 420px">
          <DatePicker
            v-model="moveIn"
            :label="state.label || 'Move-in date'"
            :hint="state.hint || 'MM/DD/YYYY'"
            :error="state.error || undefined"
            :locale="state.locale || 'en-US'"
            :size="state.size || undefined"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Open in place">
      <div style="max-width: 320px; min-height: 420px">
        <DatePicker
          v-model="moveIn"
          label="Move-in date"
          :open="true"
          :portal="false"
          footer="Thu, Nov 12"
        />
      </div>
    </Variant>

    <Variant title="Range">
      <div style="max-width: 360px; min-height: 420px">
        <DatePicker v-model="stay" mode="range" label="Stay" :disabled-dates="['2026-11-20']" />
      </div>
    </Variant>

    <Variant title="Date and time">
      <div style="max-width: 320px; min-height: 420px">
        <DatePicker v-model="viewingAt" time time-zone="Europe/Madrid" label="Viewing" />
      </div>
    </Variant>

    <Variant title="Right to left">
      <div dir="rtl" style="max-width: 320px; min-height: 420px">
        <DatePicker v-model="moveIn" label="Move-in date" :open="true" :portal="false" />
      </div>
    </Variant>
  </Story>
</template>

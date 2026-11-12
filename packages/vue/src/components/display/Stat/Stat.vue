<script setup lang="ts">
/**
 * @module Stat
 *
 * A headline number with its label, change and context. Renders the
 * design-system Stat markup contract (`.apui-stat`, #61). The change is an
 * arrow and text, never color alone.
 */
import { computed, useSlots } from 'vue';
import { DsIcon, flag, hasContent, part } from '../../_shared/design-system';
import { statDelta, statTrend, TREND_ICONS, type StatProps } from './types';

const props = withDefaults(defineProps<StatProps>(), {
  label: undefined,
  value: undefined,
  modelValue: undefined,
  unit: undefined,
  icon: undefined,
  delta: undefined,
  change: undefined,
  trend: undefined,
  description: undefined,
  size: 'md',
  color: 'neutral',
  emphasis: false,
  bare: false,
  upLabel: 'Increase',
  downLabel: 'Decrease',
  flatLabel: 'No change',
  classes: undefined,
});

const slots = useSlots();

const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const shownValue = computed(() => props.value ?? props.modelValue);
const shownDelta = computed(() => statDelta(props.delta, props.change));
const shownTrend = computed(() => statTrend(props.trend, props.change));
const trendLabel = computed(() =>
  shownTrend.value === undefined
    ? null
    : { up: props.upLabel, down: props.downLabel, flat: props.flatLabel }[shownTrend.value],
);
const hasIcon = () => !!slots.icon || filled(props.icon);
const hasValueSlot = () => hasContent(slots.default?.());
</script>

<template>
  <div
    :class="['apui-stat', classes?.root]"
    :data-size="size"
    :data-color="color"
    :data-emphasis="flag(emphasis)"
    :data-bare="flag(bare)"
  >
    <div v-if="filled(label) || hasIcon()" v-bind="part('stat', 'top', classes?.top)">
      <span v-if="filled(label)" v-bind="part('stat', 'label', classes?.label)">{{ label }}</span>
      <span v-if="hasIcon()" v-bind="part('stat', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
        ><slot name="icon"><DsIcon :name="icon" /></slot
      ></span>
    </div>
    <span v-bind="part('stat', 'value', classes?.value)"
      ><slot v-if="hasValueSlot()" /><template v-else>{{ shownValue }}</template
      ><span v-if="filled(unit)" v-bind="part('stat', 'unit', classes?.unit)">{{
        unit
      }}</span></span
    >
    <span
      v-if="shownDelta !== null || filled(description)"
      v-bind="part('stat', 'foot', classes?.foot)"
    >
      <span
        v-if="shownDelta !== null"
        v-bind="part('stat', 'delta', classes?.delta, { 'data-trend': shownTrend })"
        ><span v-if="trendLabel !== null" class="apui-sr-only">{{ `${trendLabel} ` }}</span
        ><DsIcon v-if="shownTrend !== undefined" :name="TREND_ICONS[shownTrend]" />{{
          shownDelta
        }}</span
      >
      <span v-if="filled(description)" v-bind="part('stat', 'description', classes?.description)">{{
        description
      }}</span>
    </span>
  </div>
</template>

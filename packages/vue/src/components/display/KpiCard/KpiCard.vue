<script setup lang="ts">
/**
 * @module KpiCard
 *
 * A headline metric in a Card, built from Stat, with a Sparkline of its
 * trend and a Progress toward a target. Renders the design-system KpiCard
 * markup contract (`.apui-card.apui-kpi-card`, #61).
 */
import { SPARKLINE_LABEL, sparklineValues } from '@artisanpack-ui/behavior';
import { computed, useSlots } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import Progress from '../Progress/Progress.vue';
import Sparkline from '../Sparkline/Sparkline.vue';
import { statDelta, statTrend, TREND_ICONS } from '../Stat/types';
import { kpiTarget, type KpiCardProps } from './types';

const props = withDefaults(defineProps<KpiCardProps>(), {
  stat: () => ({}),
  sparkline: undefined,
  sparklineLabel: SPARKLINE_LABEL,
  target: undefined,
  targetLabel: '{percent}% of goal',
  period: undefined,
  classes: undefined,
});

const slots = useSlots();

const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const color = computed(() => props.stat.color ?? 'neutral');
const delta = computed(() => statDelta(props.stat.delta, props.stat.change));
const trend = computed(() => statTrend(props.stat.trend, props.stat.change));
const trendLabel = computed(() => {
  if (trend.value === undefined) return null;
  return {
    up: props.stat.upLabel ?? 'Increase',
    down: props.stat.downLabel ?? 'Decrease',
    flat: props.stat.flatLabel ?? 'No change',
  }[trend.value];
});
const points = computed(() => sparklineValues(props.sparkline));
const goal = computed(() => kpiTarget(props.target, props.targetLabel));
const hasPeriod = () => !!slots.period || filled(props.period);
</script>

<template>
  <div :class="['apui-card apui-kpi-card', classes?.root]" :data-color="color">
    <div
      v-if="filled(stat.label) || hasPeriod() || filled(stat.icon)"
      v-bind="part('kpi-card', 'top', classes?.top)"
    >
      <span v-if="filled(stat.label)" v-bind="part('kpi-card', 'label', classes?.label)">{{
        stat.label
      }}</span>
      <div v-if="hasPeriod()" v-bind="part('kpi-card', 'period', classes?.period)">
        <slot name="period">{{ period }}</slot>
      </div>
      <span
        v-if="filled(stat.icon)"
        v-bind="part('kpi-card', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
        ><DsIcon :name="stat.icon"
      /></span>
    </div>
    <div v-bind="part('kpi-card', 'row', classes?.row)">
      <div v-bind="part('kpi-card', 'summary', classes?.summary)">
        <span v-bind="part('kpi-card', 'value', classes?.value)"
          >{{ stat.value
          }}<span v-if="filled(stat.unit)" v-bind="part('kpi-card', 'unit', classes?.unit)">{{
            stat.unit
          }}</span></span
        >
        <span
          v-if="delta !== null || filled(stat.description)"
          v-bind="part('kpi-card', 'foot', classes?.foot)"
        >
          <span
            v-if="delta !== null"
            v-bind="part('kpi-card', 'delta', classes?.delta, { 'data-trend': trend })"
            ><span v-if="trendLabel !== null" class="apui-sr-only">{{ `${trendLabel} ` }}</span
            ><DsIcon v-if="trend !== undefined" :name="TREND_ICONS[trend]" />{{ delta }}</span
          >
          <span
            v-if="filled(stat.description)"
            v-bind="part('kpi-card', 'description', classes?.description)"
            >{{ stat.description }}</span
          >
        </span>
      </div>
      <Sparkline
        v-if="points.length > 0"
        :data="points"
        variant="area"
        :width="96"
        :height="36"
        :label="sparklineLabel"
        :class="classes?.sparkline"
        data-scope="kpi-card"
        data-part="sparkline"
      />
    </div>
    <div v-if="goal !== null" v-bind="part('kpi-card', 'target', classes?.target)">
      <Progress
        :value="goal.value"
        :max="goal.max"
        size="sm"
        :color="color === 'neutral' ? undefined : color"
        :aria-label="goal.label ?? goal.text"
      />
      <div v-bind="part('kpi-card', 'targetText', classes?.targetText)">
        <span v-if="filled(goal.label)">{{ goal.label }}</span
        ><span>{{ goal.text }}</span>
      </div>
    </div>
  </div>
</template>

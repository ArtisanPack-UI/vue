<script setup lang="ts">
/**
 * @module Sparkline
 *
 * A word-sized trend drawn as inline SVG. Renders the design-system
 * Sparkline markup contract (`svg.apui-sparkline`, #61) with the coordinates
 * from the behavior package's `sparklineGeometry`, the same ones Blade and
 * React draw: no chart library. The plot stays LTR (D-004).
 */
import {
  SPARKLINE_HEIGHT,
  SPARKLINE_LABEL,
  SPARKLINE_WIDTH,
  sparklineGeometry,
  sparklineLabel,
  type SparklineVariant,
} from '@artisanpack-ui/behavior';
import { computed } from 'vue';
import { part } from '../../_shared/design-system';
import type { SparklineProps } from './types';

const props = withDefaults(defineProps<SparklineProps>(), {
  variant: 'line',
  width: SPARKLINE_WIDTH,
  height: SPARKLINE_HEIGHT,
  label: SPARKLINE_LABEL,
  classes: undefined,
});

const VARIANTS: readonly SparklineVariant[] = ['line', 'area', 'bar'];

const shown = computed<SparklineVariant>(() =>
  VARIANTS.includes(props.variant) ? props.variant : 'line',
);
const geometry = computed(() =>
  sparklineGeometry(props.data, shown.value, props.width, props.height),
);
const ariaLabel = computed(() => sparklineLabel(props.label, props.data));
</script>

<template>
  <svg
    :class="['apui-sparkline', classes?.root]"
    :data-variant="shown"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    :aria-label="ariaLabel"
  >
    <line
      v-if="geometry.baseline !== null"
      v-bind="part('sparkline', 'baseline', classes?.baseline)"
      x1="0"
      :x2="width"
      :y1="geometry.baseline"
      :y2="geometry.baseline"
    />
    <path
      v-if="geometry.area !== ''"
      v-bind="part('sparkline', 'area', classes?.area)"
      :d="geometry.area"
    />
    <path
      v-if="geometry.line !== ''"
      v-bind="part('sparkline', 'line', classes?.line)"
      :d="geometry.line"
    />
    <circle
      v-if="geometry.dot !== null"
      v-bind="part('sparkline', 'dot', classes?.dot)"
      :cx="geometry.dot.cx"
      :cy="geometry.dot.cy"
      r="2.5"
    />
    <rect
      v-for="(bar, index) in geometry.bars"
      :key="index"
      v-bind="part('sparkline', 'bar', classes?.bar)"
      :x="bar.x"
      :y="bar.y"
      :width="bar.width"
      :height="bar.height"
      rx="1"
    />
  </svg>
</template>

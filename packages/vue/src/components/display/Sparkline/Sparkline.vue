<script setup lang="ts">
/** @module Sparkline */
import { computed, ref } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { SparklineProps } from './types';

const props = withDefaults(defineProps<SparklineProps>(), {
  type: 'line',
  height: 40,
  color: 'primary',
  strokeWidth: 2,
  curve: true,
  fillOpacity: 0.3,
  showTooltip: true,
});

const daisyColorToVar: Record<string, string> = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  neutral: 'var(--color-neutral)',
};

const resolvedColor = computed(() => daisyColorToVar[props.color] || props.color);

const svgWidth = computed(() => props.width || props.data.length * 8);
const svgHeight = computed(() => props.height);

const hoveredIndex = ref<number | null>(null);

const minVal = computed(() => (props.data.length === 0 ? 0 : Math.min(...props.data)));
const maxVal = computed(() => (props.data.length === 0 ? 0 : Math.max(...props.data)));
const range = computed(() => maxVal.value - minVal.value || 1);

const padding = 2;

function scaleX(index: number): number {
  const usable = svgWidth.value - padding * 2;
  return padding + (index / Math.max(props.data.length - 1, 1)) * usable;
}

function scaleY(value: number): number {
  const usable = svgHeight.value - padding * 2;
  return svgHeight.value - padding - ((value - minVal.value) / range.value) * usable;
}

interface Point {
  x: number;
  y: number;
}

const points = computed<Point[]>(() =>
  props.data.map((v, i) => ({ x: scaleX(i), y: scaleY(v) })),
);

function catmullRomPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y}`;

  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function linearPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

const linePath = computed(() => {
  if (props.type === 'bar') return '';
  const pts = points.value;
  return props.curve ? catmullRomPath(pts) : linearPath(pts);
});

const areaPath = computed(() => {
  if (props.type !== 'area') return '';
  const line = linePath.value;
  if (!line) return '';
  const pts = points.value;
  const bottom = svgHeight.value - padding;
  return `${line} L${pts[pts.length - 1].x},${bottom} L${pts[0].x},${bottom} Z`;
});

// Bar chart
const barWidth = computed(() => {
  const count = props.data.length;
  const usable = svgWidth.value - padding * 2;
  return Math.max(1, (usable / count) * 0.7);
});

const barGap = computed(() => {
  const count = props.data.length;
  const usable = svgWidth.value - padding * 2;
  return usable / count;
});

function onMouseMove(event: MouseEvent) {
  if (!props.showTooltip) return;
  const svg = event.currentTarget as SVGElement;
  const rect = svg.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const ratio = mouseX / rect.width;
  const index = Math.round(ratio * (props.data.length - 1));
  hoveredIndex.value = Math.max(0, Math.min(props.data.length - 1, index));
}

function onMouseLeave() {
  hoveredIndex.value = null;
}

const tooltipX = computed(() => {
  if (hoveredIndex.value === null) return 0;
  return points.value[hoveredIndex.value]?.x || 0;
});

const tooltipY = computed(() => {
  if (hoveredIndex.value === null) return 0;
  return points.value[hoveredIndex.value]?.y || 0;
});

const tooltipValue = computed(() => {
  if (hoveredIndex.value === null) return '';
  return String(props.data[hoveredIndex.value]);
});
</script>

<template>
  <div
    v-if="data.length > 0"
    :class="cn('inline-block relative', props.className)"
    role="img"
    :aria-label="($attrs['aria-label'] as string) || 'Sparkline chart'"
  >
    <svg
      :width="svgWidth"
      :height="svgHeight"
      preserveAspectRatio="none"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- Area fill -->
      <path
        v-if="type === 'area'"
        :d="areaPath"
        :fill="resolvedColor"
        :fill-opacity="fillOpacity"
        stroke="none"
      />

      <!-- Line path -->
      <path
        v-if="type === 'line' || type === 'area'"
        :d="linePath"
        :stroke="resolvedColor"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Bar chart -->
      <template v-if="type === 'bar'">
        <rect
          v-for="(value, index) in data"
          :key="index"
          :x="padding + index * barGap + (barGap - barWidth) / 2"
          :y="scaleY(value)"
          :width="barWidth"
          :height="svgHeight - padding - scaleY(value)"
          :fill="resolvedColor"
          :opacity="hoveredIndex === index ? 1 : 0.8"
          rx="1"
        />
      </template>

      <!-- Hover indicator -->
      <circle
        v-if="showTooltip && hoveredIndex !== null && type !== 'bar'"
        :cx="tooltipX"
        :cy="tooltipY"
        r="3"
        :fill="resolvedColor"
        stroke="white"
        :stroke-width="1.5"
      />
    </svg>

    <!-- Tooltip -->
    <div
      v-if="showTooltip && hoveredIndex !== null"
      class="absolute -top-6 px-1.5 py-0.5 bg-base-300 text-base-content text-xs rounded shadow pointer-events-none whitespace-nowrap"
      :style="{ left: `${tooltipX}px`, transform: 'translateX(-50%)' }"
    >
      {{ tooltipValue }}
    </div>
  </div>
</template>

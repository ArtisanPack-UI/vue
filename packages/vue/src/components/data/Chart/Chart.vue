<script setup lang="ts">
/**
 * @module Chart
 *
 * A bar, line, area or donut chart in a Card. Renders the design-system
 * Chart markup contract (`.apui-card.apui-chart`, #63) with the geometry from
 * the behavior package's `chartGeometry`, the same one Blade and React draw:
 * no chart library. `attachChartTooltip` opens the tooltip on hover and
 * keyboard focus of each mark. The plot stays LTR (D-004).
 */
import {
  attachChartTooltip,
  CHART_HEIGHT,
  CHART_TYPES,
  CHART_WIDTH,
  chartGeometry,
  type ChartType,
} from '@artisanpack-ui/behavior';
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { part } from '../../_shared/design-system';
import type { ChartProps } from './types';

const props = withDefaults(defineProps<ChartProps>(), {
  type: 'bar',
  labels: undefined,
  description: undefined,
  actions: undefined,
  tabular: false,
  prefix: undefined,
  suffix: undefined,
  notation: 'standard',
  width: CHART_WIDTH,
  height: CHART_HEIGHT,
  classes: undefined,
});

const slots = useSlots();
const root = ref<HTMLElement | null>(null);
let detach: (() => void) | null = null;

onMounted(() => {
  if (root.value) detach = attachChartTooltip(root.value);
});
onBeforeUnmount(() => detach?.());

const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const shown = computed<ChartType>(() => (CHART_TYPES.includes(props.type) ? props.type : 'bar'));
const donut = computed(() => shown.value === 'donut');
const geometry = computed(() =>
  chartGeometry(props.series, {
    type: shown.value,
    labels: props.labels,
    width: props.width,
    height: props.height,
    title: props.title,
    prefix: props.prefix,
    suffix: props.suffix,
    notation: props.notation === 'compact' ? 'compact' : 'standard',
  }),
);
const named = computed(() => (filled(props.title) ? props.title : undefined));
const hasActions = () => !!slots.actions || filled(props.actions);
const markAttributes = (mark: (typeof geometry.value.marks)[number]) =>
  part('chart', 'mark', props.classes?.mark, {
    'data-series': mark.series,
    'data-index': mark.index,
    tabindex: 0,
    role: 'img',
    'aria-label': mark.label,
    'data-tooltip-title': mark.title,
    'data-tooltip-body': mark.body,
    'data-anchor-x': mark.anchorX,
    'data-anchor-y': mark.anchorY,
  });
</script>

<template>
  <div ref="root" :class="['apui-card apui-chart', classes?.root]" :data-type="shown">
    <div v-bind="part('chart', 'header', classes?.header)">
      <div>
        <h3 v-if="filled(title)" v-bind="part('chart', 'title', classes?.title)">{{ title }}</h3>
        <p v-if="filled(description)" v-bind="part('chart', 'description', classes?.description)">
          {{ description }}
        </p>
      </div>
      <ul
        v-if="!donut && geometry.legend.length > 0"
        v-bind="part('chart', 'legend', classes?.legend)"
      >
        <li v-for="(item, index) in geometry.legend" :key="index">
          <span
            v-bind="
              part('chart', 'swatch', classes?.swatch, {
                'data-series': item.series,
                'aria-hidden': 'true',
              })
            "
          ></span
          >{{ item.name }}
        </li>
      </ul>
      <div v-if="hasActions()" v-bind="part('chart', 'actions', classes?.actions)">
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>
    <div v-bind="part('chart', 'body', classes?.body)">
      <svg
        v-bind="part('chart', 'plot', classes?.plot)"
        :viewBox="`0 0 ${geometry.width} ${geometry.height}`"
        :width="geometry.width"
        :height="geometry.height"
        role="group"
        :aria-label="named"
      >
        <template v-if="!donut">
          <g aria-hidden="true">
            <template v-for="(tick, index) in geometry.ticks" :key="`tick-${index}`">
              <line
                v-bind="part('chart', 'grid', classes?.grid)"
                :x1="geometry.left"
                :x2="geometry.right"
                :y1="tick.y"
                :y2="tick.y"
              />
              <text
                v-bind="part('chart', 'axis', classes?.axis)"
                :x="geometry.tickX"
                :y="tick.textY"
                text-anchor="end"
              >
                {{ tick.label }}
              </text>
            </template>
            <text
              v-for="(category, index) in geometry.categories"
              :key="`category-${index}`"
              v-bind="part('chart', 'axis', classes?.axis)"
              :x="category.x"
              :y="geometry.labelY"
              text-anchor="middle"
            >
              {{ category.label }}
            </text>
          </g>
          <template v-if="geometry.lines.length > 0">
            <g aria-hidden="true">
              <path
                v-for="(area, index) in geometry.areas"
                :key="`area-${index}`"
                v-bind="part('chart', 'area', classes?.area, { 'data-series': area.series })"
                :d="area.d"
              />
              <path
                v-for="(line, index) in geometry.lines"
                :key="`line-${index}`"
                v-bind="part('chart', 'line', classes?.line, { 'data-series': line.series })"
                :d="line.d"
              />
            </g>
            <g aria-hidden="true">
              <g
                v-for="point in geometry.points"
                :key="point.index"
                v-bind="part('chart', 'point', classes?.point, { 'data-index': point.index })"
                visibility="hidden"
              >
                <line
                  v-bind="part('chart', 'crosshair', classes?.crosshair)"
                  :x1="point.x"
                  :x2="point.x"
                  :y1="point.top"
                  :y2="point.bottom"
                />
                <circle
                  v-for="(dot, dotIndex) in point.dots"
                  :key="dotIndex"
                  v-bind="part('chart', 'dot', classes?.dot, { 'data-series': dot.series })"
                  :cx="dot.cx"
                  :cy="dot.cy"
                  r="5"
                />
              </g>
            </g>
          </template>
          <text
            v-if="geometry.value !== null"
            v-bind="part('chart', 'value', classes?.value)"
            :x="geometry.value.x"
            :y="geometry.value.y"
            text-anchor="middle"
            aria-hidden="true"
          >
            {{ geometry.value.text }}
          </text>
        </template>
        <template v-for="mark in geometry.marks" :key="mark.index">
          <rect
            v-if="mark.shape === 'rect'"
            v-bind="markAttributes(mark)"
            :x="mark.x"
            :y="mark.y"
            :width="mark.width"
            :height="mark.height"
          />
          <path v-else v-bind="markAttributes(mark)" :d="mark.d" />
        </template>
      </svg>
      <ul v-if="donut" v-bind="part('chart', 'legend', classes?.legend)">
        <li v-for="(item, index) in geometry.legend" :key="index">
          <span
            v-bind="
              part('chart', 'swatch', classes?.swatch, {
                'data-series': item.series,
                'aria-hidden': 'true',
              })
            "
          ></span
          >{{ item.name
          }}<span v-bind="part('chart', 'value', classes?.value)">{{ item.value }}</span>
        </li>
      </ul>
      <div
        v-bind="part('chart', 'tooltip', classes?.tooltip, { 'aria-hidden': 'true' })"
        hidden
      ></div>
    </div>
    <table v-if="tabular" v-bind="part('chart', 'table', classes?.table)" :aria-label="named">
      <thead>
        <tr>
          <template v-for="(column, index) in geometry.table.columns" :key="index">
            <td v-if="index === 0"></td>
            <th v-else scope="col">{{ column }}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in geometry.table.rows" :key="index">
          <th scope="row">{{ row.label }}</th>
          <td v-for="(cell, cellIndex) in row.cells" :key="cellIndex">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

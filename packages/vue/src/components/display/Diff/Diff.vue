<script setup lang="ts">
/**
 * @module Diff
 *
 * The changes between two versions of a text. Renders the design-system
 * Diff markup contract (`.apui-diff`, #61) with the rows from the behavior
 * package's `diffText`, the same ones Blade and React render: no diff
 * library. The header mirrors in RTL; the table stays LTR (D-004).
 */
import {
  DIFF_COUNTS_LABEL,
  DIFF_EMPTY_LABEL,
  diffCountsLabel,
  diffText,
  splitRows,
} from '@artisanpack-ui/behavior';
import { computed, useSlots } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import DiffCells from './DiffCells';
import type { DiffProps } from './types';

const props = withDefaults(defineProps<DiffProps>(), {
  oldContent: undefined,
  newContent: undefined,
  fileName: undefined,
  view: 'unified',
  wordLevel: true,
  context: 3,
  countsLabel: DIFF_COUNTS_LABEL,
  emptyLabel: DIFF_EMPTY_LABEL,
  actions: undefined,
  classes: undefined,
});

const slots = useSlots();

const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const result = computed(() =>
  diffText(props.oldContent, props.newContent, {
    context: props.context,
    wordLevel: props.wordLevel,
  }),
);
const shown = computed(() => (props.view === 'split' ? 'split' : 'unified'));
const columns = computed(() => (shown.value === 'split' ? 6 : 4));
const countsText = computed(() =>
  diffCountsLabel(props.countsLabel, result.value.additions, result.value.deletions),
);
const hasActions = () => !!slots.actions || filled(props.actions);
</script>

<template>
  <div :class="['apui-diff', classes?.root]" :data-view="shown">
    <div v-bind="part('diff', 'header', classes?.header)">
      <span v-bind="part('diff', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
        ><DsIcon name="git-compare"
      /></span>
      <span v-if="filled(fileName)" v-bind="part('diff', 'file', classes?.file)">{{
        fileName
      }}</span>
      <span v-bind="part('diff', 'counts', classes?.counts)"
        ><span class="apui-sr-only">{{ countsText }}</span
        ><span data-type="add" aria-hidden="true">{{ `+${result.additions}` }}</span
        ><span data-type="del" aria-hidden="true">{{ `−${result.deletions}` }}</span></span
      >
      <div v-if="hasActions()" v-bind="part('diff', 'actions', classes?.actions)">
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>
    <table v-bind="part('diff', 'table', classes?.table)">
      <tbody>
        <tr v-if="result.hunks.length === 0" v-bind="part('diff', 'hunk', classes?.hunk)">
          <td :colspan="columns">{{ emptyLabel }}</td>
        </tr>
        <template v-for="(hunk, hunkIndex) in result.hunks" :key="hunkIndex">
          <tr v-bind="part('diff', 'hunk', classes?.hunk)">
            <td :colspan="columns">{{ hunk.header }}</td>
          </tr>
          <template v-if="shown === 'split'">
            <tr
              v-for="(row, index) in splitRows(hunk.lines)"
              :key="`${hunkIndex}-${index}`"
              v-bind="part('diff', 'line', classes?.line)"
            >
              <DiffCells
                :number="row.old.number"
                :type="row.old.type"
                :segments="row.old.segments"
                :classes="classes"
              />
              <DiffCells
                :number="row.new.number"
                :type="row.new.type"
                :segments="row.new.segments"
                :classes="classes"
              />
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(line, index) in hunk.lines"
              :key="`${hunkIndex}-${index}`"
              v-bind="part('diff', 'line', classes?.line, { 'data-type': line.type })"
            >
              <td
                v-bind="part('diff', 'lineNumber', classes?.lineNumber, { 'data-type': line.type })"
              >
                {{ line.oldNumber ?? '' }}
              </td>
              <DiffCells
                :number="line.newNumber"
                :type="line.type"
                :segments="line.segments"
                :classes="classes"
              />
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

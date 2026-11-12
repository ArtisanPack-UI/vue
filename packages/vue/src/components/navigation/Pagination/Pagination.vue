<script setup lang="ts">
/**
 * @module Pagination
 *
 * Moves between the pages of a long list. Renders the design-system
 * Pagination markup contract (`.apui-pagination`, #56): a nav landmark with
 * an optional summary, previous, the pages and next.
 */
import { computed } from 'vue';
import { DsIcon, part } from '../../_shared/design-system';
import { paginationRange } from './range';
import type { PaginationProps } from './types';

const props = withDefaults(defineProps<PaginationProps>(), {
  page: 1,
  pageCount: undefined,
  total: undefined,
  perPage: 10,
  siblings: 1,
  summary: false,
  label: 'Pagination',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
  pageLabel: 'Page {page}',
  summaryLabel: undefined,
  classes: undefined,
});

const emit = defineEmits<{
  'page-change': [page: number];
  'update:page': [page: number];
}>();

const per = computed(() => Math.max(1, props.perPage));
const count = computed(() =>
  Math.max(
    1,
    props.pageCount ?? (props.total !== undefined ? Math.ceil(props.total / per.value) : 1),
  ),
);
const current = computed(() => Math.max(1, Math.min(props.page, count.value)));
const items = computed(() =>
  paginationRange(current.value, count.value, Math.max(0, props.siblings)),
);

const summaryText = computed(() => {
  if (!props.summary) return null;
  const total = props.total;
  const from = total === 0 ? 0 : (current.value - 1) * per.value + 1;
  const to =
    total === undefined ? current.value * per.value : Math.min(total, current.value * per.value);
  const template =
    props.summaryLabel ??
    (total === undefined ? 'Page {page} of {pageCount}' : 'Showing {from}–{to} of {total}');
  return template
    .replaceAll('{from}', String(total === undefined ? from : Math.min(total, from)))
    .replaceAll('{to}', String(to))
    .replaceAll('{total}', total === undefined ? '' : String(total))
    .replaceAll('{pageCount}', String(count.value))
    .replaceAll('{page}', String(current.value));
});

function go(page: number) {
  emit('page-change', page);
  emit('update:page', page);
}

const atStart = computed(() => current.value <= 1);
const atEnd = computed(() => current.value >= count.value);
</script>

<template>
  <nav :class="['apui-pagination', classes?.root]" :aria-label="label">
    <span v-if="summaryText !== null" v-bind="part('pagination', 'summary', classes?.summary)">{{
      summaryText
    }}</span>
    <button
      type="button"
      v-bind="part('pagination', 'previous', classes?.previous)"
      :aria-label="previousLabel"
      :aria-disabled="atStart ? 'true' : undefined"
      data-mirror=""
      @click="atStart || go(current - 1)"
    >
      <DsIcon name="chevron-left" />
    </button>
    <template v-for="(item, index) in items" :key="item ?? `ellipsis-${index}`">
      <span
        v-if="item === null"
        v-bind="part('pagination', 'ellipsis', classes?.ellipsis, { 'aria-hidden': 'true' })"
        >…</span
      >
      <button
        v-else
        type="button"
        v-bind="part('pagination', 'page', classes?.page)"
        :aria-label="pageLabel.replaceAll('{page}', String(item))"
        :aria-current="item === current ? 'page' : undefined"
        @click="item === current || go(item)"
      >
        {{ item }}
      </button>
    </template>
    <button
      type="button"
      v-bind="part('pagination', 'next', classes?.next)"
      :aria-label="nextLabel"
      :aria-disabled="atEnd ? 'true' : undefined"
      data-mirror=""
      @click="atEnd || go(current + 1)"
    >
      <DsIcon name="chevron-right" />
    </button>
  </nav>
</template>

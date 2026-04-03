<script setup lang="ts">
/** @module Table */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { TableProps, SortState, TableColumn } from './types';

const props = withDefaults(defineProps<TableProps>(), {
  striped: false,
  compact: false,
  hoverable: false,
  pinRows: false,
  pinCols: false,
  loading: false,
  emptyMessage: 'No data available',
});

const emit = defineEmits<{
  sort: [state: SortState];
}>();

const tableClasses = computed(() =>
  cn(
    'table',
    props.striped && 'table-zebra',
    props.compact && 'table-xs',
    props.hoverable && '[&_tr:hover]:bg-base-200',
    props.pinRows && 'table-pin-rows',
    props.pinCols && 'table-pin-cols',
    props.className,
  ),
);

const alignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function handleSort(column: TableColumn) {
  if (!column.sortable) return;
  const direction =
    props.sort?.key === column.key && props.sort.direction === 'asc' ? 'desc' : 'asc';
  emit('sort', { key: column.key, direction });
}

function getSortIndicator(column: TableColumn): string {
  if (!column.sortable) return '';
  if (props.sort?.key !== column.key) return ' ↕';
  return props.sort.direction === 'asc' ? ' ↑' : ' ↓';
}

function getCellValue(row: Record<string, unknown>, key: string): unknown {
  return row[key];
}
</script>

<template>
  <div class="overflow-x-auto">
    <table :class="tableClasses" role="table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="cn(alignMap[column.align || 'left'], column.className)"
            :style="column.width ? { width: column.width } : undefined"
            :aria-sort="
              sort?.key === column.key
                ? sort.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
            "
          >
            <button
              v-if="column.sortable"
              type="button"
              :class="
                cn(
                  'w-full cursor-pointer select-none hover:bg-base-200 px-0 py-0 bg-transparent border-none font-inherit',
                  alignMap[column.align || 'left'],
                )
              "
              @click="handleSort(column)"
            >
              {{ column.label }}{{ getSortIndicator(column) }}
            </button>
            <template v-else>
              {{ column.label }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="text-center py-8">
            <span
              class="loading loading-spinner loading-md"
              role="status"
              aria-label="Loading table data"
            />
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="text-center py-8 text-base-content/50">
            <slot name="empty">
              {{ emptyMessage }}
            </slot>
          </td>
        </tr>
        <template v-else>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="cn(alignMap[column.align || 'left'], column.className)"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column.key)"
                :index="rowIndex"
                :column="column"
              >
                {{ getCellValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

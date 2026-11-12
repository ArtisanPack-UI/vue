<script setup lang="ts">
/**
 * @module Table
 *
 * Rows of structured data in real table markup. Renders the design-system
 * Table markup contract (`.apui-table`, #62): a toolbar (title and toolbar
 * content), the scroll part with the native table, and a footer (footer
 * content and Pagination). Sortable headers carry `aria-sort` and a sort
 * button; selectable rows a Checkbox and `aria-selected`, with a select-all
 * box that is mixed while some rows are selected; expandable rows an expand
 * button and a full-width expansion row. Loading shows skeleton rows; no rows
 * shows an EmptyState.
 */
import { computed, getCurrentInstance, ref, useId, useSlots, watch } from 'vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import Checkbox from '../../form/Checkbox/Checkbox.vue';
import Pagination from '../../navigation/Pagination/Pagination.vue';
import type { TableColumn, TableKey, TableProps, TableSort } from './types';

type Row = Record<string, unknown>;

const props = withDefaults(defineProps<TableProps>(), {
  keyBy: 'id',
  title: undefined,
  label: undefined,
  density: undefined,
  surface: 'default',
  stickyHeader: true,
  hideHeaders: false,
  selectable: false,
  modelValue: undefined,
  expandable: false,
  expanded: undefined,
  sortBy: undefined,
  loading: false,
  emptyText: 'No records found.',
  toolbar: undefined,
  footer: undefined,
  pagination: undefined,
  selectAllLabel: 'Select all',
  selectRowLabel: 'Select {row}',
  sortLabel: 'Sort by {column}',
  expandLabel: 'Show details for {row}',
  actionsLabel: 'Actions',
  classes: undefined,
  headers: undefined,
  columns: undefined,
  className: undefined,
  compact: false,
  emptyMessage: undefined,
  sort: undefined,
  striped: false,
  hoverable: false,
  pinRows: false,
  pinCols: false,
});

const emit = defineEmits<{
  'update:modelValue': [keys: TableKey[]];
  'sort-change': [sort: TableSort];
  'update:sortBy': [sort: TableSort];
  'expanded-change': [keys: TableKey[]];
  'update:expanded': [keys: TableKey[]];
  'row-click': [row: Row, index: number];
  /** @deprecated 1.x: use `sort-change`. */
  sort: [state: { key: string; direction: 'asc' | 'desc' }];
}>();

defineSlots<{
  /** Rich title content. */
  title?: () => unknown;
  /** Toolbar content after the title. */
  toolbar?: () => unknown;
  /** Footer content at the start. */
  footer?: () => unknown;
  /** Replaces the empty state. */
  empty?: () => unknown;
  /** Every cell's content; `cell-<key>` wins for its column. */
  cell?: (props: { row: Row; value: unknown; column: TableColumn; index: number }) => unknown;
  /** Row actions in a last, end-aligned column. */
  actions?: (props: { row: Row; index: number }) => unknown;
  /** An expanded row's content. */
  expansion?: (props: { row: Row; index: number }) => unknown;
  /** `cell-<key>` and `header-<key>` for each column. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic slot names
  [name: string]: ((props: any) => unknown) | undefined;
}>();

const slots = useSlots();
const instance = getCurrentInstance();
const baseId = useId();

const ownSelection = ref<TableKey[]>(props.modelValue ?? []);
watch(
  () => props.modelValue,
  (keys) => {
    if (keys !== undefined) ownSelection.value = keys;
  },
);
const ownExpanded = ref<TableKey[]>(props.expanded ?? []);
watch(
  () => props.expanded,
  (keys) => {
    if (keys !== undefined) ownExpanded.value = keys;
  },
);

const sameKey = (a: unknown, b: unknown) => String(a) === String(b);
const hasKey = (list: readonly unknown[], key: unknown) => list.some((item) => sameKey(item, key));
const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template,
  );
const text = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';

/** Reads a dot path from a row. */
function valueAt(row: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value !== null && typeof value === 'object' && key in (value as Row)) {
      return (value as Row)[key];
    }
    return undefined;
  }, row);
}

/** The columns: `headers`, else the 1.x `columns`, with 1.x `className` and `align: 'right'` mapped. */
const visibleColumns = computed(() =>
  (props.headers ?? props.columns ?? [])
    .filter((column) => !column.hidden)
    .map((column) => ({
      ...column,
      class: [column.class, column.className].filter(Boolean).join(' ') || undefined,
      numeric: column.numeric ?? column.align === 'right',
    })),
);
const resolvedDensity = computed(() => props.density ?? (props.compact ? 'compact' : undefined));
const resolvedEmptyText = computed(() => props.emptyMessage ?? props.emptyText);
const currentSort = computed<TableSort | undefined>(
  () =>
    props.sortBy ??
    (props.sort ? { column: props.sort.key, direction: props.sort.direction } : undefined),
);
const rowKey = (row: Row) => valueAt(row, props.keyBy) as TableKey;
const pageKeys = computed(() => (props.selectable ? props.rows.map(rowKey) : []));
const allState = computed(() => {
  const count = pageKeys.value.filter((key) => hasKey(ownSelection.value, key)).length;
  if (count === 0) return 'unchecked';
  return count === pageKeys.value.length ? 'checked' : 'indeterminate';
});
/*
 * Slots and the vnode's listeners aren't reactive, so these are plain
 * functions read on every render rather than `computed` values that would
 * cache their first result.
 */
function hasActions(): boolean {
  return slots.actions !== undefined;
}
function colspan(): number {
  return (
    visibleColumns.value.length +
    (props.selectable ? 1 : 0) +
    (props.expandable ? 1 : 0) +
    (hasActions() ? 1 : 0)
  );
}
function hasTitle(): boolean {
  return slots.title ? hasContent(slots.title()) : Boolean(props.title);
}
function hasToolbar(): boolean {
  return slots.toolbar ? hasContent(slots.toolbar()) : Boolean(props.toolbar);
}
function hasFooter(): boolean {
  return slots.footer ? hasContent(slots.footer()) : Boolean(props.footer);
}
const titleId = `${baseId}-title`;
/** Whether a row-click listener is bound; rows are only clickable then. */
function clickable(): boolean {
  return Boolean(instance?.vnode.props?.onRowClick);
}

function select(next: TableKey[]) {
  ownSelection.value = next;
  emit('update:modelValue', next);
}

function toggleRow(key: TableKey, on: boolean) {
  const rest = ownSelection.value.filter((item) => !sameKey(item, key));
  select(on ? [...rest, key] : rest);
}

function toggleAll(on: boolean) {
  const rest = ownSelection.value.filter((item) => !hasKey(pageKeys.value, item));
  select(on ? [...rest, ...pageKeys.value] : rest);
}

function toggleExpanded(key: TableKey) {
  const next = hasKey(ownExpanded.value, key)
    ? ownExpanded.value.filter((item) => !sameKey(item, key))
    : [...ownExpanded.value, key];
  ownExpanded.value = next;
  emit('expanded-change', next);
  emit('update:expanded', next);
}

function ariaSort(column: TableColumn): 'ascending' | 'descending' | 'none' {
  const sort = currentSort.value;
  if (!sort || sort.column !== column.key) return 'none';
  return sort.direction === 'desc' ? 'descending' : 'ascending';
}

const SORT_ICONS = { ascending: 'arrow-up', descending: 'arrow-down', none: 'chevrons-up-down' };

function sort(column: TableColumn) {
  const next: TableSort = {
    column: column.key,
    direction: ariaSort(column) === 'ascending' ? 'desc' : 'asc',
  };
  emit('sort-change', next);
  emit('update:sortBy', next);
  emit('sort', { key: next.column, direction: next.direction });
}

function rowName(row: Row): string {
  const first = visibleColumns.value[0];
  const shown = first ? text(valueAt(row, first.key)).trim() : '';
  return shown || text(rowKey(row));
}

function onRowClick(event: MouseEvent, row: Row, index: number) {
  if ((event.target as Element).closest('a, button, input, label, select, textarea')) return;
  emit('row-click', row, index);
}

function paginationBindings() {
  return props.pagination ?? {};
}
</script>

<template>
  <div
    :class="['apui-table', classes?.root, className]"
    :data-surface="surface"
    :data-density="resolvedDensity"
    :data-sticky-header="stickyHeader ? '' : undefined"
    :aria-busy="loading ? 'true' : undefined"
  >
    <div v-if="hasTitle() || hasToolbar()" v-bind="part('table', 'toolbar', classes?.toolbar)">
      <h3 v-if="hasTitle()" v-bind="part('table', 'title', classes?.title)" :id="titleId">
        <slot name="title">{{ title }}</slot>
      </h3>
      <slot name="toolbar">{{ toolbar }}</slot>
    </div>
    <div v-bind="part('table', 'scroll', classes?.scroll)">
      <table
        v-bind="part('table', 'table', classes?.table)"
        :aria-label="label || undefined"
        :aria-labelledby="!label && hasTitle() ? titleId : undefined"
      >
        <thead :class="hideHeaders ? 'apui-sr-only' : undefined">
          <tr>
            <th v-if="selectable" v-bind="part('table', 'select', classes?.select)" scope="col">
              <Checkbox
                :aria-label="selectAllLabel"
                :checked="allState === 'checked'"
                :indeterminate="allState === 'indeterminate'"
                :disabled="pageKeys.length === 0"
                @update:checked="toggleAll"
              />
            </th>
            <td v-if="expandable" data-shrink="" />
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              v-bind="
                part(
                  'table',
                  'head-cell',
                  [classes?.headCell, column.class].filter(Boolean).join(' '),
                  {
                    'aria-sort': column.sortable ? ariaSort(column) : undefined,
                    'data-numeric': column.numeric ? '' : undefined,
                  },
                )
              "
              scope="col"
            >
              <button
                v-if="column.sortable"
                type="button"
                v-bind="part('table', 'sort', classes?.sort)"
                :aria-label="fill(sortLabel, { column: column.label ?? column.key })"
                @click="sort(column)"
              >
                <slot :name="`header-${column.key}`" :column="column">{{
                  column.label ?? column.key
                }}</slot
                ><DsIcon :name="SORT_ICONS[ariaSort(column)]" />
              </button>
              <slot v-else :name="`header-${column.key}`" :column="column">{{
                column.label ?? column.key
              }}</slot>
            </th>
            <th
              v-if="hasActions()"
              v-bind="part('table', 'head-cell', classes?.headCell, { 'data-shrink': '' })"
              scope="col"
            >
              <span class="apui-sr-only">{{ actionsLabel }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr
              v-for="index in 3"
              :key="`skeleton-${index}`"
              v-bind="part('table', 'row', classes?.row, { 'aria-hidden': 'true' })"
            >
              <td v-if="selectable" v-bind="part('table', 'select', classes?.select)" />
              <td
                v-if="expandable"
                v-bind="part('table', 'cell', classes?.cell, { 'data-shrink': '' })"
              />
              <td
                v-for="column in visibleColumns"
                :key="column.key"
                v-bind="part('table', 'cell', classes?.cell)"
              >
                <span class="apui-skeleton" data-shape="text" aria-hidden="true" />
              </td>
              <td
                v-if="hasActions()"
                v-bind="part('table', 'cell', classes?.cell, { 'data-shrink': '' })"
              />
            </tr>
          </template>
          <tr v-else-if="rows.length === 0">
            <td data-empty="" :colspan="Math.max(1, colspan())">
              <slot name="empty">
                <div class="apui-empty-state" data-variant="no-results" data-size="sm">
                  <p data-scope="empty-state" data-part="title">{{ resolvedEmptyText }}</p>
                </div>
              </slot>
            </td>
          </tr>
          <template v-else>
            <template v-for="(row, index) in rows" :key="text(rowKey(row)) || index">
              <tr
                v-bind="
                  part('table', 'row', classes?.row, {
                    'aria-selected': selectable
                      ? hasKey(ownSelection, rowKey(row))
                        ? 'true'
                        : 'false'
                      : undefined,
                    'data-clickable': clickable() ? '' : undefined,
                  })
                "
                @click="clickable() && onRowClick($event, row, index)"
              >
                <td v-if="selectable" v-bind="part('table', 'select', classes?.select)">
                  <Checkbox
                    :aria-label="fill(selectRowLabel, { row: rowName(row) })"
                    :value="text(rowKey(row))"
                    :checked="hasKey(ownSelection, rowKey(row))"
                    @update:checked="(on: boolean) => toggleRow(rowKey(row), on)"
                  />
                </td>
                <td
                  v-if="expandable"
                  v-bind="part('table', 'cell', classes?.cell, { 'data-shrink': '' })"
                >
                  <button
                    type="button"
                    v-bind="part('table', 'expand-trigger', classes?.expandTrigger)"
                    :aria-label="fill(expandLabel, { row: rowName(row) })"
                    :aria-expanded="hasKey(ownExpanded, rowKey(row)) ? 'true' : 'false'"
                    :aria-controls="
                      hasKey(ownExpanded, rowKey(row)) ? `${baseId}-expansion-${index}` : undefined
                    "
                    data-mirror=""
                    @click="toggleExpanded(rowKey(row))"
                  >
                    <DsIcon name="chevron-right" />
                  </button>
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="column.key"
                  v-bind="
                    part('table', 'cell', classes?.cell, {
                      'data-numeric': column.numeric ? '' : undefined,
                    })
                  "
                >
                  <slot
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="valueAt(row, column.key)"
                    :column="column"
                    :index="index"
                  >
                    <slot
                      name="cell"
                      :row="row"
                      :value="valueAt(row, column.key)"
                      :column="column"
                      :index="index"
                    >
                      <template
                        v-if="column.secondary && text(valueAt(row, column.secondary)) !== ''"
                        ><span v-bind="part('table', 'primary', classes?.primary)">{{
                          text(valueAt(row, column.key))
                        }}</span
                        ><span v-bind="part('table', 'secondary', classes?.secondary)">{{
                          text(valueAt(row, column.secondary))
                        }}</span></template
                      >
                      <template v-else>{{ text(valueAt(row, column.key)) }}</template>
                    </slot>
                  </slot>
                </td>
                <td
                  v-if="hasActions()"
                  v-bind="
                    part('table', 'cell', classes?.cell, { 'data-shrink': '', 'data-actions': '' })
                  "
                >
                  <slot name="actions" :row="row" :index="index" />
                </td>
              </tr>
              <tr
                v-if="expandable && hasKey(ownExpanded, rowKey(row))"
                v-bind="part('table', 'expansion', classes?.expansion)"
                :id="`${baseId}-expansion-${index}`"
              >
                <td :colspan="colspan()">
                  <slot name="expansion" :row="row" :index="index" />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="hasFooter() || pagination" v-bind="part('table', 'footer', classes?.footer)">
      <span v-if="hasFooter()"
        ><slot name="footer">{{ footer }}</slot></span
      >
      <Pagination v-if="pagination" v-bind="paginationBindings()" />
    </div>
  </div>
</template>

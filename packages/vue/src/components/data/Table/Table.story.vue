<script setup lang="ts">
import { ref } from 'vue';
import Table from './Table.vue';
import type { SortState } from './types';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const rows = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
];

const sort = ref<SortState | undefined>(undefined);

function handleSort(state: SortState) {
  sort.value = state;
}
</script>

<template>
  <Story title="Data/Table" group="data">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstCheckbox v-model="state.striped" title="Striped" />
        <HstCheckbox v-model="state.compact" title="Compact" />
        <HstCheckbox v-model="state.hoverable" title="Hoverable" />
        <HstCheckbox v-model="state.pinRows" title="Pin Rows" />
        <HstCheckbox v-model="state.pinCols" title="Pin Columns" />
      </template>

      <template #default="{ state }">
        <Table
          :columns="columns"
          :rows="rows"
          :striped="state.striped"
          :compact="state.compact"
          :hoverable="state.hoverable"
          :pin-rows="state.pinRows"
          :pin-cols="state.pinCols"
        />
      </template>
    </Variant>

    <Variant title="Striped & Hoverable">
      <Table :columns="columns" :rows="rows" :striped="true" :hoverable="true" />
    </Variant>

    <Variant title="With Sorting">
      <Table :columns="columns" :rows="rows" :sort="sort" @sort="handleSort" />
      <p v-if="sort" style="margin-top: 8px; font-size: 0.875rem; color: gray">
        Sorting by <strong>{{ sort.key }}</strong> ({{ sort.direction }})
      </p>
    </Variant>

    <Variant title="Column Alignment and Width">
      <Table
        :columns="[
          { key: 'id', label: 'ID', width: '60px', align: 'center' },
          { key: 'name', label: 'Name' },
          { key: 'amount', label: 'Amount', align: 'right' },
        ]"
        :rows="[
          { id: 1, name: 'Order A', amount: '$120.00' },
          { id: 2, name: 'Order B', amount: '$85.50' },
          { id: 3, name: 'Order C', amount: '$210.00' },
        ]"
      />
    </Variant>

    <Variant title="Loading">
      <Table :columns="columns" :rows="[]" :loading="true" />
    </Variant>

    <Variant title="Empty">
      <Table :columns="columns" :rows="[]" empty-message="No users found" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Table

A data table with sorting, striping, hover effects, pinning, and loading/empty states.

## Usage

```vue
<Table
  :columns="columns"
  :rows="users"
  :striped="true"
  :hoverable="true"
  :sort="currentSort"
  @sort="handleSort"
/>
```

## Props

| Prop           | Type                        | Default               | Description                |
| -------------- | --------------------------- | --------------------- | -------------------------- |
| `columns`      | `TableColumn[]`             | —                     | Column definitions         |
| `rows`         | `Record<string, unknown>[]` | —                     | Array of row data objects  |
| `striped`      | `boolean`                   | `false`               | Adds zebra striping        |
| `compact`      | `boolean`                   | `false`               | Compact row height         |
| `hoverable`    | `boolean`                   | `false`               | Hover highlighting on rows |
| `pinRows`      | `boolean`                   | `false`               | Pins the header row        |
| `pinCols`      | `boolean`                   | `false`               | Pins the first column      |
| `sort`         | `SortState`                 | —                     | Current sort state         |
| `loading`      | `boolean`                   | `false`               | Shows loading spinner      |
| `emptyMessage` | `string`                    | `'No data available'` | Message when no rows       |
| `className`    | `string`                    | —                     | Additional CSS classes     |

## Events

| Event  | Payload     | Description                                      |
| ------ | ----------- | ------------------------------------------------ |
| `sort` | `SortState` | Emitted when a sortable column header is clicked |

## Custom Cell Rendering

Use scoped slots named `cell-{columnKey}` to customize cell rendering:

```vue
<Table :columns="columns" :rows="rows">
  <template #cell-name="{ row, value }">
    <strong>{{ value }}</strong>
  </template>
</Table>
```
</docs>

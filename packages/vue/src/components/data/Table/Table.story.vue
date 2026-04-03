<script setup lang="ts">
import Table from './Table.vue';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const data = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
];
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
          :data="data"
          :striped="state.striped"
          :compact="state.compact"
          :hoverable="state.hoverable"
          :pin-rows="state.pinRows"
          :pin-cols="state.pinCols"
        />
      </template>
    </Variant>

    <Variant title="Striped & Hoverable">
      <Table :columns="columns" :data="data" :striped="true" :hoverable="true" />
    </Variant>

    <Variant title="Loading">
      <Table :columns="columns" :data="[]" :loading="true" />
    </Variant>

    <Variant title="Empty">
      <Table :columns="columns" :data="[]" empty-message="No users found" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Table

A data table with sorting, striping, hover effects, and loading/empty states.
</docs>

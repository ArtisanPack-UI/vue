<script setup lang="ts">
import { ref } from 'vue';
import Table from './Table.vue';
import type { TableKey, TableSort } from './types';

const headers = [
  { key: 'symbol', label: 'Product name', secondary: 'company', sortable: true },
  { key: 'amount', label: 'Order amount', numeric: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Executed by' },
];

const rows = [
  {
    id: 1,
    symbol: 'TSLA',
    company: 'Tesla, Inc.',
    amount: '$30,021.23',
    date: 'Dec 13, 2023',
    status: 'Processing',
    owner: 'Olivia Rhye',
  },
  {
    id: 2,
    symbol: 'MTCH',
    company: 'Match Group, Inc.',
    amount: '$10,045.00',
    date: 'Dec 13, 2023',
    status: 'Success',
    owner: 'Phoenix Baker',
  },
  {
    id: 3,
    symbol: 'DDOG',
    company: 'Datadog Inc.',
    amount: '$40,132.16',
    date: 'Dec 13, 2023',
    status: 'Success',
    owner: 'Lana Steiner',
  },
  {
    id: 4,
    symbol: 'ARKG',
    company: 'ARK Genomic Revolution ETF',
    amount: '$22,665.12',
    date: 'Dec 28, 2023',
    status: 'Declined',
    owner: 'Demi Wilkinson',
  },
];

const selected = ref<TableKey[]>([2]);
const sort = ref<TableSort>({ column: 'date', direction: 'desc' });
const page = ref(3);
</script>

<template>
  <Story title="Data/Table" group="data">
    <Variant title="Default">
      <Table title="Transaction history" :headers="headers" :rows="rows" />
    </Variant>
    <Variant title="Selection, sorting, expansion and pagination">
      <Table
        v-model="selected"
        v-model:sort-by="sort"
        title="Transaction history"
        :headers="headers"
        :rows="rows"
        selectable
        expandable
        :footer="`${selected.length} selected · 4 of 128 transactions`"
        :pagination="{
          page,
          total: 128,
          perPage: 4,
          onPageChange: (next: number) => (page = next),
        }"
      >
        <template #expansion="{ row }">{{ row.company }} — order details</template>
      </Table>
    </Variant>
    <Variant title="Compact">
      <Table title="Transaction history" :headers="headers" :rows="rows" density="compact" />
    </Variant>
    <Variant title="Loading">
      <Table title="Transaction history" :headers="headers" :rows="rows" loading />
    </Variant>
    <Variant title="Empty">
      <Table title="Transaction history" :headers="headers" :rows="[]" />
    </Variant>
  </Story>
</template>

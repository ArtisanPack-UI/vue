<script setup lang="ts">
import { ref } from 'vue';
import Pagination from './Pagination.vue';

const page = ref(3);
const summaryPage = ref(3);
</script>

<template>
  <Story title="Navigation/Pagination" group="navigation">
    <Variant title="Default">
      <Pagination v-model:page="page" :total="318" :per-page="10" />
    </Variant>

    <Variant title="With summary">
      <Pagination
        v-model:page="summaryPage"
        :total="318"
        :per-page="10"
        summary
        summary-label="Showing {from}–{to} of {total} properties"
      />
    </Variant>
  </Story>
</template>

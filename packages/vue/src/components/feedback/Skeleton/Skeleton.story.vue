<script setup lang="ts">
import Skeleton from './Skeleton.vue';
</script>

<template>
  <Story title="Feedback/Skeleton" group="feedback">
    <Variant title="List">
      <div aria-busy="true" style="display: grid; gap: 14px; padding: 16px">
        <div v-for="row in 3" :key="row" style="display: flex; gap: 12px; align-items: center">
          <Skeleton shape="circle" :width="40" :height="40" />
          <div style="flex: 1">
            <Skeleton shape="text" width="50%" />
            <Skeleton shape="text" width="80%" />
          </div>
        </div>
      </div>
    </Variant>
    <Variant title="Block">
      <div style="padding: 16px">
        <Skeleton width="240px" height="120px" />
      </div>
    </Variant>
  </Story>
</template>

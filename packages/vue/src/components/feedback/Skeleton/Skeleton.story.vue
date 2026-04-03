<script setup lang="ts">
import Skeleton from './Skeleton.vue';
</script>

<template>
  <Story title="Feedback/Skeleton" group="feedback">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.width" title="Width" />
        <HstText v-model="state.height" title="Height" />
        <HstCheckbox v-model="state.circle" title="Circle" />
      </template>

      <template #default="{ state }">
        <Skeleton
          :width="state.width || '100%'"
          :height="state.height || '20px'"
          :circle="state.circle"
        />
      </template>
    </Variant>

    <Variant title="Text Skeleton">
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 400px">
        <Skeleton width="80%" height="16px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="60%" height="16px" />
      </div>
    </Variant>

    <Variant title="Card Skeleton">
      <div style="max-width: 300px; display: flex; flex-direction: column; gap: 12px">
        <Skeleton width="100%" height="200px" />
        <Skeleton width="70%" height="20px" />
        <Skeleton width="100%" height="14px" />
        <Skeleton width="90%" height="14px" />
      </div>
    </Variant>

    <Variant title="Avatar Skeleton">
      <div style="display: flex; gap: 16px; align-items: center">
        <Skeleton width="48px" height="48px" :circle="true" />
        <div style="display: flex; flex-direction: column; gap: 8px">
          <Skeleton width="150px" height="16px" />
          <Skeleton width="100px" height="14px" />
        </div>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Skeleton

A placeholder skeleton loader for content that is loading.
</docs>

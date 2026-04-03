<script setup lang="ts">
import Loading from './Loading.vue';
</script>

<template>
  <Story title="Feedback/Loading" group="feedback">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.variant" title="Variant" :options="['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity']" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
      </template>

      <template #default="{ state }">
        <Loading
          :variant="state.variant || 'spinner'"
          :color="state.color || undefined"
          :size="state.size || undefined"
        />
      </template>
    </Variant>

    <Variant title="Variants">
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
        <div v-for="v in ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity']" :key="v" style="text-align: center">
          <Loading :variant="v" color="primary" size="lg" />
          <div style="margin-top: 8px; font-size: 0.75rem">{{ v }}</div>
        </div>
      </div>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 16px; align-items: center">
        <Loading v-for="c in ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']" :key="c" variant="spinner" :color="c" size="md" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 16px; align-items: center">
        <Loading v-for="s in ['xs', 'sm', 'md', 'lg']" :key="s" variant="spinner" color="primary" :size="s" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Loading

A loading indicator with spinner, dots, ring, ball, bars, and infinity variants.
</docs>

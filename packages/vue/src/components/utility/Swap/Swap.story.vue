<script setup lang="ts">
import { ref } from 'vue';
import Icon from '../Icon/Icon.vue';
import Swap from './Swap.vue';

const dark = ref(false);
</script>

<template>
  <Story title="Utility/Swap" group="utility">
    <Variant title="Sun and moon">
      <div style="display: flex; gap: 12px; align-items: center">
        <Swap v-model:checked="dark" label="Dark mode" />
        <Swap label="Dark mode" :checked="true" />
        <Swap label="Dark mode" disabled />
      </div>
    </Variant>
    <Variant title="Rotate and custom content">
      <div style="display: flex; gap: 12px; align-items: center">
        <Swap label="Menu" transition="rotate" on-icon="x" off-icon="list" size="lg" />
        <Swap label="Starred" transition="none" size="sm">
          <template #on><Icon name="star" color="warning" /></template>
          <template #off><Icon name="star" /></template>
        </Swap>
      </div>
    </Variant>
  </Story>
</template>

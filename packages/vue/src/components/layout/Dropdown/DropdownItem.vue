<script setup lang="ts">
/** @module DropdownItem */
import type { DropdownItemProps } from './types';

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

function handleClick(e: MouseEvent) {
  if (!props.disabled) {
    emit('click', e);
  }
}
</script>

<template>
  <li role="none">
    <button
      role="menuitem"
      type="button"
      :disabled="disabled"
      :aria-disabled="disabled || undefined"
      :class="disabled ? 'disabled' : ''"
      @click="handleClick"
    >
      <slot />
    </button>
  </li>
</template>

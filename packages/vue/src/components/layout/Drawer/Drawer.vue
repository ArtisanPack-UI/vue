<script setup lang="ts">
/** @module Drawer */
import { onBeforeUnmount, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DrawerProps } from './types';
import { getFocusableElements } from '../utils/focusable';

const props = withDefaults(defineProps<DrawerProps>(), {
  end: false,
  persistent: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const autoId = useId();
const drawerId = `drawer-${autoId}`;

const sideRef = ref<HTMLElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

function close() {
  if (props.persistent) return;
  emit('update:open', false);
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.open) return;

  if (e.key === 'Escape' && !props.persistent) {
    e.preventDefault();
    emit('update:open', false);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements(sideRef.value);
    if (focusable.length === 0) {
      e.preventDefault();
      sideRef.value?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isInsideDrawer = sideRef.value?.contains(document.activeElement);

    if (!isInsideDrawer) {
      // Focus leaked outside — pull it back in
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      previousActiveElement.value = document.activeElement as HTMLElement;
      const focusable = getFocusableElements(sideRef.value);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        sideRef.value?.focus();
      }
    } else {
      if (previousActiveElement.value?.isConnected) {
        previousActiveElement.value.focus();
      }
      previousActiveElement.value = null;
    }
  },
  { immediate: true, flush: 'post' },
);

onBeforeUnmount(() => {
  if (previousActiveElement.value?.isConnected) {
    previousActiveElement.value.focus();
  }
});
</script>

<template>
  <div :class="cn('drawer', end && 'drawer-end')" @keydown="handleKeydown">
    <input
      :id="drawerId"
      type="checkbox"
      class="drawer-toggle"
      :checked="open"
      :aria-hidden="true"
      tabindex="-1"
    />
    <div class="drawer-content">
      <slot />
    </div>
    <div class="drawer-side" :class="open ? 'z-50' : ''">
      <label
        :for="drawerId"
        class="drawer-overlay"
        :aria-label="!persistent ? 'Close drawer' : undefined"
        @click.prevent="close"
      />
      <div
        ref="sideRef"
        class="menu bg-base-200 text-base-content min-h-full w-80 p-4"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-hidden="!open"
        :aria-labelledby="ariaLabelledby || undefined"
        :aria-label="!ariaLabelledby ? ariaLabel : undefined"
      >
        <slot name="side" />
      </div>
    </div>
  </div>
</template>

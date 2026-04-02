<script setup lang="ts">
/** @module Drawer */
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DrawerProps } from './types';

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

function getFocusableElements(): HTMLElement[] {
  if (!sideRef.value) return [];
  return Array.from(
    sideRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.open) return;

  if (e.key === 'Escape' && !props.persistent) {
    e.preventDefault();
    emit('update:open', false);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousActiveElement.value = document.activeElement as HTMLElement;
      await nextTick();
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    } else {
      if (previousActiveElement.value?.isConnected) {
        previousActiveElement.value.focus();
      }
      previousActiveElement.value = null;
    }
  },
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
        @click="close"
      />
      <div
        ref="sideRef"
        class="menu bg-base-200 text-base-content min-h-full w-80 p-4"
        role="dialog"
        aria-modal="true"
        :aria-hidden="!open"
      >
        <slot name="side" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/** @module Popover */
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { PopoverProps } from './types';

const props = withDefaults(defineProps<Omit<PopoverProps, 'open'>>(), {
  triggerMode: 'hover',
  position: 'bottom',
  showDelay: 0,
  hideDelay: 300,
  persistent: false,
});

const openModel = defineModel<boolean>('open', { default: false });

const autoId = useId();
const contentId = `popover-content-${autoId}`;

const isOpen = computed(() => !!openModel.value);

const containerRef = ref<HTMLElement | null>(null);
const showTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const hideTimer = ref<ReturnType<typeof setTimeout> | null>(null);

function setOpen(value: boolean) {
  openModel.value = value;
}

function clearTimers() {
  if (showTimer.value) {
    clearTimeout(showTimer.value);
    showTimer.value = null;
  }
  if (hideTimer.value) {
    clearTimeout(hideTimer.value);
    hideTimer.value = null;
  }
}

function show() {
  clearTimers();
  if (props.showDelay > 0 && props.triggerMode === 'hover') {
    showTimer.value = setTimeout(() => setOpen(true), props.showDelay);
  } else {
    setOpen(true);
  }
}

function hide() {
  if (props.persistent) return;
  clearTimers();
  if (props.hideDelay > 0 && props.triggerMode === 'hover') {
    hideTimer.value = setTimeout(() => setOpen(false), props.hideDelay);
  } else {
    setOpen(false);
  }
}

function handleTriggerClick() {
  if (props.triggerMode === 'click') {
    if (isOpen.value) {
      hide();
    } else {
      show();
    }
  }
}

function handleMouseEnter() {
  if (props.triggerMode === 'hover') {
    show();
  }
}

function handleMouseLeave() {
  if (props.triggerMode === 'hover') {
    hide();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && !props.persistent) {
    setOpen(false);
  } else if ((e.key === 'Enter' || e.key === ' ') && props.triggerMode === 'click') {
    e.preventDefault();
    handleTriggerClick();
  }
}

function handleClickOutside(e: MouseEvent) {
  if (
    props.triggerMode === 'click' &&
    !props.persistent &&
    containerRef.value &&
    !containerRef.value.contains(e.target as Node)
  ) {
    setOpen(false);
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  clearTimers();
});

const positionMap: Record<string, string> = {
  top: 'dropdown-top',
  bottom: 'dropdown-bottom',
  left: 'dropdown-left',
  right: 'dropdown-right',
};

const containerClasses = computed(() =>
  cn('dropdown', positionMap[props.position], isOpen.value && 'dropdown-open'),
);
</script>

<template>
  <div
    ref="containerRef"
    :class="containerClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
  >
    <div
      tabindex="0"
      :role="triggerMode === 'click' ? 'button' : undefined"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      @click.stop="handleTriggerClick"
    >
      <slot name="trigger" />
    </div>
    <div
      :id="contentId"
      tabindex="0"
      role="dialog"
      class="dropdown-content bg-base-100 rounded-box z-50 shadow-lg p-4"
    >
      <slot />
    </div>
  </div>
</template>

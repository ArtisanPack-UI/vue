<script setup lang="ts">
/** @module Dropdown */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DropdownProps } from './types';

const props = withDefaults(defineProps<Omit<DropdownProps, 'open'>>(), {
  label: 'Options',
  end: false,
  top: false,
  hover: false,
});

const openModel = defineModel<boolean>('open');
const attrs = useAttrs();

const autoId = useId();
const menuId = `dropdown-menu-${autoId}`;

const isControlled = computed(() => 'onUpdate:open' in attrs);
const internalOpen = ref(false);
const isOpen = computed(() => (isControlled.value ? !!openModel.value : internalOpen.value));

const dropdownRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

function setOpen(value: boolean) {
  if (isControlled.value) {
    openModel.value = value;
  } else {
    internalOpen.value = value;
  }
}

function toggle() {
  setOpen(!isOpen.value);
}

function getMenuItems(): HTMLElement[] {
  if (!menuRef.value) return [];
  return Array.from(
    menuRef.value.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])',
    ),
  );
}

function focusItem(index: number) {
  const items = getMenuItems();
  if (items[index]) {
    items[index].focus();
  }
}

function handleTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    setOpen(true);
  }
}

function handleMenuKeydown(e: KeyboardEvent) {
  const items = getMenuItems();
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusItem(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusItem(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    focusItem(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    focusItem(items.length - 1);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    setOpen(false);
  } else if (e.key === 'Tab') {
    setOpen(false);
  }
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    setOpen(false);
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    focusItem(0);
  }
});

const dropdownClasses = computed(() =>
  cn(
    'dropdown',
    props.end && 'dropdown-end',
    props.top && 'dropdown-top',
    props.hover && 'dropdown-hover',
    isOpen.value && 'dropdown-open',
  ),
);
</script>

<template>
  <div ref="dropdownRef" :class="dropdownClasses">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost m-1"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger">
        {{ label }}
      </slot>
    </div>
    <ul
      :id="menuId"
      ref="menuRef"
      role="menu"
      class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
      @keydown="handleMenuKeydown"
    >
      <slot />
    </ul>
  </div>
</template>

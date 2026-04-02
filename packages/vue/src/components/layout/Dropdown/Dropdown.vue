<script setup lang="ts">
/** @module Dropdown */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DropdownProps } from './types';

const props = withDefaults(defineProps<Omit<DropdownProps, 'open'>>(), {
  label: 'Options',
  end: false,
  top: false,
  hover: false,
});

const openModel = defineModel<boolean>('open', { default: false });

const autoId = useId();
const menuId = `dropdown-menu-${autoId}`;
const triggerId = `dropdown-trigger-${autoId}`;

const isOpen = computed(() => !!openModel.value);

const dropdownRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const lastOpenKey = ref<string | null>(null);

function setOpen(value: boolean) {
  openModel.value = value;
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
    lastOpenKey.value = e.key;
    setOpen(true);
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
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
    triggerRef.value?.focus();
  } else if (e.key === 'Tab') {
    setOpen(false);
  }
}

function handleMenuClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const menuItem = target.closest('[role="menuitem"]:not([disabled]):not([aria-disabled="true"])');
  if (menuItem) {
    setOpen(false);
    triggerRef.value?.focus();
  }
}

function handleMouseEnter() {
  if (props.hover) {
    setOpen(true);
  }
}

function handleMouseLeave() {
  if (props.hover) {
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
    const items = getMenuItems();
    if (lastOpenKey.value === 'ArrowUp' && items.length > 0) {
      focusItem(items.length - 1);
    } else {
      focusItem(0);
    }
    lastOpenKey.value = null;
  }
});

const dropdownClasses = computed(() =>
  cn(
    'dropdown',
    props.end && 'dropdown-end',
    props.top && 'dropdown-top',
    isOpen.value && 'dropdown-open',
  ),
);
</script>

<template>
  <div
    ref="dropdownRef"
    :class="dropdownClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      :id="triggerId"
      ref="triggerRef"
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
      :aria-labelledby="triggerId"
      class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
      @keydown="handleMenuKeydown"
      @click="handleMenuClick"
    >
      <slot />
    </ul>
  </div>
</template>

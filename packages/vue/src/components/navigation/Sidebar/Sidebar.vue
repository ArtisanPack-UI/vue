<script setup lang="ts">
/** @module Sidebar */
import { computed, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { SidebarProps } from './types';

const props = withDefaults(defineProps<SidebarProps>(), {
  side: 'left',
  responsive: true,
  ariaLabel: 'Sidebar navigation',
});

const openModel = defineModel<boolean>('open', { default: false });

const autoId = useId();
const drawerId = `sidebar-${autoId}`;

const drawerClasses = computed(() =>
  cn(
    'drawer',
    props.side === 'right' && 'drawer-end',
    props.responsive && 'lg:drawer-open',
    props.className,
  ),
);

function handleOverlayClose() {
  openModel.value = false;
}

function handleOverlayKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleOverlayClose();
  }
}
</script>

<template>
  <div :class="drawerClasses">
    <input
      :id="drawerId"
      type="checkbox"
      class="drawer-toggle"
      :checked="openModel"
      :aria-hidden="true"
      @change="openModel = ($event.target as HTMLInputElement).checked"
    />
    <div class="drawer-content">
      <slot />
    </div>
    <div class="drawer-side">
      <div
        class="drawer-overlay"
        aria-label="Close sidebar"
        role="button"
        tabindex="0"
        @click="handleOverlayClose"
        @keydown="handleOverlayKeydown"
      />
      <aside
        :class="cn('menu bg-base-200 min-h-full w-80 p-4')"
        :aria-label="ariaLabel"
        role="navigation"
      >
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>

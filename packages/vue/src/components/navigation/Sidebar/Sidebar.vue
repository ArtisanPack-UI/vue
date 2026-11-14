<script setup lang="ts">
/**
 * @module Sidebar
 *
 * @deprecated Use AppShell (#58): the sidebar is a part of the application
 * frame. Sidebar is a thin alias that renders an AppShell and maps its 2.x
 * API: the `sidebar` slot → AppShell's `sidebar` slot, the default slot →
 * its content, `ariaLabel` → `label` and `className` → `class`. AppShell
 * has no mobile drawer or end-side sidebar, so `open` (and `v-model:open`),
 * `side` and `responsive` are ignored: the sidebar sits at the start edge and
 * stacks above the content on narrow screens. Every other attribute,
 * including AppShell's own props, passes through.
 */
import AppShell from '../../layout/AppShell/AppShell.vue';
import { warnOnce } from '../../_shared/design-system';
import type { SidebarProps } from './types';

withDefaults(defineProps<SidebarProps>(), {
  open: false,
  side: 'left',
  responsive: true,
  ariaLabel: 'Sidebar navigation',
  className: undefined,
});

defineEmits<{
  /** Never emitted: AppShell has no drawer to open or close. Kept so `v-model:open` compiles. */
  'update:open': [value: boolean];
}>();

warnOnce('Sidebar', 'Sidebar is deprecated; use AppShell.');
</script>

<template>
  <AppShell :label="ariaLabel" :class="className">
    <template v-if="$slots.sidebar" #sidebar><slot name="sidebar" /></template>
    <slot />
  </AppShell>
</template>

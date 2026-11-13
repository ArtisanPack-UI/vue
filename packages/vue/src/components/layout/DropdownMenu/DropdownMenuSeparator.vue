<script setup lang="ts">
/**
 * @module DropdownMenuSeparator
 *
 * A rule between items in a DropdownMenu.
 */
import { inject, mergeProps } from 'vue';
import { DROPDOWN_MENU_KEY } from './keys';

const menu = inject(DROPDOWN_MENU_KEY);
if (!menu) {
  throw new Error('[@artisanpack-ui/vue] DropdownMenuSeparator must be inside a DropdownMenu.');
}

function separatorAttrs(): Record<string, unknown> {
  const own = menu!.api().getSeparatorProps() as Record<string, unknown>;
  const className = menu!.classOf('separator');
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <hr v-bind="separatorAttrs()" />
</template>

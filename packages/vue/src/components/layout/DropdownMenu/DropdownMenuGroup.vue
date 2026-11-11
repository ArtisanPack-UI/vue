<script setup lang="ts">
/**
 * @module DropdownMenuGroup
 *
 * A group of items in a DropdownMenu, labelled by its `label` for assistive
 * technology.
 */
import { inject, mergeProps, useId } from 'vue';
import { DROPDOWN_MENU_KEY } from './keys';
import type { DropdownMenuGroupProps } from './types';

const props = withDefaults(defineProps<DropdownMenuGroupProps>(), {
  label: undefined,
});

const menu = inject(DROPDOWN_MENU_KEY);
if (!menu)
  throw new Error('[@artisanpack-ui/vue] DropdownMenuGroup must be inside a DropdownMenu.');

const id = useId();

function hasLabel(): boolean {
  return props.label !== undefined && props.label !== '';
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}

function groupAttrs(): Record<string, unknown> {
  const own = withClass(menu!.api().getItemGroupProps({ id }), menu!.classOf('itemGroup'));
  // Without a label there's nothing to point aria-labelledby at.
  return hasLabel() ? own : { ...own, 'aria-labelledby': undefined };
}
</script>

<template>
  <div v-bind="groupAttrs()">
    <div
      v-if="hasLabel()"
      v-bind="
        withClass(
          menu!.api().getItemGroupLabelProps({ htmlFor: id }),
          menu!.classOf('itemGroupLabel'),
        )
      "
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>

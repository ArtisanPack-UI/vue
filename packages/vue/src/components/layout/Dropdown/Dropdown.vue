<script setup lang="ts">
/**
 * @module Dropdown
 *
 * @deprecated Use DropdownMenu, the design-system replacement (#50).
 * Dropdown is a thin alias that renders a DropdownMenu and maps its 2.x
 * props: `label` and the `trigger` slot → the trigger's `label`, `end` →
 * `align="end"`, `v-model:open` as before. `top` and `hover` have no
 * DropdownMenu equivalent and are ignored: the menu opens on click and from
 * the keyboard. Put `DropdownItem` (or `DropdownMenuItem`) children in the
 * default slot. Every other attribute, including DropdownMenu's own props,
 * passes through to the DropdownMenu.
 */
import { computed, getCurrentInstance } from 'vue';
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue';
import { warnOnce } from '../../_shared/design-system';
import type { DropdownProps } from './types';

const props = withDefaults(defineProps<DropdownProps>(), {
  label: 'Options',
  end: false,
  top: false,
  hover: false,
  open: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

warnOnce('Dropdown', 'Dropdown is deprecated; use DropdownMenu.');

const instance = getCurrentInstance();

/**
 * `open` only when the parent passes it, so an unbound Dropdown keeps its own
 * state, as in 2.x.
 */
const openBinding = computed(() => {
  const raw = instance?.vnode.props;
  return raw && 'open' in raw ? { open: props.open } : {};
});
</script>

<template>
  <DropdownMenu
    v-bind="openBinding"
    :label="label"
    :align="end ? 'end' : undefined"
    @update:open="emit('update:open', $event)"
  >
    <template v-if="$slots.trigger" #label><slot name="trigger" /></template>
    <slot />
  </DropdownMenu>
</template>

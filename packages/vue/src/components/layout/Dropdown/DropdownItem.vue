<script setup lang="ts">
/**
 * @module DropdownItem
 *
 * @deprecated Use DropdownMenuItem inside a DropdownMenu (#50). DropdownItem
 * is a thin alias that renders a DropdownMenuItem with a generated `value`
 * (pass `value` to name it in the menu's `select` event) and keeps the 2.x
 * `click` event, which is also fired when the item is chosen from the
 * keyboard. A disabled item emits nothing.
 */
import { useId } from 'vue';
import DropdownMenuItem from '../DropdownMenu/DropdownMenuItem.vue';
import { warnOnce } from '../../_shared/design-system';
import type { DropdownItemProps } from './types';

const props = withDefaults(defineProps<DropdownItemProps>(), {
  disabled: false,
  value: undefined,
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

warnOnce('DropdownItem', 'DropdownItem is deprecated; use DropdownMenuItem.');

const autoValue = useId();

function handleClick(e: MouseEvent): void {
  if (!props.disabled) emit('click', e);
}
</script>

<template>
  <DropdownMenuItem :value="value ?? autoValue" :disabled="disabled" @click="handleClick">
    <slot />
  </DropdownMenuItem>
</template>

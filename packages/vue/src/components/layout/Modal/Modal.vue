<script setup lang="ts">
/**
 * @module Modal
 *
 * @deprecated Use Dialog, the design-system replacement (#49). Modal is a
 * thin alias that renders a Dialog and maps its 2.x props: `subtitle` →
 * `description`, `glass` → `surface="glass"`, `ariaLabel` → the
 * `aria-label` attribute and the `actions` slot → `footer`. `persistent`
 * renders an `alertdialog` without a close button and ignores Escape and
 * backdrop closes, as in 2.x. `bottom` has no Dialog equivalent and is
 * ignored (use a Drawer with `side="bottom"`). Every other attribute,
 * including Dialog's own props, passes through to the Dialog.
 */
import Dialog from '../Dialog/Dialog.vue';
import { warnOnce } from '../../_shared/design-system';
import type { ModalProps } from './types';

const props = withDefaults(defineProps<ModalProps>(), {
  title: undefined,
  subtitle: undefined,
  persistent: false,
  glass: false,
  bottom: false,
  ariaLabel: undefined,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

warnOnce('Modal', 'Modal is deprecated; use Dialog.');

/** Forwards the Dialog's open changes, except a close while `persistent`. */
function onOpenChange(open: boolean): void {
  if (props.persistent && !open) return;
  emit('update:open', open);
}
</script>

<template>
  <Dialog
    :open="open"
    :title="title"
    :description="subtitle"
    :surface="glass ? 'glass' : undefined"
    :role="persistent ? 'alertdialog' : undefined"
    :hide-close="persistent || undefined"
    :aria-label="title ? undefined : ariaLabel || 'Dialog'"
    @update:open="onOpenChange"
  >
    <template v-if="$slots.default" #default><slot /></template>
    <template v-if="$slots.actions" #footer><slot name="actions" /></template>
  </Dialog>
</template>

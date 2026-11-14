<script setup lang="ts">
/**
 * @module ToastMessage
 *
 * @deprecated Use Toast, the design-system replacement (#51). ToastMessage
 * is a thin alias that renders a static Toast from a 2.x `toast` item:
 * `message` → `title`, `color` as is, and the close button emits `dismiss`
 * with the item's id. Every other attribute, including Toast's own props,
 * passes through.
 */
import Toast from '../Toast/Toast.vue';
import { warnOnce } from '../../_shared/design-system';
import type { ToastItem } from './types';

const props = defineProps<{
  /** The toast data object to render. */
  toast: ToastItem;
}>();

const emit = defineEmits<{
  dismiss: [id: string];
}>();

warnOnce('ToastMessage', 'ToastMessage is deprecated; use Toast.');
</script>

<template>
  <Toast
    :title="props.toast.message"
    :color="props.toast.color"
    @open-change="emit('dismiss', props.toast.id)"
  />
</template>

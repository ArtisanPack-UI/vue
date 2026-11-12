<script setup lang="ts">
/**
 * @module Clipboard
 *
 * Copies a value with clear confirmation. Renders the design-system
 * Clipboard markup contract (`.apui-clipboard`, #65) on the behavior
 * package's `useClipboard`, as Code's copy button and the Blade and React
 * components do: `navigator.clipboard` with a fallback, "Copied" for the
 * timeout, and the result (or the failure) announced in a live region.
 */
import {
  CLIPBOARD_LABELS,
  CLIPBOARD_TIMEOUT,
  clipboardLabel,
  clipboardMessage,
} from '@artisanpack-ui/behavior';
import { useClipboard } from '@artisanpack-ui/behavior/vue';
import { computed } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { ClipboardProps } from './types';

const props = withDefaults(defineProps<ClipboardProps>(), {
  value: undefined,
  modelValue: undefined,
  text: undefined,
  timeout: CLIPBOARD_TIMEOUT,
  variant: 'button',
  size: 'sm',
  label: CLIPBOARD_LABELS.copy,
  copiedLabel: CLIPBOARD_LABELS.copied,
  copiedMessage: CLIPBOARD_LABELS.copiedMessage,
  errorMessage: CLIPBOARD_LABELS.errorMessage,
  classes: undefined,
});

const emit = defineEmits<{
  /** The value reached the clipboard. */
  copy: [value: string];
  /** The copy failed. */
  error: [error: unknown];
}>();

const clipboard = useClipboard(() => ({ timeout: props.timeout }));
const status = computed(() => clipboard.status.value);
const shown = computed(() =>
  props.variant === 'icon' || props.variant === 'field' ? props.variant : 'button',
);
const labels = computed(() => ({
  copy: props.label,
  copied: props.copiedLabel,
  copiedMessage: props.copiedMessage,
  errorMessage: props.errorMessage,
}));
const buttonLabel = computed(() => clipboardLabel(status.value, labels.value));
const message = computed(() => clipboardMessage(status.value, labels.value));
const iconOnly = computed(() => shown.value === 'icon');
/** `value`, else `modelValue`, else the deprecated 2.x `text`. */
const copied = computed(() => props.value ?? props.modelValue ?? props.text ?? '');

async function copy() {
  const value = copied.value;
  if (await clipboard.copy(value)) emit('copy', value);
  else emit('error', new Error('The value could not be copied to the clipboard.'));
}
</script>

<template>
  <component
    :is="shown === 'field' ? 'div' : 'span'"
    :class="['apui-clipboard', classes?.root]"
    data-scope="clipboard"
    data-part="root"
    :data-variant="shown"
    :data-size="size"
    :data-state="status"
  >
    <span v-if="shown === 'field'" v-bind="part('clipboard', 'field', classes?.field)"
      ><span v-bind="part('clipboard', 'value', classes?.value)">{{ copied }}</span></span
    >
    <button
      type="button"
      :class="['apui-button', classes?.button]"
      data-scope="clipboard"
      data-part="button"
      :data-variant="iconOnly ? 'ghost' : 'outline'"
      data-color="neutral"
      :data-size="size"
      :data-state="status"
      :data-icon-only="flag(iconOnly)"
      :aria-label="iconOnly ? buttonLabel : undefined"
      @click="copy"
    >
      <span data-scope="button" data-part="icon" aria-hidden="true"
        ><DsIcon :name="status === 'copied' ? 'check' : 'copy'"
      /></span>
      <span v-if="!iconOnly" data-scope="button" data-part="label">{{ buttonLabel }}</span>
    </button>
    <span v-bind="part('clipboard', 'tooltip', classes?.tooltip, { role: 'status' })"
      ><span v-if="status === 'copied'" aria-hidden="true"><DsIcon name="check" /></span
      >{{ message }}</span
    >
  </component>
</template>

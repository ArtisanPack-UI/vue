<script setup lang="ts">
/**
 * @module Clipboard
 *
 * Copies a value with clear confirmation. Renders the design-system
 * Clipboard markup contract (`.apui-clipboard`, #65) on the behavior
 * package's `useClipboard`, as Code's copy button and the Blade and React
 * components do: `navigator.clipboard` with a fallback, "Copied" for the
 * timeout, and the result (or the failure) announced in a live region.
 * After a failure the value shows (in every variant) and is selected, to copy
 * by hand; a new value clears a stale "Copied".
 */
import {
  CLIPBOARD_LABELS,
  CLIPBOARD_TIMEOUT,
  clipboardLabel,
  clipboardMessage,
} from '@artisanpack-ui/behavior';
import { useClipboard } from '@artisanpack-ui/behavior/vue';
import { computed, nextTick, ref, watch } from 'vue';
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
  /** The value reached the clipboard. Named apart from the native `copy` event. */
  copied: [value: string];
  /**
   * The 2.x name of `copied`, emitted with it. Declared, so a `@copy`
   * listener never catches a native copy event.
   *
   * @deprecated Listen for `copied`. Removed in a later major release.
   */
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

/** The value to copy by hand after a failed copy, shown in the field's box. */
const manual = ref<string | null>(null);
const valueEl = ref<HTMLElement | null>(null);
const showField = computed(() => shown.value === 'field' || manual.value !== null);

// A new value clears a stale "Copied" (even from a copy still in flight)
// and the manual-copy box.
watch(copied, () => {
  clipboard.reset();
  manual.value = null;
});

async function copy() {
  const value = copied.value;
  const ok = await clipboard.copy(value);
  // The value changed meanwhile: the result belongs to the old one.
  if (copied.value !== value) return;
  manual.value = ok ? null : value;
  if (ok) {
    emit('copied', value);
    emit('copy', value);
    return;
  }
  emit('error', new Error('The value could not be copied to the clipboard.'));
  // Select the value, ready for the platform's copy keys.
  await nextTick();
  const selection = typeof window === 'undefined' ? null : window.getSelection();
  if (valueEl.value && selection) selection.selectAllChildren(valueEl.value);
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
    <span v-if="showField" v-bind="part('clipboard', 'field', classes?.field)"
      ><span ref="valueEl" v-bind="part('clipboard', 'value', classes?.value)">{{
        copied
      }}</span></span
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

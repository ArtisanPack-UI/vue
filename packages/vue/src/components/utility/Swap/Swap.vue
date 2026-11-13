<script setup lang="ts">
/**
 * @module Swap
 *
 * A two-state toggle that swaps its on and off content, such as a sun and a
 * moon, rendering the design-system Swap markup contract (`.apui-swap`,
 * #65). A native checkbox with an accessible name sits over the content, so
 * the platform handles the keyboard and screen readers. No Claude Design
 * spec: token-driven like Grid.
 */
import { mergeProps, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue';
import { DsIcon, flag, hasContent, part } from '../../_shared/design-system';
import type { SwapEmits, SwapProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwapProps>(), {
  checked: false,
  onIcon: 'sun',
  offIcon: 'moon',
  transition: 'fade',
  size: 'md',
  disabled: false,
  classes: undefined,
});

const emit = defineEmits<SwapEmits>();

const attrs = useAttrs();
const slots = useSlots();

/** The rendered state: follows the prop, and the user's toggles when uncontrolled. */
const isChecked = ref(props.checked);
watch(
  () => props.checked,
  (checked) => {
    isChecked.value = checked;
  },
);

const control = ref<HTMLInputElement | null>(null);

// A form reset restores the checkbox without a change event: put it (and
// data-state) back to the `checked` prop, the initial state when unbound.
let resetTimer: ReturnType<typeof setTimeout> | undefined;
function onFormReset(event: Event): void {
  // The reset event fires before the form resets its controls. A later
  // listener can still cancel it, so that is checked once they have all run.
  resetTimer = setTimeout(() => {
    if (event.defaultPrevented) return;
    isChecked.value = props.checked;
    if (control.value) control.value.checked = props.checked;
  });
}
let resetForm: HTMLFormElement | null = null;
onMounted(() => {
  resetForm = control.value?.form ?? null;
  resetForm?.addEventListener('reset', onFormReset);
});
onBeforeUnmount(() => {
  resetForm?.removeEventListener('reset', onFormReset);
  if (resetTimer !== undefined) clearTimeout(resetTimer);
});

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-swap', attrs.class, props.classes?.root],
    'data-scope': 'swap',
    'data-part': 'root',
    'data-size': props.size,
    'data-transition': props.transition,
    'data-state': isChecked.value ? 'checked' : 'unchecked',
    'data-disabled': flag(props.disabled),
  };
}

function onChange(event: Event): void {
  const element = event.target as HTMLInputElement;
  isChecked.value = element.checked;
  emit('update:checked', element.checked);
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, ...rest } = attrs;
  return mergeProps(rest, {
    ...part('swap', 'control', props.classes?.control),
    type: 'checkbox',
    'aria-label': props.label || undefined,
    checked: isChecked.value,
    disabled: props.disabled || undefined,
    onChange,
  });
}

const hasOn = () => hasContent(slots.on?.());
const hasOff = () => hasContent(slots.off?.());
</script>

<template>
  <label v-bind="rootAttrs()">
    <input ref="control" v-bind="controlAttrs()" />
    <span v-bind="part('swap', 'on', classes?.on, { 'aria-hidden': 'true' })">
      <slot v-if="hasOn()" name="on" />
      <DsIcon v-else :name="onIcon" />
    </span>
    <span v-bind="part('swap', 'off', classes?.off, { 'aria-hidden': 'true' })">
      <slot v-if="hasOff()" name="off" />
      <DsIcon v-else :name="offIcon" />
    </span>
  </label>
</template>

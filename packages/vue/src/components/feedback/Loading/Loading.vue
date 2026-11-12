<script setup lang="ts">
/**
 * @module Loading
 *
 * Shows that work is in progress, rendering the design-system Loading markup
 * contract (`.apui-loading`, #60): a `role="status"` region with a spinner or
 * dots and a label. It waits `delay` ms before showing (`--apui-_delay`).
 */
import { mergeProps, useAttrs, useSlots } from 'vue';
import { flag, hasContent, part } from '../../_shared/design-system';
import type { LoadingProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LoadingProps>(), {
  variant: 'spinner',
  size: 'md',
  color: 'primary',
  label: 'Loading',
  overlay: false,
  delay: 300,
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();

function hasText(): boolean {
  return !!slots.default && hasContent(slots.default());
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(
    {
      class: 'apui-loading',
      'data-scope': 'loading',
      'data-part': 'root',
      role: 'status',
      'data-variant': props.variant,
      'data-size': props.size,
      'data-color': props.color,
      'data-overlay': flag(props.overlay),
      style: { '--apui-_delay': `${props.delay}ms` },
    },
    attrs,
    { class: props.classes?.root },
  );
}

function labelAttrs(): Record<string, unknown> {
  const own = part('loading', 'label', props.classes?.label);
  return hasText() ? own : mergeProps(own, { class: 'apui-sr-only' });
}
</script>

<template>
  <span v-bind="rootAttrs()">
    <span v-bind="part('loading', 'indicator', classes?.indicator, { 'aria-hidden': 'true' })"
      ><template v-if="variant === 'dots'"><span /><span /><span /></template
    ></span>
    <span v-bind="labelAttrs()"
      ><slot>{{ label }}</slot></span
    >
  </span>
</template>

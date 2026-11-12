<script setup lang="ts">
/**
 * @module Heading
 *
 * A title from the type scale, with the semantic level and the visual size
 * set apart. Renders the design-system Heading markup contract
 * (`.apui-heading`, #58); the eyebrow is a paragraph just before it.
 */
import { computed, useAttrs } from 'vue';
import { part } from '../../_shared/design-system';
import type { HeadingProps, HeadingStep } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 2,
  size: undefined,
  eyebrow: undefined,
  classes: undefined,
});

const attrs = useAttrs();

/** A level or size as 1–6, or `undefined` when it's out of range. */
function step(value: HeadingStep | undefined): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 6 ? number : undefined;
}

const levelValue = computed(() => step(props.level) ?? 2);
const sizeValue = computed(() => step(props.size) ?? levelValue.value);
</script>

<template>
  <p v-if="$slots.eyebrow || eyebrow" v-bind="part('heading', 'eyebrow', classes?.eyebrow)">
    <slot name="eyebrow">{{ eyebrow }}</slot>
  </p>
  <component
    :is="`h${levelValue}`"
    v-bind="attrs"
    :class="['apui-heading', classes?.root]"
    :data-level="levelValue"
    :data-size="sizeValue"
    ><slot
  /></component>
</template>

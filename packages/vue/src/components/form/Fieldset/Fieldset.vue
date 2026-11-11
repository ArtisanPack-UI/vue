<script setup lang="ts">
/**
 * @module Fieldset
 *
 * Groups related fields under a legend (title and description). Renders the
 * design-system Fieldset markup contract (`.apui-fieldset`, #53).
 */
import { useSlots } from 'vue';
import { flag, hasContent, part } from '../../_shared/design-system';
import type { FieldsetProps } from './types';

const props = withDefaults(defineProps<FieldsetProps>(), {
  variant: 'panel',
  title: undefined,
  description: undefined,
  disabled: false,
  classes: undefined,
});

const slots = useSlots();

function hasTitle(): boolean {
  return hasContent(slots.title?.()) || (props.title !== undefined && props.title !== '');
}

function hasDescription(): boolean {
  return (
    hasContent(slots.description?.()) ||
    (props.description !== undefined && props.description !== '')
  );
}
</script>

<template>
  <fieldset
    :class="['apui-fieldset', classes?.root]"
    :data-variant="variant"
    :data-disabled="flag(disabled)"
    :disabled="disabled || undefined"
  >
    <legend
      v-if="hasTitle() || hasDescription()"
      v-bind="part('fieldset', 'legend', classes?.legend)"
    >
      <span v-if="hasTitle()" v-bind="part('fieldset', 'title', classes?.title)"
        ><slot name="title">{{ title }}</slot></span
      ><span v-if="hasDescription()" v-bind="part('fieldset', 'description', classes?.description)"
        ><slot name="description">{{ description }}</slot></span
      >
    </legend>
    <slot />
  </fieldset>
</template>

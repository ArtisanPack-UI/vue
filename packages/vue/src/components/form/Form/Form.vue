<script setup lang="ts">
/**
 * @module Form
 *
 * A native form that lays out its fields with the field gap and ends with
 * an actions row. Renders the design-system Form markup contract
 * (`.apui-form`, #53).
 */
import { useSlots } from 'vue';
import { flag, hasContent, part } from '../../_shared/design-system';
import type { FormProps } from './types';

const props = withDefaults(defineProps<FormProps>(), {
  actions: undefined,
  divided: false,
  classes: undefined,
});

const slots = useSlots();

function hasActions(): boolean {
  return hasContent(slots.actions?.()) || (props.actions !== undefined && props.actions !== '');
}
</script>

<template>
  <form :class="['apui-form', classes?.root]" :data-divided="flag(divided)">
    <slot />
    <div v-if="hasActions()" v-bind="part('form', 'actions', classes?.actions)">
      <slot name="actions">{{ actions }}</slot>
    </div>
  </form>
</template>

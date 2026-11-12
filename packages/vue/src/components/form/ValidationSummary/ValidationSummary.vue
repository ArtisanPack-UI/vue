<script setup lang="ts">
/**
 * @module ValidationSummary
 *
 * Lists every error in a form after a failed submit, each linked to its
 * field. An error summary is an alert and takes focus when it appears; a
 * warning summary is a status. Renders the design-system ValidationSummary
 * markup contract (`.apui-validation-summary`, #53). It is not ErrorState.
 */
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import { focusField, normalizeErrors } from '../../_shared/form-text';
import type { ValidationSummaryProps } from './types';

const props = withDefaults(defineProps<ValidationSummaryProps>(), {
  errors: undefined,
  color: 'error',
  title: undefined,
  classes: undefined,
});

const slots = useSlots();
const root = ref<HTMLElement | null>(null);

const items = computed(() => normalizeErrors(props.errors));

const heading = computed(() => {
  if (props.title !== undefined && props.title !== '') return props.title;
  const count = items.value.length;
  if (props.color === 'warning') {
    return count === 1 ? '1 recommendation' : `${count} recommendations`;
  }
  return count === 1 ? 'Fix 1 field' : `Fix ${count} fields`;
});

function focusRoot(): void {
  if (props.color === 'error') root.value?.focus();
}

onMounted(() => {
  // After the tick, so a parent that mounts it detached has attached it.
  if (items.value.length) void nextTick(focusRoot);
});

watch(
  () => items.value.length,
  (count, previous) => {
    if (count > 0 && previous === 0) void nextTick(focusRoot);
  },
);

function onLinkClick(event: MouseEvent, field: string): void {
  if (focusField(field)) event.preventDefault();
}
</script>

<template>
  <div
    v-if="items.length"
    ref="root"
    :class="['apui-validation-summary', classes?.root]"
    :data-color="color"
    :role="color === 'warning' ? 'status' : 'alert'"
    :tabindex="color === 'warning' ? undefined : -1"
  >
    <span v-bind="part('validation-summary', 'icon', classes?.icon, { 'aria-hidden': 'true' })"
      ><DsIcon :name="color === 'warning' ? 'triangle-alert' : 'circle-alert'"
    /></span>
    <p v-bind="part('validation-summary', 'title', classes?.title)">
      <slot v-if="hasContent(slots.title?.())" name="title" /><template v-else>{{
        heading
      }}</template>
    </p>
    <ul v-bind="part('validation-summary', 'list', classes?.list)">
      <li
        v-for="(item, index) in items"
        :key="`${item.field}-${index}`"
        v-bind="part('validation-summary', 'item', classes?.item)"
      >
        <a
          v-bind="part('validation-summary', 'link', classes?.link)"
          :href="`#${item.field}`"
          @click="onLinkClick($event, item.field)"
          >{{ item.message }}</a
        >
      </li>
    </ul>
  </div>
</template>

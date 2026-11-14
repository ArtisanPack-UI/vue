<script setup lang="ts">
/**
 * @module Accordion
 *
 * Stacked sections that expand and collapse (#58). Renders the
 * design-system Accordion markup contract (`.apui-accordion`) on the shared
 * Zag accordion machine (`useAccordion`): each item is a heading holding a
 * button with aria-expanded and aria-controls, and a panel that is a region
 * labelled by it and hidden while closed. ArrowDown and ArrowUp move between
 * triggers.
 *
 * Compose it from `AccordionItem` children, or pass the same items as
 * `items` (rendered first). Bind the open items with `v-model`.
 */
import { computed, getCurrentInstance, h, mergeProps, provide, ref, useAttrs } from 'vue';
import { useAccordion } from '@artisanpack-ui/behavior/vue';
import { flag } from '../../_shared/design-system';
import AccordionItem from './AccordionItem.vue';
import { ACCORDION_KEY } from './keys';
import type { AccordionPart, AccordionProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionProps>(), {
  modelValue: undefined,
  items: undefined,
  multiple: false,
  collapsible: true,
  variant: 'default',
  headingLevel: 3,
  disabled: false,
  classes: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes `modelValue`; then the accordion shows only what it says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'modelValue' in raw;
}

const localValue = ref<string[]>(props.modelValue ?? []);

const machine = useAccordion(() => ({
  value: (isBound() ? props.modelValue : localValue.value) ?? [],
  multiple: props.multiple,
  collapsible: props.collapsible,
  disabled: props.disabled || undefined,
  onValueChange: ({ value }) => {
    if (!isBound()) localValue.value = value;
    emit('update:modelValue', value);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` for the template type-check. */
const api = computed(() => machine.value);

function classOf(name: AccordionPart): string | undefined {
  return props.classes?.[name];
}

provide(ACCORDION_KEY, {
  api: () => api.value,
  classOf,
  level: () => Math.min(6, Math.max(2, Math.round(Number(props.headingLevel) || 3))),
});

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, api.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-accordion', props.classes?.root],
    'data-variant': props.variant,
    'data-multiple': flag(props.multiple),
    'data-collapsible': flag(props.collapsible),
  });
}

/** The `items` data as AccordionItems. */
const DataItems = () =>
  (props.items ?? []).map(({ content, ...item }) =>
    h(AccordionItem, { key: `item-${item.value}`, ...item }, () => content ?? ''),
  );
</script>

<template>
  <div v-bind="rootAttrs()">
    <DataItems />
    <slot />
  </div>
</template>

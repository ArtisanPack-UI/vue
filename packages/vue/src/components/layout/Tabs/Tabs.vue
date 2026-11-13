<script setup lang="ts">
/**
 * @module Tabs
 *
 * Switches between views of the same content. Renders the design-system
 * Tabs markup contract (`.apui-tabs`, #56) on the shared Zag tabs machine
 * (`useTabs`): a tablist with a roving tabindex, arrow keys that follow the
 * orientation and the text direction, and automatic or manual activation.
 *
 * Compose it from `Tab` children, each a trigger and its panel, or pass the
 * same tabs as `tabs`. Bind the selected tab with `v-model`.
 */
import { computed, getCurrentInstance, mergeProps, provide, ref, useAttrs, useSlots } from 'vue';
import { useTabs } from '@artisanpack-ui/behavior/vue';
import { DsIcon, part } from '../../_shared/design-system';
import { TABS_KEY } from './keys';
import { collectTabs, type CollectedTab } from './TabsEntries';
import type { TabsPart, TabsProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsProps>(), {
  modelValue: undefined,
  tabs: undefined,
  variant: 'segmented',
  size: 'md',
  orientation: 'horizontal',
  activationMode: 'automatic',
  label: undefined,
  classes: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

/** Whether the parent passes `modelValue`; then the tabs show only what it says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'modelValue' in raw;
}

const localValue = ref<string | undefined>(props.modelValue);

/**
 * The first enabled `Tab` child, found while rendering: slots can only be
 * read in render. Data tabs are known up front, so they never need it.
 */
const firstChild = ref<string | null>(null);

/** The tabs this render, from `entries()`. Not reactive: the render reads it right after. */
let rendered: CollectedTab[] = [];

/**
 * The tabs, from data then children, collected once per render before
 * anything reads the machine: the root's attributes call it first, so the
 * first enabled child is known (and selected) in the same render, on the
 * server too, rather than one render later.
 */
function entries(): CollectedTab[] {
  rendered = collectTabs(props.tabs, slots.default?.() ?? []);
  const first = rendered.find((tab) => !tab.disabled)?.value ?? null;
  if (firstChild.value !== first) firstChild.value = first;
  return rendered;
}

/** The shown value: the bound or local one, else the first enabled tab. */
function shownValue(): string | null {
  const own = isBound() ? props.modelValue : localValue.value;
  if (own !== undefined && own !== null && own !== '') return own;
  return props.tabs?.find((tab) => !tab.disabled)?.value ?? firstChild.value;
}

const machine = useTabs(() => ({
  value: shownValue(),
  orientation: props.orientation,
  activationMode: props.activationMode,
  label: props.label,
  onValueChange: ({ value }) => {
    if (!isBound()) localValue.value = value;
    emit('update:modelValue', value);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` for the template type-check. */
const api = computed(() => machine.value);

function classOf(name: TabsPart): string | undefined {
  return props.classes?.[name];
}

provide(TABS_KEY, { api: () => api.value, classOf });

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}

function rootAttrs(): Record<string, unknown> {
  entries();
  return mergeProps(attrs, api.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-tabs', props.classes?.root],
    'data-variant': props.variant,
    'data-size': props.size,
    'data-activation-mode': props.activationMode,
  });
}

function hasCount(tab: CollectedTab): boolean {
  return tab.count !== undefined && tab.count !== null && tab.count !== '';
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <div v-bind="withClass(api.getListProps(), classOf('list'))">
      <button
        v-for="tab in rendered"
        :key="tab.value"
        v-bind="
          withClass(
            api.getTriggerProps({ value: tab.value, disabled: tab.disabled }),
            classOf('trigger'),
          )
        "
      >
        <span
          v-if="tab.icon"
          v-bind="part('tabs', 'icon', classOf('icon'), { 'aria-hidden': 'true' })"
          ><DsIcon :name="tab.icon"
        /></span>
        {{ tab.label ?? tab.value }}
        <span v-if="hasCount(tab)" v-bind="part('tabs', 'count', classOf('count'))">{{
          tab.count
        }}</span>
      </button>
    </div>
    <component :is="tab.node" v-for="tab in rendered" :key="`panel-${tab.value}`" />
  </div>
</template>

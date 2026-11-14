<script setup lang="ts">
/**
 * @module EmptyState
 *
 * Explains why there's nothing here and what to do next, rendering the
 * design-system EmptyState markup contract (`.apui-empty-state`, #60): an
 * icon tile tinted by the variant, a heading, a description and actions.
 */
import { mergeProps, useAttrs, useSlots } from 'vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import type { EmptyStatePart, EmptyStateProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyStateProps>(), {
  variant: 'first-use',
  size: 'md',
  align: 'center',
  icon: undefined,
  title: undefined,
  description: undefined,
  actions: undefined,
  headingLevel: 3,
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();

const DEFAULT_ICONS: Record<string, string> = {
  'first-use': 'inbox',
  'no-results': 'search-x',
  cleared: 'circle-check',
};

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function slotted(name: string): boolean {
  const slot = slots[name];
  return !!slot && hasContent(slot());
}

function heading(): string {
  const level = Math.min(6, Math.max(2, Math.round(Number(props.headingLevel) || 3)));
  return `h${level}`;
}

function cls(name: EmptyStatePart): string | undefined {
  return props.classes?.[name];
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(
    {
      class: 'apui-empty-state',
      'data-scope': 'empty-state',
      'data-part': 'root',
      'data-variant': props.variant,
      'data-size': props.size,
      'data-align': props.align,
    },
    attrs,
    { class: props.classes?.root },
  );
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-bind="part('empty-state', 'icon', cls('icon'), { 'aria-hidden': 'true' })">
      <slot name="icon"><DsIcon :name="filled(icon) ? icon : DEFAULT_ICONS[variant]" /></slot>
    </span>
    <component
      :is="heading()"
      v-if="slotted('title') || filled(title)"
      v-bind="part('empty-state', 'title', cls('title'))"
    >
      <slot name="title">{{ title }}</slot>
    </component>
    <div
      v-if="slotted('description') || slotted('default') || filled(description)"
      v-bind="part('empty-state', 'description', cls('description'))"
    >
      <slot name="description"
        ><slot>{{ description }}</slot></slot
      >
    </div>
    <div
      v-if="slotted('actions') || filled(actions)"
      v-bind="part('empty-state', 'actions', cls('actions'))"
    >
      <slot name="actions">{{ actions }}</slot>
    </div>
  </div>
</template>

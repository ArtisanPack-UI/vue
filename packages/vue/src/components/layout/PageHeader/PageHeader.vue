<script setup lang="ts">
/**
 * @module PageHeader
 *
 * The title block at the top of a page (#58). Renders the design-system
 * PageHeader markup contract (`.apui-page-header`): breadcrumbs, then the
 * row with the meta, title (the page's h1 by default) and description
 * beside the actions, then tabs. Each region is a prop or a slot.
 */
import { mergeProps, useAttrs, useSlots } from 'vue';
import { hasContent, part } from '../../_shared/design-system';
import type { PageHeaderPart, PageHeaderProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: undefined,
  description: undefined,
  level: 1,
  breadcrumbs: undefined,
  meta: undefined,
  actions: undefined,
  tabs: undefined,
  classes: undefined,
});

type Region = 'title' | 'description' | 'breadcrumbs' | 'meta' | 'actions' | 'tabs';

const attrs = useAttrs();
const slots = useSlots();

function classOf(name: PageHeaderPart): string | undefined {
  return props.classes?.[name];
}

function has(name: Region): boolean {
  const slot = slots[name];
  if (slot) return hasContent(slot());
  return props[name] !== undefined && props[name] !== '';
}

const headingTag = () => `h${Math.min(6, Math.max(1, Math.round(Number(props.level) || 1)))}`;

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, { class: ['apui-page-header', props.classes?.root] });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <div
      v-if="has('breadcrumbs')"
      v-bind="part('page-header', 'breadcrumbs', classOf('breadcrumbs'))"
    >
      <slot name="breadcrumbs">{{ breadcrumbs }}</slot>
    </div>
    <div v-bind="part('page-header', 'row', classOf('row'))">
      <div>
        <div v-if="has('meta')" v-bind="part('page-header', 'meta', classOf('meta'))">
          <slot name="meta">{{ meta }}</slot>
        </div>
        <component
          :is="headingTag()"
          v-if="has('title')"
          v-bind="part('page-header', 'title', classOf('title'))"
        >
          <slot name="title">{{ title }}</slot>
        </component>
        <p
          v-if="has('description')"
          v-bind="part('page-header', 'description', classOf('description'))"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div v-if="has('actions')" v-bind="part('page-header', 'actions', classOf('actions'))">
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>
    <div v-if="has('tabs')" v-bind="part('page-header', 'tabs', classOf('tabs'))">
      <slot name="tabs">{{ tabs }}</slot>
    </div>
  </div>
</template>

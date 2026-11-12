<script setup lang="ts">
/**
 * @module Navbar
 *
 * The top bar (#56): a brand, primary links or a search, and actions at the
 * end, as a full-width bar or an island. Renders the design-system Navbar
 * markup contract (`.apui-navbar`). Glass is a surface (D-006).
 *
 * The default slot holds NavbarItem links, inside a nav landmark named by
 * `label`; `links` renders the same links from data. `brand`, `search` and
 * `actions` are props or slots. Attributes go to the header.
 */
import { mergeProps, provide, useAttrs, useSlots } from 'vue';
import { flag, hasContent, part } from '../../_shared/design-system';
import { NAVBAR_KEY } from './keys';
import NavbarItem from './NavbarItem.vue';
import type { NavbarPart, NavbarProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NavbarProps>(), {
  layout: 'bar',
  surface: 'default',
  sticky: true,
  brand: undefined,
  links: undefined,
  search: undefined,
  actions: undefined,
  label: 'Main',
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();

function classOf(name: NavbarPart): string | undefined {
  return props.classes?.[name];
}

provide(NAVBAR_KEY, { classOf });

/** Whether a region renders: its slot has content, or its prop is set. */
function has(name: 'brand' | 'search' | 'actions'): boolean {
  const slot = slots[name];
  if (slot) return hasContent(slot());
  return props[name] !== undefined && props[name] !== '';
}

function hasLinks(): boolean {
  return (props.links?.length ?? 0) > 0 || (slots.default ? hasContent(slots.default()) : false);
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, {
    class: ['apui-navbar', props.classes?.root],
    'data-layout': props.layout,
    'data-surface': props.surface,
    'data-sticky': flag(props.sticky),
  });
}
</script>

<template>
  <header v-bind="rootAttrs()">
    <div v-if="has('brand')" v-bind="part('navbar', 'brand', classOf('brand'))">
      <slot name="brand">{{ brand }}</slot>
    </div>
    <nav v-if="hasLinks()" v-bind="part('navbar', 'links', classOf('links'))" :aria-label="label">
      <NavbarItem
        v-for="(link, index) in links ?? []"
        :key="`link-${index}`"
        :href="link.href"
        :current="link.current"
        >{{ link.label }}</NavbarItem
      >
      <slot />
    </nav>
    <div v-if="has('search')" v-bind="part('navbar', 'search', classOf('search'))">
      <slot name="search">{{ search }}</slot>
    </div>
    <div v-if="has('actions')" v-bind="part('navbar', 'actions', classOf('actions'))">
      <slot name="actions">{{ actions }}</slot>
    </div>
  </header>
</template>

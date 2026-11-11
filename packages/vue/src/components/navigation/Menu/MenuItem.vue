<script setup lang="ts">
/**
 * @module MenuItem
 *
 * A link in a Menu: an `<a>` with `href`, `aria-current="page"` when it's
 * the current page, or a button without one. Disabled drops the href and
 * leaves the Tab order. The default slot is the label; attributes and
 * listeners go to the link.
 */
import { computed, inject, mergeProps, useAttrs } from 'vue';
import { DsIcon, part, safeHref } from '../../_shared/design-system';
import { MENU_KEY, MENU_LINK_KEY } from './keys';
import type { MenuItemProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuItemProps>(), {
  href: undefined,
  icon: undefined,
  badge: undefined,
  current: false,
  disabled: false,
});

const attrs = useAttrs();
const menu = inject(MENU_KEY);
if (!menu) throw new Error('[@artisanpack-ui/vue] MenuItem must be inside a Menu.');
const linkComponent = inject(MENU_LINK_KEY, null);

const href = computed(() => (props.disabled ? undefined : safeHref(props.href)));
const tag = computed(() => {
  if (href.value !== undefined && linkComponent) return linkComponent;
  return href.value !== undefined || props.disabled ? 'a' : 'button';
});

function itemAttrs(): Record<string, unknown> {
  return mergeProps(attrs, part('menu', 'item', menu!.classOf('item')), {
    href: href.value,
    type: tag.value === 'button' ? 'button' : undefined,
    'aria-current': props.current ? 'page' : undefined,
    'aria-disabled': props.disabled ? 'true' : undefined,
    tabindex: props.disabled ? -1 : undefined,
  });
}

function hasBadge(): boolean {
  return props.badge !== undefined && props.badge !== null && props.badge !== '';
}
</script>

<template>
  <li>
    <component :is="tag" v-bind="itemAttrs()">
      <span
        v-if="$slots.icon || icon"
        v-bind="part('menu', 'icon', menu!.classOf('icon'), { 'aria-hidden': 'true' })"
        ><slot name="icon"><DsIcon :name="icon" /></slot
      ></span>
      <span v-bind="part('menu', 'item-text', menu!.classOf('itemText'))"><slot /></span>
      <span v-if="hasBadge()" v-bind="part('menu', 'badge', menu!.classOf('badge'))">{{
        badge
      }}</span>
    </component>
  </li>
</template>

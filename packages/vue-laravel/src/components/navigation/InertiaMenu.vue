<script setup lang="ts">
/**
 * @module InertiaMenu
 *
 * A Menu whose links navigate with Inertia's `Link`. Items keep the 2.x shape
 * (`name`, `label`, `href`, `active`, `disabled`, `children`): an item with
 * `children` becomes a sub-menu, one without `href` a button. Composed
 * `MenuItem` children in the default slot use Inertia's `Link` too.
 */
import { Link } from '@inertiajs/vue3';
import { Menu, MENU_LINK_KEY, type MenuItemData } from '@artisanpack-ui/vue';
import { computed, provide } from 'vue';

/** A menu item with Inertia `href` support. */
export interface InertiaMenuItem {
  /** Identifies the item in the `select` event. */
  name: string;
  /** The item's text. */
  label: string;
  /** Inertia route URL for this menu item. */
  href?: string;
  /** Marks the current page. @defaultValue `false` */
  active?: boolean;
  /** Disables the item, or a sub-menu's toggle. @defaultValue `false` */
  disabled?: boolean;
  /** A count or status at the end of the item or sub-menu toggle. */
  badge?: string | number;
  /** Nested items; the item becomes a sub-menu. */
  children?: InertiaMenuItem[];
}

const props = withDefaults(
  defineProps<{
    /** The menu items. */
    items?: InertiaMenuItem[];
    /** Names the nav landmark. */
    label?: string;
    /** Sub-menus open and close from their item. @defaultValue `true` */
    collapsible?: boolean;
  }>(),
  { items: () => [], label: undefined, collapsible: true },
);

const emit = defineEmits<{
  /** An item was activated, with its `name`. */
  select: [name: string];
}>();

provide(MENU_LINK_KEY, Link);

function holdsActive(item: InertiaMenuItem): boolean {
  return Boolean(item.active) || (item.children?.some(holdsActive) ?? false);
}

function toEntries(items: InertiaMenuItem[]): MenuItemData[] {
  return items.map((item): MenuItemData => {
    if (item.children) {
      return {
        type: 'sub',
        key: item.name,
        label: item.label,
        badge: item.badge,
        disabled: Boolean(item.disabled),
        // The initial state only: the sub-menu keeps toggling, and opens itself
        // when an item inside becomes active (persistent layouts).
        open: holdsActive(item) || undefined,
        items: toEntries(item.children),
      };
    }
    return {
      key: item.name,
      label: item.label,
      href: item.href,
      badge: item.badge,
      current: Boolean(item.active),
      disabled: Boolean(item.disabled),
      // Reports the item; Inertia's Link (or the button) does the navigating.
      ...({ 'data-name': item.name } as object),
    };
  });
}

const entries = computed(() => toEntries(props.items));

function onClick(event: MouseEvent): void {
  const item = (event.target as Element | null)?.closest<HTMLElement>(
    '[data-scope="menu"][data-part="item"][data-name]',
  );
  if (item && item.getAttribute('aria-disabled') !== 'true') emit('select', item.dataset.name!);
}
</script>

<template>
  <Menu :items="entries" :label="label" :collapsible="collapsible" @click="onClick">
    <slot />
  </Menu>
</template>

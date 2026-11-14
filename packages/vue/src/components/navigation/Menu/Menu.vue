<script setup lang="ts">
/**
 * @module Menu
 *
 * A navigation list in a nav landmark (#56): links with icons and badges,
 * section titles, separators and collapsible sub-menus, with the current
 * page marked `aria-current="page"`. Sub-menus follow the disclosure
 * pattern, so it's not an ARIA menu; for actions use DropdownMenu.
 *
 * Compose it from MenuItem, MenuSub, MenuTitle and MenuSeparator, or pass
 * the same structure as `items`. Attributes go to the nav.
 */
import { mergeProps, provide, useAttrs } from 'vue';
import { flag, part } from '../../_shared/design-system';
import MenuEntries from './MenuEntries';
import { MENU_KEY } from './keys';
import type { MenuPart, MenuProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuProps>(), {
  items: undefined,
  collapsible: true,
  label: undefined,
  classes: undefined,
});

const attrs = useAttrs();

function classOf(name: MenuPart): string | undefined {
  return props.classes?.[name];
}

provide(MENU_KEY, { collapsible: () => props.collapsible, classOf });

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, {
    class: ['apui-menu', props.classes?.root],
    'aria-label': props.label,
    'data-collapsible': flag(props.collapsible),
  });
}
</script>

<template>
  <nav v-bind="rootAttrs()">
    <ul v-bind="part('menu', 'list', classOf('list'))">
      <MenuEntries v-if="items" :entries="items" />
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * @module NavbarItem
 *
 * A primary link in a Navbar, `aria-current="page"` on the current page.
 * The default slot is its text; attributes go to the link.
 */
import { inject, mergeProps, useAttrs } from 'vue';
import { part, safeHref } from '../../_shared/design-system';
import { NAVBAR_KEY } from './keys';
import type { NavbarItemProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NavbarItemProps>(), {
  href: undefined,
  current: false,
});

const attrs = useAttrs();
const navbar = inject(NAVBAR_KEY, null);

function linkAttrs(): Record<string, unknown> {
  return mergeProps(attrs, part('navbar', 'link', navbar?.classOf('link')), {
    href: safeHref(props.href),
    'aria-current': props.current ? 'page' : undefined,
  });
}
</script>

<template>
  <a v-bind="linkAttrs()"><slot /></a>
</template>

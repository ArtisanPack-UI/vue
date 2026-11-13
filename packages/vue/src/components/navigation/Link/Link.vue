<script setup lang="ts">
/**
 * @module Link
 *
 * Navigates somewhere: an anchor, or a button styled as a link when there's
 * no href. Renders the design-system Link markup contract (`.apui-link`, #56).
 */
import { computed } from 'vue';
import { DsIcon, flag, MIRRORED_ICONS, part, safeHref } from '../../_shared/design-system';
import type { LinkProps } from './types';

const props = withDefaults(defineProps<LinkProps>(), {
  href: undefined,
  tone: 'primary',
  standalone: false,
  external: false,
  externalLabel: '(opens in a new tab)',
  leadingIcon: undefined,
  trailingIcon: undefined,
  classes: undefined,
});

const linkHref = computed(() => safeHref(props.href));
const endIcon = computed(
  () => props.trailingIcon ?? (props.external ? 'external-link' : undefined),
);
const mirror = (name: string | undefined) => flag(name !== undefined && MIRRORED_ICONS.has(name));
</script>

<template>
  <component
    :is="linkHref !== undefined ? 'a' : 'button'"
    :href="linkHref"
    :type="linkHref === undefined ? 'button' : undefined"
    :target="linkHref !== undefined && external ? '_blank' : undefined"
    :rel="linkHref !== undefined && external ? 'noopener noreferrer' : undefined"
    :class="['apui-link', classes?.root]"
    :data-tone="tone === 'muted' ? 'muted' : 'primary'"
    :data-standalone="flag(standalone)"
  >
    <span
      v-if="$slots.icon || leadingIcon"
      v-bind="
        part('link', 'icon', classes?.icon, {
          'aria-hidden': 'true',
          'data-mirror': $slots.icon ? undefined : mirror(leadingIcon),
        })
      "
      ><slot name="icon"><DsIcon :name="leadingIcon" /></slot></span
    ><slot /><span
      v-if="$slots.iconEnd || endIcon"
      v-bind="
        part('link', 'iconEnd', classes?.iconEnd, {
          'aria-hidden': 'true',
          'data-mirror': $slots.iconEnd ? undefined : mirror(endIcon),
        })
      "
      ><slot name="iconEnd"><DsIcon :name="endIcon" /></slot></span
    ><span v-if="external" class="apui-sr-only"> {{ externalLabel }}</span>
  </component>
</template>

<script setup lang="ts">
/**
 * @module Badge
 *
 * A small, non-interactive label for a status, category or count. Renders
 * the design-system Badge markup contract (`.apui-badge`, #61).
 */
import { DsIcon, flag, MIRRORED_ICONS, part } from '../../_shared/design-system';
import type { BadgeProps } from './types';

withDefaults(defineProps<BadgeProps>(), {
  variant: 'soft',
  color: 'neutral',
  size: 'md',
  dot: false,
  leadingIcon: undefined,
  classes: undefined,
});
</script>

<template>
  <span
    :class="['apui-badge', classes?.root]"
    :data-variant="variant"
    :data-color="color"
    :data-size="size"
    ><span v-if="dot" v-bind="part('badge', 'dot', classes?.dot, { 'aria-hidden': 'true' })" /><span
      v-if="$slots.icon || leadingIcon"
      v-bind="
        part('badge', 'icon', classes?.icon, {
          'aria-hidden': 'true',
          'data-mirror': $slots.icon
            ? undefined
            : flag(leadingIcon !== undefined && MIRRORED_ICONS.has(leadingIcon)),
        })
      "
      ><slot name="icon"><DsIcon :name="leadingIcon" /></slot></span
    ><span v-bind="part('badge', 'label', classes?.label)"><slot /></span
  ></span>
</template>

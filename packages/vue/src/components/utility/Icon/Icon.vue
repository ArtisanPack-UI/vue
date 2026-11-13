<script setup lang="ts">
/**
 * @module Icon
 *
 * One glyph from the icon registry (`@artisanpack-ui/behavior/icons`, D-017)
 * at four sizes, plain or on a soft-colored tile, rendering the
 * design-system Icon markup contract (`.apui-icon`, #65). Decorative unless
 * it has a `label`; directional icons mirror under RTL. The default slot
 * draws your own `<svg>` instead of the name.
 */
import { isDirectionalIcon } from '@artisanpack-ui/behavior/icons';
import { mergeProps, useAttrs, useSlots } from 'vue';
import { DsIcon, flag, hasContent } from '../../_shared/design-system';
import type { IconProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<IconProps>(), {
  name: undefined,
  variant: 'plain',
  size: 'md',
  color: undefined,
  label: undefined,
  mirror: undefined,
  classes: undefined,
});

const slots = useSlots();
const attrs = useAttrs();

function hasSlot(): boolean {
  return hasContent(slots.default?.());
}

function labeled(): boolean {
  return typeof props.label === 'string' && props.label !== '';
}

/** Named by `label`, or by the caller's own aria-label or aria-labelledby: only an unnamed icon is hidden. */
function named(): boolean {
  return labeled() || hasContent(attrs['aria-label']) || hasContent(attrs['aria-labelledby']);
}

function rootAttrs(): Record<string, unknown> {
  const mirrored = props.mirror ?? (!hasSlot() && isDirectionalIcon(props.name));
  // The caller's attributes land on the root; the component's own (label first) win.
  return mergeProps(attrs, {
    class: [
      'apui-icon',
      props.variant === 'tile' ? 'apui-icon-tile' : undefined,
      props.classes?.root,
    ],
    'data-scope': 'icon',
    'data-part': 'root',
    'data-variant': props.variant,
    'data-size': props.size,
    'data-color': props.color,
    'data-mirror': flag(mirrored),
    role: named() ? (attrs.role ?? 'img') : undefined,
    'aria-label': labeled() ? props.label : attrs['aria-label'],
    'aria-hidden': named() ? attrs['aria-hidden'] : 'true',
  });
}
</script>

<template>
  <span v-bind="rootAttrs()">
    <slot v-if="hasSlot()" />
    <DsIcon v-else-if="name" :name="name" data-scope="icon" data-part="svg" :class="classes?.svg" />
  </span>
</template>

<script setup lang="ts">
/**
 * @module Button
 *
 * Triggers an action. Renders the design-system Button markup contract
 * (`.apui-button`, #44).
 */
import { useAttrs } from 'vue';
import {
  DsIcon,
  flag,
  hasContent,
  MIRRORED_ICONS,
  part,
  safeHref,
} from '../../_shared/design-system';
import type { ButtonProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  iconOnly: false,
  loading: false,
  disabled: false,
  href: undefined,
  leadingIcon: undefined,
  trailingIcon: undefined,
  type: 'button',
  classes: undefined,
});

const attrs = useAttrs();

/** The href to render, without unsafe schemes. */
function linkHref(): string | undefined {
  return safeHref(props.href);
}

/** Swallows a click: loading buttons and disabled or loading links don't act. */
function blockClick(event: Event): void {
  event.preventDefault();
}

function rootAttrs(): Record<string, unknown> {
  const { class: className, onClick, ...rest } = attrs;
  const href = linkHref();
  const isAnchor = href !== undefined;
  const blocked = props.loading || (isAnchor && props.disabled);
  const attributes: Record<string, unknown> = {
    ...rest,
    class: ['apui-button', className, props.classes?.root],
    'data-variant': props.variant,
    'data-color': props.color,
    'data-size': props.size,
    'data-icon-only': flag(props.iconOnly),
    'aria-busy': props.loading ? 'true' : undefined,
    'data-disabled': flag(props.disabled),
    onClick: blocked ? blockClick : onClick,
  };
  if (isAnchor) {
    // Disabled and loading links render without href, so they can't be followed.
    if (props.disabled || props.loading) attributes['aria-disabled'] = 'true';
    else attributes.href = href;
  } else {
    attributes.type = props.type;
    attributes.disabled = props.disabled || undefined;
  }
  return attributes;
}

function iconAttrs(name: 'icon' | 'iconEnd', icon: string | undefined, slotted: boolean) {
  return part('button', name, props.classes?.[name], {
    'aria-hidden': 'true',
    'data-mirror': flag(!slotted && icon && MIRRORED_ICONS.has(icon)),
  });
}
</script>

<template>
  <component :is="linkHref() !== undefined ? 'a' : 'button'" v-bind="rootAttrs()">
    <span v-if="$slots.icon || leadingIcon" v-bind="iconAttrs('icon', leadingIcon, !!$slots.icon)">
      <slot name="icon"><DsIcon :name="leadingIcon" /></slot>
    </span>
    <span
      v-if="!iconOnly && hasContent($slots.default?.())"
      v-bind="part('button', 'label', classes?.label)"
      ><slot
    /></span>
    <span
      v-if="$slots.iconEnd || trailingIcon"
      v-bind="iconAttrs('iconEnd', trailingIcon, !!$slots.iconEnd)"
    >
      <slot name="iconEnd"><DsIcon :name="trailingIcon" /></slot>
    </span>
    <span
      v-if="loading"
      v-bind="part('button', 'spinner', classes?.spinner, { 'aria-hidden': 'true' })"
    />
  </component>
</template>

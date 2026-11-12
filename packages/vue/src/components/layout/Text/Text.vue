<script setup lang="ts">
/**
 * @module Text
 *
 * Body text with a size, tone and weight, truncated to a line or clamped to
 * a number of lines. Renders the design-system Text markup contract
 * (`.apui-text`, #58).
 */
import { computed, Text as TextNode, useAttrs, useSlots, type VNode } from 'vue';
import { flag } from '../../_shared/design-system';
import type { TextProps } from './types';

const props = withDefaults(defineProps<TextProps>(), {
  as: 'p',
  size: 'md',
  tone: 'default',
  weight: 'regular',
  truncate: false,
  clamp: undefined,
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();

const tag = computed(() => (['p', 'span', 'div'].includes(props.as) ? props.as : 'p'));
const lines = computed(() =>
  props.clamp !== undefined && props.clamp >= 1 ? Math.floor(props.clamp) : undefined,
);

/** The default slot's text when it's only text, for the title of cut text. */
function plainText(): string {
  const nodes = (slots.default?.() ?? []) as VNode[];
  if (!nodes.every((node) => node.type === TextNode)) return '';
  return nodes
    .map((node) => String(node.children ?? ''))
    .join('')
    .trim();
}

function title(): string | undefined {
  if (attrs.title !== undefined) return undefined;
  if (!props.truncate && lines.value === undefined) return undefined;
  return plainText() || undefined;
}
</script>

<template>
  <component
    :is="tag"
    :class="['apui-text', classes?.root]"
    :style="lines !== undefined ? { '--apui-text-clamp': lines } : undefined"
    :title="title()"
    :data-size="size"
    :data-tone="tone"
    :data-weight="weight"
    :data-truncate="flag(truncate)"
    :data-clamp="lines"
    ><slot
  /></component>
</template>

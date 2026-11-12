<script setup lang="ts">
/**
 * @module Divider
 *
 * Separates content with a muted rule (#58). Renders the design-system
 * Divider markup contract (`.apui-divider`): an `hr` for a plain horizontal
 * rule, or a `div` with role separator for a vertical or labelled one, named
 * by its label. `decorative` hides it from assistive technology.
 */
import { mergeProps, useAttrs, useId, useSlots } from 'vue';
import { flag, hasContent, part } from '../../_shared/design-system';
import type { DividerProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  label: undefined,
  align: 'center',
  strength: 'subtle',
  decorative: false,
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();
const labelId = `apui-divider-${useId()}-label`;

/** Whether the `label` prop is given; it wins over the default slot (as React). */
function labelGiven(): boolean {
  return props.label !== undefined && props.label !== '';
}

/** Whether there's a label: the `label` prop, else a non-empty default slot. */
function hasLabel(): boolean {
  return labelGiven() || (!!slots.default && hasContent(slots.default()));
}

function rootAttrs(): Record<string, unknown> {
  const labelled = hasLabel();
  const plain = !labelled && props.orientation === 'horizontal';
  const semantics: Record<string, unknown> = plain
    ? { 'aria-hidden': props.decorative ? 'true' : undefined }
    : labelled && props.decorative
      ? { role: 'none' }
      : {
          role: 'separator',
          'aria-orientation': props.orientation,
          'aria-labelledby': labelled ? labelId : undefined,
          'aria-hidden': props.decorative ? 'true' : undefined,
        };
  return mergeProps(attrs, {
    class: ['apui-divider', props.classes?.root],
    ...semantics,
    'data-orientation': props.orientation,
    'data-strength': props.strength,
    'data-align': props.align,
    'data-decorative': flag(props.decorative),
  });
}
</script>

<template>
  <div v-if="hasLabel()" v-bind="rootAttrs()">
    <span v-bind="part('divider', 'label', classes?.label, { id: labelId })"
      ><template v-if="labelGiven()">{{ label }}</template
      ><slot v-else
    /></span>
  </div>
  <hr v-else-if="orientation === 'horizontal'" v-bind="rootAttrs()" />
  <div v-else v-bind="rootAttrs()" />
</template>

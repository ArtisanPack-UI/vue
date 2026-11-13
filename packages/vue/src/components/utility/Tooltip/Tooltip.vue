<script setup lang="ts">
/**
 * @module Tooltip
 *
 * A short label on hover and keyboard focus. Renders the design-system
 * Tooltip markup contract (`.apui-tooltip`, #59) on the shared Zag tooltip
 * machine (`useTooltip`): the default slot's element is the trigger, linked
 * with `aria-describedby` while the label shows; hoverable, and Escape hides
 * it.
 */
import { computed, getCurrentInstance, h, mergeProps, useAttrs, useSlots } from 'vue';
import { tooltipKeys, useTooltip } from '@artisanpack-ui/behavior/vue';
import { definedProps, flag } from '../../_shared/design-system';
import { cloneTrigger, triggerElement } from '../../_shared/trigger';
import type { TooltipProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipProps>(), {
  content: undefined,
  placement: 'top',
  delay: 400,
  size: 'md',
  shortcut: undefined,
  open: undefined,
  disabled: false,
  portal: true,
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const slots = useSlots();

/** Whether the parent passes `open`: then the label shows only what the prop says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw && raw.open !== undefined;
}

const machine = useTooltip(() => ({
  ...(isBound() ? { open: props.open } : {}),
  placement: props.placement,
  delay: props.delay,
  disabled: props.disabled,
  onOpenChange: ({ open }) => emit('update:open', open),
}));

/** The machine's API, re-wrapped in this package's `computed` (see Dialog). */
const tooltip = computed(() => machine.value);

function classOf(name: keyof NonNullable<TooltipProps['classes']>): string | undefined {
  return props.classes?.[name];
}

/** The default slot as the trigger: its element, or the text in a focusable span. */
function trigger() {
  const triggerProps = mergeProps(tooltip.value.getTriggerProps() as Record<string, unknown>, {
    class: classOf('trigger'),
  });
  const nodes = slots.default?.();
  const element = triggerElement(nodes);
  return element
    ? cloneTrigger(element, triggerProps)
    : h('span', { tabindex: 0, ...triggerProps }, nodes);
}

/** The label: Zag's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, definedProps(tooltip.value.getContentProps()), {
    class: ['apui-tooltip', props.classes?.root, props.classes?.content],
    'data-size': props.size,
    'data-disabled': flag(props.disabled),
  });
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <component :is="trigger()" />
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(tooltip.getPositionerProps(), classOf('positioner'))">
      <div v-bind="contentAttrs()">
        <span
          v-bind="withClass(tooltip.getArrowProps(), classOf('arrow'))"
          aria-hidden="true"
        /><slot name="content">{{ content }}</slot
        ><kbd
          v-for="(key, index) in tooltipKeys(shortcut)"
          :key="index"
          :class="classOf('kbd')"
          data-scope="tooltip"
          data-part="kbd"
          >{{ key }}</kbd
        >
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * @module Popover
 *
 * An anchored, non-modal panel for a short task tied to one control. Renders
 * the design-system Popover markup contract (`.apui-popover`, #58) on the
 * shared Zag popover machine (`usePopover`): a labelled `role=dialog`, focus
 * moved in and returned to the trigger, Escape and outside-click dismissal.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useSlots } from 'vue';
import { usePopover } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { definedProps, hasContent, part } from '../../_shared/design-system';
import { cloneTrigger, triggerElement } from '../../_shared/trigger';
import type { PopoverProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverProps>(), {
  open: false,
  placement: 'bottom',
  arrow: true,
  title: undefined,
  actions: undefined,
  trigger: undefined,
  portal: true,
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const slots = useSlots();

/** Whether the parent passes `open`: then the popover shows only what the prop says (see Dialog). */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

const localOpen = ref(props.open);

function shownOpen(): boolean {
  return isBound() ? props.open : localOpen.value;
}

const machine = usePopover(() => ({
  open: shownOpen(),
  placement: props.placement,
  portalled: props.portal,
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` (see Dialog). */
const popover = computed(() => machine.value);

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function classOf(name: keyof NonNullable<PopoverProps['classes']>): string | undefined {
  return props.classes?.[name];
}

/** The trigger part's props, with its extra class. */
function triggerProps(): Record<string, unknown> {
  return mergeProps(popover.value.getTriggerProps() as Record<string, unknown>, {
    class: classOf('trigger'),
  });
}

/** The `trigger` slot's element as the trigger itself, or undefined for text. */
function ownTrigger() {
  const element = triggerElement(slots.trigger?.());
  return element ? cloneTrigger(element, triggerProps()) : undefined;
}

function hasTrigger(): boolean {
  return !!slots.trigger || filled(props.trigger);
}

/** The panel: Zag's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, definedProps(popover.value.getContentProps()), {
    class: ['apui-popover', props.classes?.root, props.classes?.content],
  });
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <component :is="ownTrigger()" v-if="ownTrigger()" />
  <Button v-else-if="hasTrigger()" variant="outline" color="neutral" v-bind="triggerProps()">
    <slot name="trigger">{{ trigger }}</slot>
  </Button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(popover.getPositionerProps(), classOf('positioner'))">
      <div v-bind="contentAttrs()">
        <span
          v-if="arrow"
          v-bind="withClass(popover.getArrowProps(), classOf('arrow'))"
          aria-hidden="true"
        />
        <h3
          v-if="!!$slots.title || filled(title)"
          v-bind="withClass(popover.getTitleProps(), classOf('title'))"
        >
          <slot name="title">{{ title }}</slot>
        </h3>
        <div
          v-if="hasContent($slots.default?.())"
          v-bind="part('popover', 'body', classOf('body'))"
        >
          <slot />
        </div>
        <div
          v-if="!!$slots.actions || filled(actions)"
          v-bind="part('popover', 'actions', classOf('actions'))"
        >
          <slot name="actions">{{ actions }}</slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

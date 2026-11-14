<script setup lang="ts">
/**
 * @module Collapse
 *
 * A single disclosure (#58). Renders the design-system Collapse markup
 * contract (`.apui-collapse`) on the shared Zag collapsible machine
 * (`useCollapse`): a trigger button with aria-expanded and aria-controls,
 * and a region that is hidden while closed, or, with `variant="read-more"`,
 * clamped behind a fade with the trigger after it. Bind the state with
 * `v-model:open`.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useSlots } from 'vue';
import { useCollapse } from '@artisanpack-ui/behavior/vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import type { CollapsePart, CollapseProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapseProps>(), {
  open: false,
  variant: 'section',
  label: undefined,
  openLabel: undefined,
  disabled: false,
  classes: undefined,
});

const emit = defineEmits<{ 'update:open': [open: boolean] }>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

/** Whether the parent passes `open`; then the region follows it. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

const localOpen = ref(props.open);

const machine = useCollapse(() => ({
  open: isBound() ? props.open : localOpen.value,
  variant: props.variant,
  disabled: props.disabled || undefined,
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
}));

const api = computed(() => machine.value);
const readMore = computed(() => props.variant === 'read-more');

function classOf(name: CollapsePart): string | undefined {
  return props.classes?.[name];
}

function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(attrs, api.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-collapse', props.classes?.root],
    'data-variant': props.variant,
  });
}

function triggerAttrs(): Record<string, unknown> {
  return mergeProps(
    withClass(api.value.getTriggerProps(), classOf('trigger')),
    props.disabled ? { disabled: true } : {},
  );
}

/** The trigger's text: `openLabel` while open, else `label`, with read-more's defaults. */
const triggerText = computed(() => {
  const label = props.label ?? (readMore.value ? 'Read more' : undefined);
  const openLabel = props.openLabel ?? (readMore.value ? 'Show less' : undefined);
  return api.value.open && openLabel ? openLabel : label;
});

const hasTriggerSlot = () => !!slots.trigger && hasContent(slots.trigger());
</script>

<template>
  <div v-bind="rootAttrs()">
    <template v-if="!readMore">
      <button v-bind="triggerAttrs()">
        <slot v-if="hasTriggerSlot()" name="trigger" />
        <template v-else>{{ triggerText }}</template
        ><span
          v-bind="
            mergeProps(withClass(api.getIndicatorProps(), classOf('icon')), {
              'aria-hidden': 'true',
            })
          "
          ><DsIcon name="chevron-down"
        /></span>
      </button>
      <div v-bind="withClass(api.getContentProps(), classOf('content'))"><slot /></div>
    </template>
    <template v-else>
      <div v-bind="withClass(api.getContentProps(), classOf('content'))">
        <slot /><span
          v-bind="part('collapse', 'fade', classOf('fade'), { 'aria-hidden': 'true' })"
        />
      </div>
      <button v-bind="triggerAttrs()">
        <slot v-if="hasTriggerSlot()" name="trigger" />
        <template v-else>{{ triggerText }}</template
        ><span
          v-bind="
            mergeProps(withClass(api.getIndicatorProps(), classOf('icon')), {
              'aria-hidden': 'true',
            })
          "
          ><DsIcon name="chevron-down"
        /></span>
      </button>
    </template>
  </div>
</template>

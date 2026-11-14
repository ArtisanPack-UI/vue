<script setup lang="ts">
/**
 * @module Toast
 *
 * A brief, non-blocking message. Rendered on its own, a Toast is static
 * (no timer or machine): it renders the design-system Toast markup contract
 * (`.apui-toast`, #51) from `staticToastParts`. Show timed toasts with a
 * `Toaster` and `toast.create({ … })`.
 */
import { mergeProps, useAttrs, useId, useSlots } from 'vue';
import { staticToastParts } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { DsIcon } from '../../_shared/design-system';
import type { ToastPart, ToastProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToastProps>(), {
  title: undefined,
  description: undefined,
  color: 'neutral',
  variant: 'default',
  surface: 'overlay',
  icon: undefined,
  actions: undefined,
  hideClose: false,
  closeLabel: 'Dismiss notification',
  classes: undefined,
});

const emit = defineEmits<{
  'open-change': [open: boolean];
}>();

const attrs = useAttrs();
const slots = useSlots();
const id = useId();

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function hasTitle(): boolean {
  return !!slots.title || filled(props.title);
}

function hasDescription(): boolean {
  return !!slots.description || filled(props.description);
}

function hasActions(): boolean {
  return !!slots.actions || filled(props.actions);
}

/** The parts' attributes. A slotted title or description still gets its aria link. */
function parts() {
  return staticToastParts(
    {
      color: props.color,
      variant: props.variant,
      surface: props.surface,
      icon: filled(props.icon) ? props.icon : undefined,
      title: hasTitle() ? (props.title ?? ' ') : undefined,
      description: hasDescription() ? (props.description ?? ' ') : undefined,
    },
    { root: `${id}-toast`, title: `${id}-title`, description: `${id}-description` },
    { closeTriggerLabel: props.closeLabel },
  );
}

function withClass(own: Record<string, unknown>, name: ToastPart): Record<string, unknown> {
  const className = props.classes?.[name];
  return className ? mergeProps(own, { class: className }) : own;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(parts().root, attrs, { class: ['apui-toast', props.classes?.root] });
}

function close(): void {
  emit('open-change', false);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-bind="withClass(parts().icon, 'icon')">
      <slot name="icon"><DsIcon :name="parts().iconName" /></slot>
    </span>
    <p v-if="hasTitle()" v-bind="withClass(parts().title, 'title')">
      <slot name="title">{{ title }}</slot>
    </p>
    <p v-if="hasDescription()" v-bind="withClass(parts().description, 'description')">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="hasActions()" v-bind="withClass(parts().actions, 'actions')">
      <slot name="actions">{{ actions }}</slot>
    </div>
    <Button
      v-if="!hideClose"
      variant="ghost"
      color="neutral"
      size="sm"
      icon-only
      leading-icon="x"
      v-bind="withClass(parts().closeTrigger, 'closeTrigger')"
      @click="close"
    />
  </div>
</template>

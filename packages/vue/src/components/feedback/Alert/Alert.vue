<script setup lang="ts">
/**
 * @module Alert
 *
 * An inline message about the state of a page or section, rendering the
 * design-system Alert markup contract (`.apui-alert`, #60). The tint and the
 * status icon carry the meaning; errors are `role="alert"`, everything else
 * `role="status"`. A dismissible alert hides itself (the `hidden` attribute)
 * and emits `open-change`.
 */
import { mergeProps, ref, useAttrs, useSlots } from 'vue';
import Button from '../../form/Button/Button.vue';
import { DsIcon, hasContent, part } from '../../_shared/design-system';
import type { AlertPart, AlertProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AlertProps>(), {
  title: undefined,
  description: undefined,
  color: 'neutral',
  variant: 'soft',
  surface: 'default',
  icon: undefined,
  actions: undefined,
  dismissible: false,
  closeLabel: 'Dismiss',
  classes: undefined,
});

const emit = defineEmits<{
  'open-change': [open: boolean];
}>();

const attrs = useAttrs();
const slots = useSlots();
const dismissed = ref(false);

const STATUS_ICONS: Record<string, string> = {
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-alert',
};

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function iconName(): string {
  return filled(props.icon) ? props.icon! : (STATUS_ICONS[props.color] ?? 'info');
}

function hasTitle(): boolean {
  return (!!slots.title && hasContent(slots.title())) || filled(props.title);
}

function hasDescription(): boolean {
  return (
    (!!slots.description && hasContent(slots.description())) ||
    (!!slots.default && hasContent(slots.default())) ||
    filled(props.description)
  );
}

function hasActions(): boolean {
  return (!!slots.actions && hasContent(slots.actions())) || filled(props.actions);
}

function cls(name: AlertPart): string | undefined {
  return props.classes?.[name];
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(
    {
      class: 'apui-alert',
      'data-scope': 'alert',
      'data-part': 'root',
      role: props.color === 'error' ? 'alert' : 'status',
      'data-color': props.color,
      'data-variant': props.variant,
      'data-surface': props.surface,
      hidden: dismissed.value ? true : undefined,
    },
    attrs,
    { class: props.classes?.root },
  );
}

function close(): void {
  dismissed.value = true;
  emit('open-change', false);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <span v-bind="part('alert', 'icon', cls('icon'), { 'aria-hidden': 'true' })">
      <slot name="icon"><DsIcon :name="iconName()" /></slot>
    </span>
    <p v-if="hasTitle()" v-bind="part('alert', 'title', cls('title'))">
      <slot name="title">{{ title }}</slot>
    </p>
    <div v-if="hasDescription()" v-bind="part('alert', 'description', cls('description'))">
      <slot name="description"
        ><slot>{{ description }}</slot></slot
      >
    </div>
    <div v-if="hasActions()" v-bind="part('alert', 'actions', cls('actions'))">
      <slot name="actions">{{ actions }}</slot>
    </div>
    <Button
      v-if="dismissible"
      variant="ghost"
      color="neutral"
      size="xs"
      icon-only
      leading-icon="x"
      :aria-label="closeLabel"
      :class="cls('closeTrigger')"
      data-scope="alert"
      data-part="close-trigger"
      @click="close"
    />
  </div>
</template>

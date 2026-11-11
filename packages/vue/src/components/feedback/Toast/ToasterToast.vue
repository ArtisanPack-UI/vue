<script setup lang="ts">
/**
 * @module ToasterToast
 *
 * One toast inside a Toaster: the Toast markup driven by its Zag machine
 * (`useToast`), with its timer, Escape, and the action and close triggers.
 *
 * @internal
 */
import { computed, mergeProps } from 'vue';
import {
  TOAST_ICONS,
  type ToasterApi,
  type ToastEntry,
  useToast,
} from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { DsIcon } from '../../_shared/design-system';
import type { ToasterProps, ToastPart } from './types';

const props = defineProps<{
  entry: ToastEntry;
  service: ToasterApi['service'];
  index: number;
  classes?: ToasterProps['classes'];
  closeLabel?: string;
}>();

const machine = useToast(
  () => props.entry,
  props.service,
  () => props.index,
);

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const toast = computed(() => machine.value);

function withClass(
  own: unknown,
  name: ToastPart | 'actionTrigger',
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const className = props.classes?.[name];
  return mergeProps(own as Record<string, unknown>, extra, className ? { class: className } : {});
}

/** The toast's icon, or its color's status icon. */
function iconName(): string {
  const { meta } = toast.value;
  return meta.icon || TOAST_ICONS[meta.color];
}

function hasText(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}
</script>

<template>
  <div v-bind="withClass(toast.getRootProps(), 'root', { class: 'apui-toast' })">
    <span v-bind="withClass(toast.getIconProps(), 'icon')"><DsIcon :name="iconName()" /></span>
    <p v-if="hasText(toast.title)" v-bind="withClass(toast.getTitleProps(), 'title')">
      {{ toast.title }}
    </p>
    <p
      v-if="hasText(toast.description)"
      v-bind="withClass(toast.getDescriptionProps(), 'description')"
    >
      {{ toast.description }}
    </p>
    <div v-if="entry.action" v-bind="withClass(toast.getActionsProps(), 'actions')">
      <Button
        size="sm"
        variant="outline"
        color="neutral"
        v-bind="withClass(toast.getActionTriggerProps(), 'actionTrigger')"
      >
        {{ entry.action.label }}
      </Button>
    </div>
    <Button
      v-if="toast.closable"
      variant="ghost"
      color="neutral"
      size="sm"
      icon-only
      leading-icon="x"
      v-bind="
        withClass(
          toast.getCloseTriggerProps(),
          'closeTrigger',
          closeLabel ? { 'aria-label': closeLabel } : {},
        )
      "
    />
  </div>
</template>

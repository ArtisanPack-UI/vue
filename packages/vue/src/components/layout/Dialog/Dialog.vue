<script setup lang="ts">
/**
 * @module Dialog
 *
 * A modal window for a focused task or a confirmation. Renders the
 * design-system Dialog markup contract (`.apui-dialog`, #49) on the shared
 * Zag dialog machine (`useDialog`): focus trap, Escape and backdrop
 * dismissal, scroll lock and focus return. Replaces Modal.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useSlots } from 'vue';
import { useDialog } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { definedProps, DsIcon, hasContent, part } from '../../_shared/design-system';
import type { DialogProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogProps>(), {
  open: false,
  size: 'md',
  role: 'dialog',
  surface: 'overlay',
  color: undefined,
  icon: undefined,
  title: undefined,
  description: undefined,
  footer: undefined,
  trigger: undefined,
  modal: true,
  portal: true,
  hideClose: false,
  closeLabel: 'Close',
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

/**
 * Whether the parent passes `open`. Then the dialog is controlled: it reports
 * changes through `update:open` and shows only what the prop says, so a
 * parent that ignores or vetoes a change (or passes a static `:open="true"`)
 * keeps it where it is. Otherwise it keeps its own state. (`defineModel`
 * would fall back to local state when `open` is passed without a listener,
 * letting the shown state drift from the prop.)
 */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

/** The state when unbound. */
const localOpen = ref(props.open);

/** What the widget shows. */
function shownOpen(): boolean {
  return isBound() ? props.open : localOpen.value;
}

const slots = useSlots();

const machine = useDialog(() => ({
  open: shownOpen(),
  role: props.role,
  modal: props.modal,
  // Without a title, an aria-label names the panel instead (as React).
  label: hasTitle() ? undefined : (attrs['aria-label'] as string | undefined),
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
}));

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const dialog = computed(() => machine.value);

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function hasTrigger(): boolean {
  return !!slots.trigger || filled(props.trigger);
}

function hasIcon(): boolean {
  return !!slots.icon || filled(props.icon);
}

function hasTitle(): boolean {
  return !!slots.title || filled(props.title);
}

function hasDescription(): boolean {
  return !!slots.description || filled(props.description);
}

function hasHeader(): boolean {
  return hasIcon() || hasTitle() || hasDescription() || !props.hideClose;
}

function hasFooter(): boolean {
  return !!slots.footer || filled(props.footer);
}

/** A part's own class: the matching `classes` entry, when set. */
function classOf(name: keyof NonNullable<DialogProps['classes']>): string | undefined {
  return props.classes?.[name];
}

/** The panel: Zag's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, definedProps(dialog.value.getContentProps()), {
    class: ['apui-dialog', props.classes?.root, props.classes?.content],
    'data-size': props.size,
    'data-surface': props.surface,
    'data-color': props.color,
  });
}

/** Zag's props for a part, plus its extra class. */
function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <Button
    v-if="hasTrigger()"
    variant="outline"
    color="neutral"
    v-bind="withClass(dialog.getTriggerProps(), classOf('trigger'))"
  >
    <slot name="trigger">{{ trigger }}</slot>
  </Button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(dialog.getBackdropProps(), classOf('backdrop'))" />
    <div v-bind="withClass(dialog.getPositionerProps(), classOf('positioner'))">
      <div v-bind="contentAttrs()">
        <div v-if="hasHeader()" v-bind="part('dialog', 'header', classOf('header'))">
          <span
            v-if="hasIcon()"
            v-bind="part('dialog', 'icon', classOf('icon'), { 'aria-hidden': 'true' })"
          >
            <slot name="icon"><DsIcon :name="icon" /></slot>
          </span>
          <h2 v-if="hasTitle()" v-bind="withClass(dialog.getTitleProps(), classOf('title'))">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p
            v-if="hasDescription()"
            v-bind="withClass(dialog.getDescriptionProps(), classOf('description'))"
          >
            <slot name="description">{{ description }}</slot>
          </p>
          <Button
            v-if="!hideClose"
            variant="ghost"
            color="neutral"
            size="sm"
            icon-only
            leading-icon="x"
            :aria-label="closeLabel"
            v-bind="withClass(dialog.getCloseTriggerProps(), classOf('closeTrigger'))"
          />
        </div>
        <div v-if="hasContent($slots.default?.())" v-bind="part('dialog', 'body', classOf('body'))">
          <slot />
        </div>
        <div v-if="hasFooter()" v-bind="part('dialog', 'footer', classOf('footer'))">
          <slot name="footer">{{ footer }}</slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

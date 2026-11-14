<script setup lang="ts">
/**
 * @module Drawer
 *
 * A panel that slides in from an edge for filters, details or secondary
 * tasks. Renders the design-system Drawer markup contract (`.apui-drawer`,
 * #58) on the shared dialog machine (`useDrawer`), with every part scoped
 * `drawer`: focus trap, Escape and backdrop dismissal, scroll lock and focus
 * return. The side follows the reading direction.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useSlots } from 'vue';
import { useDrawer } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { definedProps, hasContent, part } from '../../_shared/design-system';
import type { DrawerProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerProps>(), {
  open: false,
  side: 'end',
  size: 'md',
  surface: 'overlay',
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
const slots = useSlots();

/** Whether the parent passes `open`: then the drawer shows only what the prop says (see Dialog). */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

const localOpen = ref(props.open);

function shownOpen(): boolean {
  return isBound() ? props.open : localOpen.value;
}

const machine = useDrawer(() => ({
  open: shownOpen(),
  modal: props.modal,
  // Without a title, an aria-label names the panel instead (as React).
  label: hasTitle() ? undefined : (attrs['aria-label'] as string | undefined),
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
}));

/** The machine's API, re-wrapped in this package's `computed` (see Dialog). */
const drawer = computed(() => machine.value);

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function hasTrigger(): boolean {
  return !!slots.trigger || filled(props.trigger);
}

function hasTitle(): boolean {
  return !!slots.title || filled(props.title);
}

function hasDescription(): boolean {
  return !!slots.description || filled(props.description);
}

function hasHeader(): boolean {
  return hasTitle() || hasDescription() || !props.hideClose;
}

function hasFooter(): boolean {
  return !!slots.footer || filled(props.footer);
}

function classOf(name: keyof NonNullable<DrawerProps['classes']>): string | undefined {
  return props.classes?.[name];
}

/** The panel: the machine's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, definedProps(drawer.value.getContentProps()), {
    class: ['apui-drawer', props.classes?.root, props.classes?.content],
    'data-side': props.side,
    'data-size': props.size,
    'data-surface': props.surface,
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
    v-bind="withClass(drawer.getTriggerProps(), classOf('trigger'))"
  >
    <slot name="trigger">{{ trigger }}</slot>
  </Button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(drawer.getBackdropProps(), classOf('backdrop'))" />
    <div v-bind="withClass(drawer.getPositionerProps(), classOf('positioner'))" :data-side="side">
      <aside v-bind="contentAttrs()">
        <div
          v-if="side === 'bottom'"
          v-bind="part('drawer', 'handle', classOf('handle'), { 'aria-hidden': 'true' })"
        />
        <div v-if="hasHeader()" v-bind="part('drawer', 'header', classOf('header'))">
          <h2 v-if="hasTitle()" v-bind="withClass(drawer.getTitleProps(), classOf('title'))">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p
            v-if="hasDescription()"
            v-bind="withClass(drawer.getDescriptionProps(), classOf('description'))"
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
            v-bind="withClass(drawer.getCloseTriggerProps(), classOf('closeTrigger'))"
          />
        </div>
        <div v-if="hasContent($slots.default?.())" v-bind="part('drawer', 'body', classOf('body'))">
          <slot />
        </div>
        <div v-if="hasFooter()" v-bind="part('drawer', 'footer', classOf('footer'))">
          <slot name="footer">{{ footer }}</slot>
        </div>
      </aside>
    </div>
  </Teleport>
</template>

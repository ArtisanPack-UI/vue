<script setup lang="ts">
/**
 * @module ErrorState
 *
 * Explains what failed, what's safe and how to recover, rendering the
 * design-system ErrorState markup contract (`.apui-error-state`, #60): an
 * icon tile or a large numeral, a heading, a description, a reference code
 * and recovery actions, announced as `role="alert"`.
 */
import { mergeProps, nextTick, onMounted, ref, useAttrs, useSlots, watch } from 'vue';
import { DsIcon, flag, hasContent, part } from '../../_shared/design-system';
import type { ErrorStatePart, ErrorStateProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ErrorStateProps>(), {
  variant: 'request',
  size: 'md',
  align: 'center',
  icon: undefined,
  numeral: undefined,
  title: undefined,
  description: undefined,
  code: undefined,
  actions: undefined,
  headingLevel: 3,
  focusTitle: false,
  classes: undefined,
});

const attrs = useAttrs();
const slots = useSlots();
const rootRef = ref<HTMLElement | null>(null);

const DEFAULT_ICONS: Record<string, string> = {
  request: 'server-crash',
  offline: 'wifi-off',
  forbidden: 'lock',
};

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

function slotted(name: string): boolean {
  const slot = slots[name];
  return !!slot && hasContent(slot());
}

function numeralText(): string | undefined {
  if (filled(props.numeral)) return props.numeral;
  return props.variant === 'not-found' ? '404' : undefined;
}

function iconName(): string | undefined {
  if (filled(props.icon)) return props.icon;
  if (numeralText() !== undefined) return undefined;
  return DEFAULT_ICONS[props.variant];
}

function showsIcon(): boolean {
  return slotted('icon') || iconName() !== undefined;
}

function heading(): string {
  const level = Math.min(6, Math.max(1, Math.round(Number(props.headingLevel) || 3)));
  return `h${level}`;
}

function cls(name: ErrorStatePart): string | undefined {
  return props.classes?.[name];
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(
    {
      class: 'apui-error-state',
      'data-scope': 'error-state',
      'data-part': 'root',
      role: 'alert',
      'data-variant': props.variant,
      'data-size': props.size,
      'data-align': props.align,
    },
    attrs,
    { class: props.classes?.root },
  );
}

function titleAttrs(): Record<string, unknown> {
  return part('error-state', 'title', cls('title'), {
    tabindex: props.focusTitle ? '-1' : undefined,
    'data-focus-title': flag(props.focusTitle),
  });
}

function focusOwnTitle(): void {
  rootRef.value
    ?.querySelector<HTMLElement>('[data-scope="error-state"][data-part="title"]')
    ?.focus();
}

onMounted(() => {
  if (props.focusTitle) focusOwnTitle();
});

/** Turning `focusTitle` on later focuses the title once it has re-rendered (as React). */
watch(
  () => props.focusTitle,
  (on) => {
    if (on) void nextTick(focusOwnTitle);
  },
);
</script>

<template>
  <div ref="rootRef" v-bind="rootAttrs()">
    <span
      v-if="showsIcon()"
      v-bind="part('error-state', 'icon', cls('icon'), { 'aria-hidden': 'true' })"
    >
      <slot name="icon"><DsIcon :name="iconName()" /></slot>
    </span>
    <span
      v-if="numeralText() !== undefined"
      v-bind="part('error-state', 'numeral', cls('numeral'))"
      >{{ numeralText() }}</span
    >
    <component :is="heading()" v-if="slotted('title') || filled(title)" v-bind="titleAttrs()">
      <slot name="title">{{ title }}</slot>
    </component>
    <div
      v-if="slotted('description') || slotted('default') || filled(description)"
      v-bind="part('error-state', 'description', cls('description'))"
    >
      <slot name="description"
        ><slot>{{ description }}</slot></slot
      >
    </div>
    <span v-if="filled(code)" v-bind="part('error-state', 'code', cls('code'))">{{ code }}</span>
    <div
      v-if="slotted('actions') || filled(actions)"
      v-bind="part('error-state', 'actions', cls('actions'))"
    >
      <slot name="actions">{{ actions }}</slot>
    </div>
  </div>
</template>

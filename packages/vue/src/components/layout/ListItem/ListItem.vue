<script setup lang="ts">
/**
 * @module ListItem
 *
 * A row with leading, title, description and trailing parts. Renders the
 * design-system ListItem markup contract (`.apui-list-item`, #58): an li
 * inside a List, a div on its own. With `href` the title is a link and with
 * `interactive` a button; either covers the row.
 */
import { computed, inject, useSlots } from 'vue';
import { DsIcon, flag, hasContent, part, safeHref } from '../../_shared/design-system';
import { IN_LIST_KEY } from './keys';
import type { ListItemProps } from './types';

const props = withDefaults(defineProps<ListItemProps>(), {
  title: undefined,
  description: undefined,
  href: undefined,
  interactive: false,
  selected: false,
  disabled: false,
  leadingIcon: undefined,
  trailing: undefined,
  classes: undefined,
});

const slots = useSlots();
const inList = inject(IN_LIST_KEY, false);

const link = computed(() => safeHref(props.href));
const titleTag = computed(() =>
  link.value !== undefined ? 'a' : props.interactive ? 'button' : 'span',
);
const isControl = computed(() => titleTag.value !== 'span');

function titleAttrs(): Record<string, unknown> {
  const extra: Record<string, unknown> = {
    'aria-current': isControl.value && props.selected ? 'true' : undefined,
  };
  if (titleTag.value === 'a') {
    extra.href = props.disabled ? undefined : link.value;
    extra.role = props.disabled ? 'link' : undefined;
    extra['aria-disabled'] = props.disabled ? 'true' : undefined;
  } else if (titleTag.value === 'button') {
    extra.type = 'button';
    extra.disabled = props.disabled || undefined;
  }
  return part('list-item', 'title', props.classes?.title, extra);
}

const hasDescription = () => hasContent(slots.description?.()) || !!props.description;
const hasTrailing = () => hasContent(slots.trailing?.()) || !!props.trailing;
const hasLeading = () => hasContent(slots.leading?.()) || !!props.leadingIcon;
</script>

<template>
  <component
    :is="inList ? 'li' : 'div'"
    :class="['apui-list-item', classes?.root]"
    :data-interactive="flag(isControl)"
    :data-selected="flag(selected)"
    :data-disabled="flag(disabled)"
    :aria-disabled="disabled ? 'true' : undefined"
    ><span v-if="hasLeading()" v-bind="part('list-item', 'leading', classes?.leading)"
      ><slot name="leading"><DsIcon :name="leadingIcon" /></slot></span
    ><component :is="titleTag" v-bind="titleAttrs()"
      ><slot name="title">{{ title }}<slot v-if="!title" /></slot></component
    ><span v-if="hasDescription()" v-bind="part('list-item', 'description', classes?.description)"
      ><slot name="description">{{ description }}</slot></span
    ><span v-if="hasTrailing()" v-bind="part('list-item', 'trailing', classes?.trailing)"
      ><slot name="trailing">{{ trailing }}</slot></span
    ></component
  >
</template>

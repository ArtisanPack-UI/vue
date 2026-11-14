<script setup lang="ts">
/**
 * @module Card
 *
 * The default container: a surface with an edge, plus optional media,
 * header, body and footer parts. Renders the design-system Card markup
 * contract (`.apui-card`, #48).
 */
import { useSlots } from 'vue';
import {
  flag,
  hasContent,
  part,
  safeHref,
  safeMediaUrl,
  warnOnce,
} from '../../_shared/design-system';
import type { CardProps } from './types';

const props = withDefaults(defineProps<CardProps>(), {
  surface: 'default',
  interactive: false,
  href: undefined,
  title: undefined,
  description: undefined,
  actions: undefined,
  footer: undefined,
  media: undefined,
  mediaAlt: '',
  classes: undefined,
});

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

const slots = useSlots();

function hasTitle(): boolean {
  return !!slots.title || filled(props.title);
}

/**
 * The title link's href. It needs a title to live in, so without one (or
 * with an unsafe scheme) it's ignored.
 */
function linkHref(): string | undefined {
  const href = safeHref(props.href);
  if (href === undefined) return undefined;
  if (!hasTitle()) {
    warnOnce(
      'card:href-without-title',
      'Card ignores href without a title: the title is the link.',
    );
    return undefined;
  }
  return href;
}

function mediaSrc(): string | undefined {
  return safeMediaUrl(props.media);
}

function isInteractive(): boolean {
  return props.interactive || linkHref() !== undefined;
}
</script>

<template>
  <div
    :class="['apui-card', classes?.root]"
    :data-surface="surface"
    :data-interactive="flag(isInteractive())"
  >
    <div v-if="$slots.media" v-bind="part('card', 'media', classes?.media)">
      <slot name="media" />
    </div>
    <img
      v-else-if="mediaSrc() !== undefined"
      v-bind="part('card', 'media', classes?.media)"
      :src="mediaSrc()"
      :alt="mediaAlt"
    />
    <div
      v-if="
        $slots.title ||
        filled(title) ||
        $slots.description ||
        filled(description) ||
        $slots.actions ||
        filled(actions)
      "
      v-bind="part('card', 'header', classes?.header)"
    >
      <div v-if="$slots.title || filled(title) || $slots.description || filled(description)">
        <h3 v-if="$slots.title || filled(title)" v-bind="part('card', 'title', classes?.title)">
          <a v-if="linkHref() !== undefined" :href="linkHref()"
            ><slot name="title">{{ title }}</slot></a
          >
          <slot v-else name="title">{{ title }}</slot>
        </h3>
        <p
          v-if="$slots.description || filled(description)"
          v-bind="part('card', 'description', classes?.description)"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div
        v-if="$slots.actions || filled(actions)"
        v-bind="part('card', 'actions', classes?.actions)"
      >
        <slot name="actions">{{ actions }}</slot>
      </div>
    </div>
    <div v-if="hasContent($slots.default?.())" v-bind="part('card', 'body', classes?.body)">
      <slot />
    </div>
    <div v-if="$slots.footer || filled(footer)" v-bind="part('card', 'footer', classes?.footer)">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

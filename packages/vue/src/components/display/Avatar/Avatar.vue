<script setup lang="ts">
/**
 * @module Avatar
 *
 * A person or organization as an image, initials or an icon. Renders the
 * design-system Avatar markup contract (`.apui-avatar`, #61): role=img named
 * after the person, with an image over the initials, so a broken image shows
 * them. Without a name or `alt` it's decorative.
 */
import { computed } from 'vue';
import { DsIcon, part, safeMediaUrl } from '../../_shared/design-system';
import { avatarColor, avatarInitials } from './identity';
import type { AvatarProps, AvatarStatus } from './types';

const props = withDefaults(defineProps<AvatarProps>(), {
  name: undefined,
  src: undefined,
  alt: undefined,
  initials: undefined,
  icon: undefined,
  size: 'md',
  shape: 'circle',
  color: undefined,
  status: undefined,
  statusLabel: undefined,
  classes: undefined,
});

const STATUS_WORDS: Record<AvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

const letters = computed(() =>
  props.initials?.trim() ? props.initials.trim() : avatarInitials(props.name),
);
const iconName = computed(() => props.icon || (letters.value === '' ? 'user' : undefined));
const image = computed(() => safeMediaUrl(props.src));
const label = computed(() => {
  const base = props.alt?.trim() ? props.alt.trim() : (props.name ?? '').trim();
  if (base === '') return '';
  if (!props.status) return base;
  return `${base} (${props.statusLabel || STATUS_WORDS[props.status]})`;
});
</script>

<template>
  <span
    :class="['apui-avatar', classes?.root]"
    :data-size="size"
    :data-shape="shape === 'square' ? 'square' : 'circle'"
    :data-color="color ?? avatarColor(name)"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    ><DsIcon v-if="iconName" :name="iconName" /><span
      v-else
      v-bind="part('avatar', 'initials', classes?.initials, { 'aria-hidden': 'true' })"
      >{{ letters }}</span
    ><img
      v-if="image"
      v-bind="part('avatar', 'image', classes?.image, { 'aria-hidden': 'true' })"
      :src="image"
      alt="" /><span
      v-if="status"
      v-bind="
        part('avatar', 'status', classes?.status, { 'data-status': status, 'aria-hidden': 'true' })
      "
  /></span>
</template>

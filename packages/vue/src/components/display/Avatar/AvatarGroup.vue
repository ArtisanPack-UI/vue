<script setup lang="ts">
/**
 * @module AvatarGroup
 *
 * A row of overlapping Avatars (`.apui-avatar-group`, #61), each ringed in
 * the surface color: the first `max` of `avatars`, a +N avatar for the rest,
 * then the default slot.
 */
import { computed } from 'vue';
import Avatar from './Avatar.vue';
import type { AvatarGroupProps } from './types';

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  avatars: () => [],
  max: undefined,
  size: 'md',
  label: undefined,
  moreLabel: '{count} more',
});

const shown = computed(() =>
  props.max !== undefined && props.max >= 0 ? props.avatars.slice(0, props.max) : props.avatars,
);
const hidden = computed(() => props.avatars.length - shown.value.length);
</script>

<template>
  <span class="apui-avatar-group" role="group" :aria-label="label || undefined"
    ><Avatar v-for="(avatar, index) in shown" :key="index" v-bind="avatar" :size="size" /><Avatar
      v-if="hidden > 0"
      :initials="`+${hidden}`"
      :alt="moreLabel.replace('{count}', String(hidden))"
      color="neutral"
      :size="size" /><slot
  /></span>
</template>

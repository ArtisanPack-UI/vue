<script setup lang="ts">
import Avatar from './Avatar.vue';
import AvatarGroup from './AvatarGroup.vue';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const members = [
  { name: 'Olivia Rhye' },
  { name: 'Phoenix Baker' },
  { name: 'Lana Steiner' },
  { name: 'Demi Wilkinson' },
  { name: 'Candice Wu' },
  { name: 'Drew Cano' },
];
</script>

<template>
  <Story title="Display/Avatar" group="display">
    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Avatar v-for="size in sizes" :key="size" name="Olivia Rhye" :size="size" />
      </div>
    </Variant>

    <Variant title="Status, shape and fallback">
      <div style="display: flex; gap: 8px">
        <Avatar name="Olivia Rhye" status="online" />
        <Avatar name="Phoenix Baker" status="away" />
        <Avatar name="Lana Steiner" status="offline" />
        <Avatar name="Apexify" shape="square" color="neutral" />
        <Avatar />
      </div>
    </Variant>

    <Variant title="Group">
      <AvatarGroup :avatars="members" :max="4" size="sm" label="Project members" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
/**
 * @module GuestLayout
 *
 * A page shell for guest pages (sign in, register): the `logo` slot and the
 * default slot in a column up to 28rem wide, centered in the viewport by a
 * design-system Stack. Needs only `@artisanpack-ui/css`, not Tailwind.
 */
import { Head } from '@inertiajs/vue3';
import { Stack } from '@artisanpack-ui/vue';
import type { GuestLayoutProps } from '../../types';

const props = defineProps<GuestLayoutProps>();
</script>

<template>
  <Stack
    gap="0"
    align="center"
    justify="center"
    :class="props.className"
    style="min-block-size: 100vh"
  >
    <Head v-if="props.title" :title="props.title" />
    <Stack gap="0" style="inline-size: 100%; max-inline-size: 28rem">
      <slot name="logo" />
      <slot />
    </Stack>
  </Stack>
</template>

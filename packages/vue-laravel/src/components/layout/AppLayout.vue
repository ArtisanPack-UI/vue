<script setup lang="ts">
/**
 * @module AppLayout
 *
 * A persistent page shell: the `header` slot, the default slot in `<main>`
 * and the `footer` slot, stacked in a design-system Stack that fills the
 * viewport, with `<main>` taking the free space. Needs only
 * `@artisanpack-ui/css`, not Tailwind. For a sidebar frame, use AppShell.
 */
import { Head } from '@inertiajs/vue3';
import { Stack } from '@artisanpack-ui/vue';
import type { AppLayoutProps } from '../../types';

const props = defineProps<AppLayoutProps>();
</script>

<template>
  <Stack gap="0" :class="props.className" style="min-block-size: 100vh">
    <Head v-if="props.title" :title="props.title" />
    <slot name="header" />
    <main style="flex: 1 1 auto; min-inline-size: 0">
      <slot />
    </main>
    <slot name="footer" />
  </Stack>
</template>

<script setup lang="ts">
/**
 * @module AuthLayout
 *
 * A page shell for signed-in pages: the `header` slot, then the `sidebar`
 * slot beside the default slot in `<main>`, then the `footer` slot. Built on
 * design-system Stacks that fill the viewport, with `<main>` taking the free
 * space. Needs only `@artisanpack-ui/css`, not Tailwind. For the
 * design-system application frame (islands, collapsible sidebar), use AppShell.
 */
import { Head } from '@inertiajs/vue3';
import { Stack } from '@artisanpack-ui/vue';
import type { AuthLayoutProps } from '../../types';

const props = defineProps<AuthLayoutProps>();
</script>

<template>
  <Stack gap="0" :class="props.className" style="min-block-size: 100vh">
    <Head v-if="props.title" :title="props.title" />
    <slot name="header" />
    <Stack orientation="horizontal" gap="0" style="flex: 1 1 auto">
      <slot name="sidebar" />
      <main style="flex: 1 1 auto; min-inline-size: 0">
        <slot />
      </main>
    </Stack>
    <slot name="footer" />
  </Stack>
</template>

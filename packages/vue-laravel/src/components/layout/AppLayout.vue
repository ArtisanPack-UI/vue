<script setup lang="ts">
/** @module AppLayout */
import { Head } from '@inertiajs/vue3';
import { cn } from '@artisanpack-ui/tokens';
import type { AppLayoutProps } from '../../types';

const props = defineProps<AppLayoutProps>();
</script>

<template>
  <div :class="cn('min-h-screen', props.className)">
    <Head v-if="props.title" :title="props.title" />
    <slot name="header" />
    <main>
      <slot />
    </main>
    <slot name="footer" />
  </div>
</template>

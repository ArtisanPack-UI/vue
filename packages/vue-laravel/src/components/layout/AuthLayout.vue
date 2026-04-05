<script setup lang="ts">
/** @module AuthLayout */
import { Head } from '@inertiajs/vue3';
import { cn } from '@artisanpack-ui/tokens';
import type { AuthLayoutProps } from '../../types';

const props = defineProps<AuthLayoutProps>();
</script>

<template>
  <div :class="cn('min-h-screen flex flex-col', props.className)">
    <Head v-if="props.title" :title="props.title" />
    <slot name="header" />
    <div class="flex flex-1">
      <slot name="sidebar" />
      <main class="flex-1">
        <slot />
      </main>
    </div>
    <slot name="footer" />
  </div>
</template>

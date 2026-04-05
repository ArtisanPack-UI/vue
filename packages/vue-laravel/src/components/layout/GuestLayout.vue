<script setup lang="ts">
/** @module GuestLayout */
import { Head } from '@inertiajs/vue3';
import { cn } from '@artisanpack-ui/tokens';
import type { GuestLayoutProps } from '../../types';

const props = defineProps<GuestLayoutProps>();
</script>

<template>
  <div :class="cn('min-h-screen flex items-center justify-center', props.className)">
    <Head v-if="props.title" :title="props.title" />
    <div class="w-full max-w-md">
      <slot name="logo" />
      <slot />
    </div>
  </div>
</template>

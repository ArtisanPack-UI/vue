<script setup lang="ts">
/** @module Breadcrumbs */
import { cn } from '@artisanpack-ui/tokens';
import type { BreadcrumbsProps } from './types';

const props = defineProps<BreadcrumbsProps>();
</script>

<template>
  <nav :class="cn('breadcrumbs text-sm', props.className)" aria-label="Breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="item.href ?? item.label">
        <a v-if="item.href && index !== items.length - 1" :href="item.href">
          <slot name="item" :item="item" :index="index" :is-last="false">
            {{ item.label }}
          </slot>
        </a>
        <span v-else :aria-current="index === items.length - 1 ? 'page' : undefined">
          <slot name="item" :item="item" :index="index" :is-last="index === items.length - 1">
            {{ item.label }}
          </slot>
        </span>
      </li>
    </ul>
  </nav>
</template>

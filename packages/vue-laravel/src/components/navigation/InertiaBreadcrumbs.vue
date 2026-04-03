<script setup lang="ts">
/** @module InertiaBreadcrumbs */
import { Link } from '@inertiajs/vue3';
import { cn } from '@artisanpack-ui/tokens';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const props = defineProps<{
  items: BreadcrumbItem[];
  className?: string;
}>();
</script>

<template>
  <nav :class="cn('breadcrumbs text-sm', props.className)" aria-label="Breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="item.href ?? item.label">
        <Link v-if="item.href && index !== items.length - 1" :href="item.href">
          <slot name="item" :item="item" :index="index" :is-last="false">
            {{ item.label }}
          </slot>
        </Link>
        <span v-else :aria-current="index === items.length - 1 ? 'page' : undefined">
          <slot name="item" :item="item" :index="index" :is-last="index === items.length - 1">
            {{ item.label }}
          </slot>
        </span>
      </li>
    </ul>
  </nav>
</template>

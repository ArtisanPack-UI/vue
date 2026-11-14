<script setup lang="ts">
/**
 * @module BreadcrumbsItem
 *
 * One composed level of a Breadcrumbs, a direct child. The trail renders it
 * in order after `items`: the default slot overrides `label`, and other
 * attributes (`@click`) land on its link. On its own it renders nothing.
 */
import type { BreadcrumbsItemProps } from './types';

defineProps<BreadcrumbsItemProps>();
</script>

<template>
  <template v-if="false" />
</template>

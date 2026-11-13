<script setup lang="ts">
/**
 * @module List
 *
 * Rows of ListItems (`.apui-list`, #58), which render as li inside it.
 */
import { provide } from 'vue';
import { IN_LIST_KEY } from './keys';
import type { ListProps } from './types';

withDefaults(defineProps<ListProps>(), { variant: 'plain', ordered: false });

provide(IN_LIST_KEY, true);
</script>

<template>
  <component :is="ordered ? 'ol' : 'ul'" class="apui-list" :data-variant="variant"
    ><slot
  /></component>
</template>

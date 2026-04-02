<script setup lang="ts">
/** @module Pagination */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';
import type { PaginationProps } from './types';

const props = withDefaults(defineProps<PaginationProps>(), {
  siblingCount: 1,
});

const emit = defineEmits<{
  'update:currentPage': [page: number];
}>();

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const ELLIPSIS = '…';

const pages = computed(() => {
  const total = Math.max(1, props.totalPages);
  const current = Math.min(Math.max(1, props.currentPage), total);
  const siblings = Math.max(0, props.siblingCount);

  if (total <= 1) return [];

  const range: (number | string)[] = [];

  const leftSibling = Math.max(current - siblings, 2);
  const rightSibling = Math.min(current + siblings, total - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  range.push(1);

  if (showLeftEllipsis) {
    range.push(ELLIPSIS);
  } else {
    for (let i = 2; i < leftSibling; i++) {
      range.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    range.push(i);
  }

  if (showRightEllipsis) {
    range.push(ELLIPSIS);
  } else {
    for (let i = rightSibling + 1; i < total; i++) {
      range.push(i);
    }
  }

  range.push(total);

  return range;
});

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit('update:currentPage', page);
}

const btnClasses = computed(() => cn('join-item btn', props.size && sizeMap[props.size]));
</script>

<template>
  <nav :class="cn('pagination', props.className)" role="navigation" aria-label="Pagination">
    <div class="join">
      <button
        :class="btnClasses"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        type="button"
        @click="goToPage(currentPage - 1)"
      >
        «
      </button>
      <template
        v-for="(page, index) in pages"
        :key="typeof page === 'number' ? `page-${page}` : `gap-${index}`"
      >
        <button
          v-if="typeof page === 'number'"
          :class="cn(btnClasses, page === currentPage && 'btn-active')"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`Page ${page}`"
          type="button"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button v-else :class="cn(btnClasses, 'btn-disabled')" disabled type="button">
          {{ page }}
        </button>
      </template>
      <button
        :class="btnClasses"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        type="button"
        @click="goToPage(currentPage + 1)"
      >
        »
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
/**
 * @module InertiaPagination
 *
 * Pagination component that works directly with Laravel's paginator response.
 * Uses Inertia's `router.visit()` for SPA page navigation instead of
 * re-emitting page numbers.
 */
import { computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { Pagination } from '@artisanpack-ui/vue';
import type { PaginationProps } from '@artisanpack-ui/vue';
import type { LaravelPaginator } from '../../types';

interface InertiaPaginationProps {
  /** Laravel paginator response object. */
  paginator: LaravelPaginator;
  /** Number of sibling pages to show on each side of the current page. */
  siblingCount?: number;
  /** DaisyUI size modifier for pagination buttons. */
  size?: PaginationProps['size'];
  /** Additional CSS classes. */
  className?: string;
  /**
   * When true, preserves the current scroll position during navigation.
   *
   * @defaultValue `false`
   */
  preserveScroll?: boolean;
  /**
   * When true, preserves the component state during navigation.
   *
   * @defaultValue `false`
   */
  preserveState?: boolean;
  /**
   * Additional query parameters to include with pagination requests.
   */
  queryParams?: Record<string, string | number>;
}

const props = withDefaults(defineProps<InertiaPaginationProps>(), {
  preserveScroll: false,
  preserveState: false,
});

const currentPage = computed(() => props.paginator.current_page);
const totalPages = computed(() => props.paginator.last_page);

function handlePageChange(page: number) {
  const url = new URL(props.paginator.path, window.location.origin);
  url.searchParams.set('page', String(page));

  if (props.queryParams) {
    for (const [key, value] of Object.entries(props.queryParams)) {
      url.searchParams.set(key, String(value));
    }
  }

  router.visit(url.pathname + url.search, {
    preserveScroll: props.preserveScroll,
    preserveState: props.preserveState,
  });
}
</script>

<template>
  <Pagination
    :current-page="currentPage"
    :total-pages="totalPages"
    :sibling-count="siblingCount"
    :size="size"
    :class-name="className"
    @update:current-page="handlePageChange"
  />
</template>

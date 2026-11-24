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

type PaginatorPageInfo = Pick<LaravelPaginator, 'current_page' | 'last_page' | 'path'>;

interface InertiaPaginationProps {
  /**
   * Laravel paginator response object from `->paginate()`, or a paginated
   * API resource collection, whose page details are under `meta`.
   */
  paginator: PaginatorPageInfo | { meta: PaginatorPageInfo };
  /**
   * Query parameter name for the page.
   *
   * @defaultValue `'page'`
   */
  pageParam?: string;
  /** Number of sibling pages to show on each side of the current page. */
  siblingCount?: PaginationProps['siblings'];
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
  /**
   * Keeps the current URL's query parameters, such as search, filters and
   * sort, when changing page. `queryParams` wins over them.
   *
   * @defaultValue `false`
   */
  preserveQuery?: boolean;
  /** Only reload these page prop keys. */
  only?: string[];
}

const props = withDefaults(defineProps<InertiaPaginationProps>(), {
  pageParam: 'page',
  preserveScroll: false,
  preserveState: false,
  preserveQuery: false,
  only: undefined,
});

const pageInfo = computed(() =>
  'current_page' in props.paginator ? props.paginator : props.paginator.meta,
);
const currentPage = computed(() => pageInfo.value.current_page);
const totalPages = computed(() => pageInfo.value.last_page);

function handlePageChange(page: number) {
  const url = new URL(pageInfo.value.path, window.location.origin);

  if (props.preserveQuery) {
    // The current values replace the path's for the same key, so a stale
    // filter in the path can't ride along; repeated keys keep every value.
    const current = new URLSearchParams(window.location.search);
    new Set(current.keys()).forEach((key) => url.searchParams.delete(key));
    current.forEach((value, key) => url.searchParams.append(key, value));
  }

  if (props.queryParams) {
    for (const [key, value] of Object.entries(props.queryParams)) {
      if (key !== props.pageParam) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  // Set page last so queryParams cannot override the clicked page
  url.searchParams.set(props.pageParam, String(page));

  router.visit(url.pathname + url.search, {
    preserveScroll: props.preserveScroll,
    preserveState: props.preserveState,
    ...(props.only ? { only: props.only } : {}),
  });
}
</script>

<template>
  <Pagination
    :page="currentPage"
    :page-count="totalPages"
    :siblings="siblingCount"
    :class="className"
    @page-change="handlePageChange"
  />
</template>

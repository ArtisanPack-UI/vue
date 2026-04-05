/**
 * Composable for accessing the authenticated user from Inertia shared props.
 *
 * @module composables/useAuth
 */
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { AuthUser, SharedPageProps } from '../types';

/**
 * Returns reactive references to the authenticated user and auth helpers.
 *
 * Reads from `usePage().props.auth` — the standard location for auth data
 * shared via Laravel's `HandleInertiaRequests` middleware.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAuth } from '@artisanpack-ui/vue-laravel';
 *
 * const { user, isAuthenticated, isGuest } = useAuth();
 * </script>
 *
 * <template>
 *   <p v-if="isAuthenticated">Hello, {{ user?.name }}</p>
 *   <p v-else>Please sign in.</p>
 * </template>
 * ```
 */
export function useAuth<T extends AuthUser = AuthUser>() {
  const page = usePage<SharedPageProps>();

  /** The currently authenticated user, or `null` if not logged in. */
  const user = computed<T | null>(() => (page.props.auth?.user as T) ?? null);

  /** `true` when there is an authenticated user. */
  const isAuthenticated = computed(() => user.value !== null);

  /** `true` when there is no authenticated user. */
  const isGuest = computed(() => user.value === null);

  return { user, isAuthenticated, isGuest };
}

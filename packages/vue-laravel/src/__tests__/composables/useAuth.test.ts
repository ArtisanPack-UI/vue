import { describe, it, expect, vi } from 'vitest';
import { reactive } from 'vue';

const mockPageProps = reactive({
  auth: {
    user: null as { id: number; name: string; email: string } | null,
  },
  flash: {},
  errors: {},
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({
    props: mockPageProps,
  }),
}));

import { useAuth } from '../../composables/useAuth';

describe('useAuth', () => {
  it('returns null user when not authenticated', () => {
    mockPageProps.auth = { user: null };
    const { user, isAuthenticated, isGuest } = useAuth();
    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
    expect(isGuest.value).toBe(true);
  });

  it('returns user when authenticated', () => {
    mockPageProps.auth = {
      user: { id: 1, name: 'John', email: 'john@example.com' },
    };
    const { user, isAuthenticated, isGuest } = useAuth();
    expect(user.value).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
    expect(isAuthenticated.value).toBe(true);
    expect(isGuest.value).toBe(false);
  });

  it('handles missing auth prop gracefully', () => {
    (mockPageProps as Record<string, unknown>).auth = undefined;
    const { user, isAuthenticated, isGuest } = useAuth();
    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
    expect(isGuest.value).toBe(true);
  });
});

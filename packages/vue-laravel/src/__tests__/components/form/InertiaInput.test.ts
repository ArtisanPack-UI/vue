import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { reactive } from 'vue';

const mockPageProps = reactive({
  auth: { user: null },
  flash: {},
  errors: {} as Record<string, string>,
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: mockPageProps }),
}));

import InertiaInput from '../../../components/form/InertiaInput.vue';

describe('InertiaInput', () => {
  it('renders with label', () => {
    render(InertiaInput, {
      props: { name: 'email', label: 'Email Address' },
    });

    expect(screen.getByText('Email Address')).toBeDefined();
  });

  it('shows explicit error prop over page errors', () => {
    mockPageProps.errors = { email: 'Server error' };

    render(InertiaInput, {
      props: { name: 'email', label: 'Email', error: 'Explicit error' },
    });

    expect(screen.getByText('Explicit error')).toBeDefined();
  });

  it('falls back to Inertia page errors when no explicit error', () => {
    mockPageProps.errors = { email: 'The email field is required.' };

    render(InertiaInput, {
      props: { name: 'email', label: 'Email' },
    });

    expect(screen.getByText('The email field is required.')).toBeDefined();
  });

  it('shows no error when field has no errors', () => {
    mockPageProps.errors = {};

    const { container } = render(InertiaInput, {
      props: { name: 'email', label: 'Email' },
    });

    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('passes through input props', () => {
    render(InertiaInput, {
      props: {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        required: true,
      },
    });

    const input = screen.getByPlaceholderText('you@example.com');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('aria-required')).toBe('true');
  });
});

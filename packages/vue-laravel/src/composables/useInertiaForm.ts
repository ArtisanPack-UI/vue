/**
 * Composable wrapping Inertia's `useForm()` with automatic error mapping
 * for ArtisanPack UI form components.
 *
 * @module composables/useInertiaForm
 */
import { computed } from 'vue';
import { useForm as inertiaUseForm } from '@inertiajs/vue3';
import type { InertiaFormOptions } from '../types';

/** Minimal form shape that we rely on from Inertia's useForm return value. */
interface InertiaFormInstance<T> {
  errors: Partial<Record<keyof T, string>>;
  processing: boolean;
  recentlySuccessful: boolean;
  isDirty: boolean;
  reset: (...fields: (keyof T)[]) => InertiaFormInstance<T>;
  clearErrors: (...fields: (keyof T)[]) => InertiaFormInstance<T>;
  submit: (method: string, url: string, options?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

/**
 * Creates an Inertia form instance with helpers for binding to ArtisanPack UI
 * form components.
 */
export function useInertiaForm<T extends Record<string, unknown>>(
  initialData: T,
  options: InertiaFormOptions = {},
) {
  const { resetOnSuccess = true } = options;

  const form = (inertiaUseForm as (data: T) => InertiaFormInstance<T>)(initialData);

  /** Reactive map of field name to first error message. */
  const errors = computed(() => form.errors);

  /** Whether the form is currently being submitted. */
  const processing = computed(() => form.processing);

  /** Whether the form has been recently successful. */
  const recentlySuccessful = computed(() => form.recentlySuccessful);

  /** Whether the form data has been modified from the initial values. */
  const isDirty = computed(() => form.isDirty);

  /**
   * Get the first validation error for a field, suitable for passing
   * directly to the `error` prop on ArtisanPack UI form components.
   */
  function getError(field: keyof T | string): string | undefined {
    return (form.errors as Record<string, string>)[field as string] ?? undefined;
  }

  /** Clear errors for specific fields or all errors. */
  function clearErrors(...fields: (keyof T | string)[]) {
    if (fields.length === 0) {
      form.clearErrors();
    } else {
      form.clearErrors(...fields);
    }
  }

  /** Reset the form to its initial values. Optionally reset only specific fields. */
  function reset(...fields: (keyof T | string)[]) {
    if (fields.length === 0) {
      form.reset();
    } else {
      form.reset(...fields);
    }
  }

  /**
   * Submit the form using the given HTTP method and URL.
   *
   * Wraps Inertia's form submission with the `resetOnSuccess` option.
   */
  function submit(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    submitOptions?: Record<string, unknown>,
  ) {
    const mergedOptions: Record<string, unknown> = {
      ...submitOptions,
    };

    if (resetOnSuccess) {
      const existingOnSuccess = mergedOptions.onSuccess;
      mergedOptions.onSuccess = (...args: unknown[]) => {
        if (typeof existingOnSuccess === 'function') {
          existingOnSuccess(...args);
        }
        form.reset();
      };
    }

    form.submit(method, url, mergedOptions);
  }

  /** Shorthand for `submit('post', url, options)`. */
  function post(url: string, options?: Record<string, unknown>) {
    submit('post', url, options);
  }

  /** Shorthand for `submit('put', url, options)`. */
  function put(url: string, options?: Record<string, unknown>) {
    submit('put', url, options);
  }

  /** Shorthand for `submit('patch', url, options)`. */
  function patch(url: string, options?: Record<string, unknown>) {
    submit('patch', url, options);
  }

  /** Shorthand for `submit('delete', url, options)`. */
  function destroy(url: string, options?: Record<string, unknown>) {
    submit('delete', url, options);
  }

  return {
    form,
    errors,
    processing,
    recentlySuccessful,
    isDirty,
    getError,
    clearErrors,
    reset,
    submit,
    post,
    put,
    patch,
    destroy,
  };
}

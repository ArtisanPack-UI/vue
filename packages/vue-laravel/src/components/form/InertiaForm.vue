<script setup lang="ts">
/**
 * @module InertiaForm
 *
 * Provides an Inertia form context to child components. Wraps `useInertiaForm`
 * and provides the form + error getters via provide/inject so that child
 * `InertiaInput`, `InertiaSelect`, etc. can auto-bind errors.
 */
import { provide } from 'vue';
import { useInertiaForm } from '../../composables/useInertiaForm';
import { INERTIA_FORM_KEY } from './keys';
import type { InertiaFormOptions } from '../../types';

interface InertiaFormProps {
  /**
   * Initial form data. Treated as initial values only — changes to this prop
   * after mount will not reinitialize the form. Use a `:key` on the component
   * to force remount if the initial data needs to change.
   */
  data: Record<string, unknown>;
  /** HTTP method for the form submission. */
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** URL to submit the form to. */
  action?: string;
  /** Form options passed to `useInertiaForm`. */
  options?: InertiaFormOptions;
}

const props = withDefaults(defineProps<InertiaFormProps>(), {
  method: 'post',
});

const emit = defineEmits<{
  success: [];
  error: [];
}>();

const { form, getError, clearErrors, processing, recentlySuccessful, isDirty, submit } =
  useInertiaForm(props.data, props.options);

provide(INERTIA_FORM_KEY, {
  form: form as Record<string, unknown>,
  getError,
  clearErrors,
  processing,
});

function handleSubmit() {
  if (!props.action) return;

  submit(props.method, props.action, {
    onSuccess: () => emit('success'),
    onError: () => emit('error'),
  });
}

defineExpose({ form, getError, clearErrors, processing, recentlySuccessful, isDirty, submit });
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <slot
      :form="form"
      :get-error="getError"
      :clear-errors="clearErrors"
      :processing="processing"
      :recently-successful="recentlySuccessful"
      :is-dirty="isDirty"
      :submit="submit"
    />
  </form>
</template>

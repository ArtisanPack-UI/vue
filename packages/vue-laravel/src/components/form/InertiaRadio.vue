<script setup lang="ts">
/**
 * @module InertiaRadio
 *
 * Wraps the ArtisanPack UI Radio component with automatic Inertia validation
 * error binding.
 */
import { computed, inject } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Radio } from '@artisanpack-ui/vue';
import { INERTIA_FORM_KEY } from './keys';
import type { SharedPageProps } from '../../types';

const props = defineProps<{
  /** Field name matching the Inertia form data key and Laravel validation key. */
  name: string;
  /** Explicit error message. Overrides auto-resolved errors. */
  error?: string;
}>();

const model = defineModel<string>();

const formContext = inject(INERTIA_FORM_KEY, null);
const page = usePage<SharedPageProps>();

const resolvedError = computed(() => {
  if (props.error) return props.error;
  if (formContext) return formContext.getError(props.name);
  return page.props.errors?.[props.name];
});
</script>

<template>
  <Radio v-bind="{ ...$attrs, name, error: resolvedError }" v-model="model" />
</template>

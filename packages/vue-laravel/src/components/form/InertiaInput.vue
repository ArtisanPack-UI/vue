<script setup lang="ts">
/**
 * @module InertiaInput
 *
 * Wraps the ArtisanPack UI Input component. When used inside an InertiaForm,
 * automatically binds validation errors from the Inertia form context.
 */
import { computed, inject } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Input } from '@artisanpack-ui/vue';
import { INERTIA_FORM_KEY } from './keys';
import type { SharedPageProps } from '../../types';

const props = defineProps<{
  /** Field name matching the Inertia form data key and Laravel validation key. */
  name: string;
  /** Explicit error message. Overrides auto-resolved errors. */
  error?: string;
}>();

const model = defineModel<string>();
const emit = defineEmits<{ clear: [] }>();

const formContext = inject(INERTIA_FORM_KEY, null);
const page = usePage<SharedPageProps>();

const resolvedError = computed(() => {
  if (props.error !== undefined) return props.error;
  if (formContext) return formContext.getError(props.name);
  return page.props.errors?.[props.name];
});
</script>

<template>
  <Input v-bind="{ ...$attrs, name, error: resolvedError }" v-model="model" @clear="emit('clear')">
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.iconRight" #iconRight><slot name="iconRight" /></template>
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template v-if="$slots.suffix" #suffix><slot name="suffix" /></template>
  </Input>
</template>

<script setup lang="ts">
/**
 * @module ErrorDisplay
 *
 * @deprecated Use `ErrorState` (#60). This wrapper keeps the 2.x API and
 * renders an ErrorState: `message` (then the default slot) → description,
 * `retryable` + `retryLabel` → a Try again button in the actions that
 * emits `retry`, the `icon` slot → the icon.
 */
import ErrorState from '../ErrorState/ErrorState.vue';
import Button from '../../form/Button/Button.vue';
import { warnOnce } from '../../_shared/design-system';
import { useTranslator } from '../../../i18n/translator';
import type { ErrorDisplayProps } from './types';

withDefaults(defineProps<ErrorDisplayProps>(), {
  title: undefined,
  message: undefined,
  retryable: false,
  retryLabel: undefined,
  className: undefined,
});

const emit = defineEmits<{
  retry: [];
}>();

warnOnce('ErrorDisplay', 'ErrorDisplay is deprecated; use ErrorState.');

const { t } = useTranslator();
</script>

<template>
  <ErrorState :title="title ?? t('Something went wrong')" :description="message" :class="className">
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.default" #default>{{ message }}<slot /></template>
    <template v-if="retryable" #actions>
      <Button leading-icon="refresh-cw" @click="emit('retry')">{{
        retryLabel ?? t('Try again')
      }}</Button>
    </template>
  </ErrorState>
</template>

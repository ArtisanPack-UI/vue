<script setup lang="ts">
/** @module Code */
import { computed, ref, onUnmounted } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { CodeProps } from './types';

const props = withDefaults(defineProps<CodeProps>(), {
  copyable: false,
  inline: false,
  lineNumbers: false,
});

const emit = defineEmits<{
  'copy-failed': [error: unknown];
}>();

const copied = ref(false);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout);
});

const wrapperClasses = computed(() =>
  cn('mockup-code', !props.inline && 'relative', props.className),
);

const lines = computed(() => (props.code ?? '').split('\n'));

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.code ?? '');
    copied.value = true;
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    emit('copy-failed', err);
  }
}
</script>

<template>
  <code v-if="inline" class="badge badge-ghost font-mono text-sm">{{ code }}</code>
  <div v-else :class="wrapperClasses">
    <div v-if="language" class="absolute right-2 top-2 text-xs opacity-50">
      {{ language }}
    </div>
    <button
      v-if="copyable"
      type="button"
      class="btn btn-ghost btn-xs absolute right-2 top-8"
      :aria-label="copied ? 'Copied' : 'Copy code'"
      @click="copyToClipboard"
    >
      {{ copied ? '✓' : 'Copy' }}
    </button>
    <pre
      v-for="(line, index) in lines"
      :key="index"
      :data-prefix="lineNumbers ? index + 1 : undefined"
    ><code>{{ line }}</code></pre>
  </div>
</template>

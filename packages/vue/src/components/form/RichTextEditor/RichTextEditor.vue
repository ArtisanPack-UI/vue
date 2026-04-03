<script setup lang="ts">
/** @module RichTextEditor */
import { computed, onMounted, ref, useId, watch } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { RichTextEditorProps } from './types';

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  minHeight: '200px',
});

const model = defineModel<string>({ default: '' });

const editorRef = ref<HTMLDivElement | null>(null);
const isInternalUpdate = ref(false);

const autoId = useId();
const editorId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${editorId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${editorId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);

function handleInput(e: Event) {
  isInternalUpdate.value = true;
  model.value = (e.target as HTMLDivElement).innerHTML;
}

// Sync external value changes without resetting cursor
watch(
  () => model.value,
  (newValue) => {
    if (isInternalUpdate.value) {
      isInternalUpdate.value = false;
      return;
    }
    if (editorRef.value && newValue !== undefined && editorRef.value.innerHTML !== newValue) {
      editorRef.value.innerHTML = newValue;
    }
  },
);

onMounted(() => {
  if (editorRef.value && model.value) {
    editorRef.value.innerHTML = model.value;
  }
});
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>
    <div :class="cn('border rounded-lg overflow-hidden', error && 'border-error')">
      <div v-if="$slots.toolbar" class="flex flex-wrap gap-1 p-2 border-b bg-base-200">
        <slot name="toolbar" />
      </div>
      <div
        :id="editorId"
        ref="editorRef"
        :contenteditable="!disabled"
        role="textbox"
        aria-multiline="true"
        :aria-label="label"
        :aria-invalid="error ? true : undefined"
        :aria-required="required || undefined"
        :aria-describedby="describedBy"
        :class="
          cn('p-4 outline-none prose max-w-none', disabled && 'opacity-50 cursor-not-allowed')
        "
        :style="{ minHeight }"
        @input="handleInput"
      />
    </div>
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>

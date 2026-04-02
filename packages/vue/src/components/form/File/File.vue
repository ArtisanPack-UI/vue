/** @module File */
<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { FileProps } from './types';

const props = withDefaults(defineProps<FileProps>(), {
  withDragDrop: false,
  dragDropText: 'Drop files here or click to browse',
  hideProgress: false,
});

const emit = defineEmits<{
  filesSelected: [files: FileList | null];
}>();

const isDragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const hintId = computed(() => (props.hint && !props.error ? `${inputId.value}-hint` : undefined));
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined));
const describedBy = computed(
  () => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined,
);

function handleDragOver(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer?.files.length) {
    emit('filesSelected', e.dataTransfer.files);
  }
}

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('filesSelected', target.files);
}

function openFilePicker() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function handleKeyDown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openFilePicker();
  }
}
</script>

<template>
  <fieldset class="fieldset">
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </legend>

    <template v-if="withDragDrop">
      <div
        :class="
          cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary',
            error && 'border-error',
            dragDropClass,
          )
        "
        role="button"
        :tabindex="disabled ? -1 : 0"
        :aria-label="label ?? 'File upload'"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        :aria-disabled="disabled || undefined"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @click="openFilePicker"
        @keydown="handleKeyDown"
      >
        <input
          :id="inputId"
          ref="inputRef"
          type="file"
          class="hidden"
          :required="required"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :aria-invalid="error ? true : undefined"
          :aria-describedby="describedBy"
          @change="handleChange"
        />
        <p class="opacity-60">{{ dragDropText }}</p>
      </div>
    </template>

    <template v-else>
      <input
        :id="inputId"
        ref="inputRef"
        type="file"
        :class="cn('file-input w-full', error && 'file-input-error')"
        :required="required"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        @change="handleChange"
      />
    </template>

    <progress
      v-if="!hideProgress && progress !== undefined && progress > 0"
      class="progress progress-primary w-full mt-2"
      :value="progress"
      :max="100"
      aria-label="Upload progress"
    />
    <p v-if="hint && !error" :id="hintId" class="fieldset-label">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="fieldset-label text-error" role="alert">{{ error }}</p>
  </fieldset>
</template>

<script setup lang="ts">
/**
 * @module File
 *
 * Uploads files by dropping or browsing: a native file input transparent
 * over a drop zone, and the list of chosen files with their size, progress,
 * errors and a remove button. Renders the design-system File markup
 * contract (`.apui-file`, #53). Exported as `File`; `FileUpload` stays as a
 * deprecated alias.
 */
import { mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import { fillTemplate } from '../../_shared/choice';
import Button from '../Button/Button.vue';
import type { FileEntry, FileItem, FileProps } from './types';

defineOptions({ name: 'ApuiFile', inheritAttrs: false });

const props = withDefaults(defineProps<FileProps>(), {
  label: undefined,
  title: 'Drop files here or browse',
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  accept: undefined,
  multiple: false,
  maxSize: undefined,
  variant: 'dropzone',
  modelValue: undefined,
  removeLabel: 'Remove :name',
  classes: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [files: FileItem[]];
  remove: [file: FileItem, index: number];
}>();

const attrs = useAttrs();
const autoId = useId();
const control = ref<HTMLInputElement | null>(null);
const dragging = ref(false);
let depth = 0;

const files = ref<FileItem[]>(props.modelValue ?? []);
watch(
  () => props.modelValue,
  (value) => {
    files.value = value ?? [];
  },
);

/** A size as text: `2.4 MB`, decimal units, one decimal place. */
function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1000 && unit < units.length - 1) {
    size /= 1000;
    unit += 1;
  }
  return `${unit === 0 ? Math.trunc(size) : Math.round(size * 10) / 10} ${units[unit]}`;
}

function fieldId(): string {
  return typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : autoId;
}

const hasHint = () => props.hint !== undefined && props.hint !== '';
const hasError = () => props.error !== undefined && props.error !== '';
const isInvalid = () => props.invalid || hasError();
const entry = (file: FileItem) => file as FileEntry;

function commit(next: FileItem[]): void {
  files.value = next;
  emit('update:modelValue', next);
}

function onChange(event: Event): void {
  commit(Array.from((event.target as HTMLInputElement).files ?? []));
}

function remove(index: number): void {
  const file = files.value[index]!;
  emit('remove', file, index);
  const next = files.value.filter((_, position) => position !== index);
  // Keep the native input's FileList in step, where the browser allows it.
  if (control.value && typeof DataTransfer !== 'undefined') {
    const transfer = new DataTransfer();
    for (const item of next) {
      if (typeof globalThis.File !== 'undefined' && item instanceof globalThis.File) {
        transfer.items.add(item);
      }
    }
    control.value.files = transfer.files;
  }
  commit(next);
}

function onDragEnter(): void {
  depth += 1;
  dragging.value = true;
}

function onDragLeave(): void {
  depth = Math.max(0, depth - 1);
  if (depth === 0) dragging.value = false;
}

function onDrop(): void {
  depth = 0;
  dragging.value = false;
}

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-file', attrs.class, props.classes?.root],
    'data-variant': props.variant,
    'data-max-size': props.maxSize,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
  };
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const ids = [
    hasHint() ? `${id}-hint` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const own: Record<string, unknown> = {
    ...part('file', 'control', props.classes?.control),
    type: 'file',
    id,
    accept: props.accept,
    multiple: props.multiple || undefined,
    disabled: props.disabled || undefined,
    required: props.required || undefined,
    'aria-labelledby': props.label ? undefined : `${id}-title`,
    'aria-describedby': ids.length ? ids.join(' ') : undefined,
    onChange,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('file', 'label', classes?.label)" :for="fieldId()">
      {{ label
      }}<span
        v-if="required"
        v-bind="part('file', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      >
    </label>
    <div
      v-bind="
        part('file', 'dropzone', classes?.dropzone, { 'data-state': dragging ? 'drag' : undefined })
      "
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input ref="control" v-bind="controlAttrs()" />
      <span v-bind="part('file', 'icon', classes?.icon, { 'aria-hidden': 'true' })">
        <DsIcon :name="variant === 'compact' ? 'file-text' : 'cloud-upload'" />
      </span>
      <p v-bind="part('file', 'title', classes?.title)" :id="`${fieldId()}-title`">{{ title }}</p>
      <p v-if="hasHint()" v-bind="part('file', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
        {{ hint }}
      </p>
    </div>
    <ul v-if="files.length" v-bind="part('file', 'list', classes?.list)">
      <li
        v-for="(file, index) in files"
        :key="`${file.name}-${index}`"
        v-bind="
          part('file', 'item', classes?.item, {
            'data-state': entry(file).error ? 'error' : undefined,
          })
        "
      >
        <span v-bind="part('file', 'thumb', classes?.thumb, { 'aria-hidden': 'true' })">
          <DsIcon :name="entry(file).error ? 'circle-alert' : 'file-text'" />
        </span>
        <span v-bind="part('file', 'name', classes?.name)">{{ file.name }}</span>
        <span v-bind="part('file', 'actions', classes?.actions)">
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            icon-only
            leading-icon="x"
            :aria-label="fillTemplate(removeLabel, { name: file.name })"
            :disabled="disabled"
            @click="remove(index)"
          />
        </span>
        <progress
          v-if="entry(file).progress !== undefined && !entry(file).error"
          v-bind="part('file', 'progress', classes?.progress)"
          max="100"
          :value="entry(file).progress"
          :aria-label="file.name"
        >
          {{ entry(file).progress }}%
        </progress>
        <span v-else v-bind="part('file', 'meta', classes?.meta)">
          <template v-if="entry(file).error"
            ><DsIcon name="circle-alert" />{{ entry(file).error }}</template
          >
          <template v-else-if="file.size !== undefined">{{ formatSize(file.size) }}</template>
        </span>
      </li>
    </ul>
    <p v-if="hasError()" v-bind="part('file', 'error', classes?.error)" :id="`${fieldId()}-error`">
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>

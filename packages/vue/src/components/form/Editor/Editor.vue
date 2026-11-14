<script setup lang="ts">
/**
 * @module Editor
 *
 * @deprecated Use CodeEditor, the design-system replacement (#53). Editor
 * is a thin alias that renders a CodeEditor: its 2.x props (`label`,
 * `hint`, `error`, `required`, `placeholder`, `rows`, `disabled`,
 * `readonly`) carry over, `id` goes to the textarea and `v-model` binds the
 * code. Every other attribute, including CodeEditor's own props, passes
 * through.
 */
import CodeEditor from '../CodeEditor/CodeEditor.vue';
import { warnOnce } from '../../_shared/design-system';
import type { EditorProps } from './types';

withDefaults(defineProps<EditorProps>(), {
  label: undefined,
  hint: undefined,
  error: undefined,
  id: undefined,
  required: false,
  placeholder: undefined,
  rows: 12,
  disabled: false,
  readonly: false,
});

const model = defineModel<string>();

warnOnce('Editor', 'Editor is deprecated; use CodeEditor.');
</script>

<template>
  <CodeEditor
    v-model="model"
    :id="id"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<script setup lang="ts">
/**
 * @module Code
 *
 * Read-only code: a block with a header (file name, language, copy) and
 * optional line numbers and highlighted lines, or inline. Renders the
 * design-system Code markup contract (`.apui-code`, #65) with the lines from
 * the behavior package's `codeLines`, the same ones Blade and React render.
 * No syntax highlighting. The copy button runs on `useClipboard`, as
 * Clipboard does. The code stays LTR (D-004).
 */
import {
  CLIPBOARD_LABELS,
  clipboardLabel,
  clipboardMessage,
  codeHighlights,
  codeLabel,
  codeLines,
} from '@artisanpack-ui/behavior';
import { useClipboard } from '@artisanpack-ui/behavior/vue';
import { computed } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { CodeProps } from './types';

const props = withDefaults(defineProps<CodeProps>(), {
  code: undefined,
  language: undefined,
  fileName: undefined,
  numbered: false,
  highlight: undefined,
  inline: false,
  copyable: true,
  label: undefined,
  copyLabel: CLIPBOARD_LABELS.copy,
  copiedLabel: CLIPBOARD_LABELS.copied,
  copiedMessage: CLIPBOARD_LABELS.copiedMessage,
  errorMessage: CLIPBOARD_LABELS.errorMessage,
  classes: undefined,
});

const clipboard = useClipboard();
const status = computed(() => clipboard.status.value);
const filled = (value: unknown): boolean => value !== undefined && value !== null && value !== '';
const lines = computed(() => codeLines(props.code));
const highlighted = computed(() => codeHighlights(props.highlight));
const hasHeader = computed(
  () => filled(props.fileName) || filled(props.language) || props.copyable,
);
const labels = computed(() => ({
  copy: props.copyLabel,
  copied: props.copiedLabel,
  copiedMessage: props.copiedMessage,
  errorMessage: props.errorMessage,
}));
const regionLabel = computed(() => codeLabel(props.label, props.fileName, props.language));

function copy() {
  void clipboard.copy(lines.value.join('\n'));
}
</script>

<template>
  <code
    v-if="inline"
    :class="['apui-code', classes?.root]"
    data-scope="code"
    data-part="root"
    data-inline=""
    >{{ code }}</code
  >
  <div
    v-else
    :class="['apui-code', classes?.root]"
    data-scope="code"
    data-part="root"
    :data-numbered="flag(numbered)"
  >
    <div v-if="hasHeader" v-bind="part('code', 'header', classes?.header)">
      <span v-if="filled(fileName)" v-bind="part('code', 'file', classes?.file)">{{
        fileName
      }}</span>
      <span
        v-if="filled(language)"
        :class="['apui-badge', classes?.language]"
        data-scope="code"
        data-part="language"
        data-color="neutral"
        data-variant="outline"
        data-size="sm"
        >{{ language }}</span
      >
      <template v-if="copyable">
        <button
          type="button"
          :class="['apui-button', classes?.copy]"
          data-scope="code"
          data-part="copy"
          data-variant="ghost"
          data-color="neutral"
          data-size="xs"
          :data-state="status"
          @click="copy"
        >
          <span data-scope="button" data-part="icon" aria-hidden="true"
            ><DsIcon :name="status === 'copied' ? 'check' : 'copy'"
          /></span>
          <span data-scope="button" data-part="label">{{ clipboardLabel(status, labels) }}</span>
        </button>
        <span
          :class="['apui-sr-only', classes?.status]"
          data-scope="code"
          data-part="status"
          role="status"
          >{{ clipboardMessage(status, labels) }}</span
        >
      </template>
    </div>
    <pre
      v-bind="part('code', 'pre', classes?.pre)"
      role="region"
      :aria-label="regionLabel"
      tabindex="0"
    ><code><span
      v-for="(line, index) in lines"
      :key="index"
      v-bind="part('code', 'line', classes?.line, { 'data-n': index + 1, 'data-highlight': flag(highlighted.has(index + 1)) })"
    >{{ line }}</span></code></pre>
  </div>
</template>

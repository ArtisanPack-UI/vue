<script setup lang="ts">
/**
 * @module Markdown
 *
 * The design-system Markdown (#65): GitHub-flavored Markdown in the shared
 * `.apui-prose` styles, rendering the `.apui-markdown` markup contract. The
 * HTML comes from the behavior package's `renderMarkdown`, the same HTML
 * Blade writes with league/commonmark and React with the same helper: raw
 * HTML is escaped (or, with `:sanitize="false"`, filtered to formatting
 * tags) and unsafe link and image URLs are dropped. `mode="write"` or
 * `"split"` adds Write, Preview and Split tabs over a Textarea.
 */
import { MARKDOWN_LABELS, renderMarkdown, type MarkdownMode } from '@artisanpack-ui/behavior';
import { computed, ref, watch } from 'vue';
import { part } from '../../_shared/design-system';
import Textarea from '../../form/Textarea/Textarea.vue';
import Tab from '../../layout/Tabs/Tab.vue';
import Tabs from '../../layout/Tabs/Tabs.vue';
import type { MarkdownEmits, MarkdownProps } from './types';

const props = withDefaults(defineProps<MarkdownProps>(), {
  source: undefined,
  content: undefined,
  mode: 'preview',
  sanitize: true,
  tabsLabel: MARKDOWN_LABELS.tabs,
  writeLabel: MARKDOWN_LABELS.write,
  previewLabel: MARKDOWN_LABELS.preview,
  splitLabel: MARKDOWN_LABELS.split,
  editorLabel: MARKDOWN_LABELS.editor,
  outputLabel: MARKDOWN_LABELS.output,
  classes: undefined,
});

const emit = defineEmits<MarkdownEmits>();

const given = computed(() => props.source ?? props.content ?? '');
const editing = computed(() => props.mode === 'write' || props.mode === 'split');

/** The editor's draft: follows `source`, and typing when nothing binds it. */
const draft = ref(given.value);
watch(given, (value) => {
  draft.value = value;
});

/** The selected tab: opens on `mode`, and follows a new one. */
const view = ref<MarkdownMode>(props.mode);
watch(
  () => props.mode,
  (value) => {
    view.value = value;
  },
);

const html = computed(() =>
  renderMarkdown(editing.value ? draft.value : given.value, { sanitize: props.sanitize }),
);

function change(value: string): void {
  draft.value = value;
  emit('source-change', value);
  emit('update:source', value);
}

function select(value: string): void {
  view.value = value as MarkdownMode;
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- renderMarkdown escapes or filters raw HTML and drops unsafe URLs -->
  <div
    v-if="!editing"
    :class="['apui-markdown', 'apui-prose', classes?.root]"
    data-mode="preview"
    v-html="html"
  />
  <div v-else :class="['apui-markdown', classes?.root]" :data-mode="mode">
    <Tabs size="sm" :label="tabsLabel" :model-value="view" @update:model-value="select">
      <!-- Only the selected tab's panel holds content, so the source has one Textarea. -->
      <Tab
        v-for="tab in ['write', 'preview', 'split'] as const"
        :key="tab"
        :value="tab"
        :label="tab === 'write' ? writeLabel : tab === 'preview' ? previewLabel : splitLabel"
      >
        <template v-if="view === tab">
          <div v-if="tab === 'split'" v-bind="part('markdown', 'split', classes?.split)">
            <div v-bind="part('markdown', 'editor', classes?.editor)">
              <Textarea
                :aria-label="editorLabel"
                dir="auto"
                :model-value="draft"
                :rows="12"
                @update:model-value="change"
              />
            </div>
            <div
              v-bind="
                part(
                  'markdown',
                  'preview',
                  classes?.preview ? `apui-prose ${classes.preview}` : 'apui-prose',
                  { role: 'region', 'aria-label': outputLabel },
                )
              "
              v-html="html"
            />
          </div>
          <div v-else-if="tab === 'write'" v-bind="part('markdown', 'editor', classes?.editor)">
            <Textarea
              :aria-label="editorLabel"
              dir="auto"
              :model-value="draft"
              :rows="12"
              @update:model-value="change"
            />
          </div>
          <div
            v-else
            v-bind="
              part(
                'markdown',
                'preview',
                classes?.preview ? `apui-prose ${classes.preview}` : 'apui-prose',
                { role: 'region', 'aria-label': outputLabel },
              )
            "
            v-html="html"
          />
        </template>
      </Tab>
    </Tabs>
  </div>
</template>

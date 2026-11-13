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
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue';
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

/**
 * Whether the parent owns the source: it passes `source` and listens for the
 * edit (`v-model:source` or `@source-change`), so an edit it rejects never
 * shows. Otherwise the editor keeps its own draft. A listener bound to
 * nothing (`@source-change="undefined"`) is no listener.
 */
const instance = getCurrentInstance();
function isControlled(): boolean {
  const raw = instance?.vnode.props;
  if (!raw || !('source' in raw)) return false;
  return [raw['onUpdate:source'], raw.onSourceChange, raw['onSource-change']].some(
    (listener) => typeof listener === 'function' || Array.isArray(listener),
  );
}

/**
 * The source every mode shows: the parent's when it owns it, else the draft,
 * which follows a new source, so an edit made in write mode still shows when
 * the parent switches to preview. Read lazily: nothing renders the HTML while
 * only the Write tab shows.
 */
const text = computed(() => (isControlled() ? given.value : draft.value));
const html = computed(() => renderMarkdown(text.value, { sanitize: props.sanitize }));

/**
 * The Textarea's value. It follows `text`, and takes each edit as typed: the
 * Textarea keeps what was typed until its value changes, so an edit the
 * parent rejects is put back by moving this to the edit and back again.
 */
const editorValue = ref(text.value);
watch(text, (value) => {
  editorValue.value = value;
});

function change(value: string): void {
  draft.value = value;
  editorValue.value = value;
  emit('source-change', value);
  emit('update:source', value);
  void nextTick(() => {
    editorValue.value = text.value;
  });
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
                :model-value="editorValue"
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
              :model-value="editorValue"
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

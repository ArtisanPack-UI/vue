<script setup lang="ts">
/**
 * @module RichTextEditor
 *
 * Formatted text editing with a toolbar over the shared prose styles.
 * Renders the design-system RichTextEditor markup contract
 * (`.apui-rich-text-editor`, #53) on the behavior engine's built-in
 * contentEditable engine. Livewire runs TinyMCE behind the same toolbar
 * instead (D-003).
 */
import {
  countLabel,
  RICH_TEXT_COMMANDS,
  resolveToolbar,
  richTextFromHtml,
  richTextToHtml,
  richTextTranslations,
  RichTextSurface,
  rovingKeydown,
  safeImageUrl,
  safeLinkUrl,
  syncRovingTabIndex,
  type RichTextCommand,
} from '@artisanpack-ui/behavior';
import { computed, mergeProps, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { RichTextEditorEmits, RichTextEditorProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  toolbar: 'default',
  output: 'html',
  maxLength: undefined,
  counter: false,
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  toolbarLabel: undefined,
  boldLabel: undefined,
  italicLabel: undefined,
  underlineLabel: undefined,
  strikeLabel: undefined,
  heading2Label: undefined,
  heading3Label: undefined,
  bulletListLabel: undefined,
  orderedListLabel: undefined,
  quoteLabel: undefined,
  codeLabel: undefined,
  linkLabel: undefined,
  imageLabel: undefined,
  undoLabel: undefined,
  redoLabel: undefined,
  linkPromptLabel: undefined,
  imagePromptLabel: undefined,
  imageAltPromptLabel: undefined,
  shortcutsLabel: undefined,
  wordLabel: undefined,
  wordsLabel: undefined,
  characterLabel: undefined,
  charactersLabel: undefined,
  limitLabel: undefined,
  classes: undefined,
});

const emit = defineEmits<RichTextEditorEmits>();

const attrs = useAttrs();
const autoId = useId();

const strings = computed(() =>
  richTextTranslations({
    toolbar: props.toolbarLabel,
    bold: props.boldLabel,
    italic: props.italicLabel,
    underline: props.underlineLabel,
    strike: props.strikeLabel,
    heading2: props.heading2Label,
    heading3: props.heading3Label,
    bulletList: props.bulletListLabel,
    orderedList: props.orderedListLabel,
    quote: props.quoteLabel,
    code: props.codeLabel,
    link: props.linkLabel,
    image: props.imageLabel,
    undo: props.undoLabel,
    redo: props.redoLabel,
    linkPrompt: props.linkPromptLabel,
    imagePrompt: props.imagePromptLabel,
    imageAltPrompt: props.imageAltPromptLabel,
    shortcuts: props.shortcutsLabel,
    word: props.wordLabel,
    words: props.wordsLabel,
    character: props.characterLabel,
    characters: props.charactersLabel,
    limit: props.limitLabel,
  }),
);
const items = computed(() => resolveToolbar(props.toolbar, props.output));
const firstButton = computed(() => items.value.find((item) => item !== '|'));
const editable = computed(() => !props.disabled && !props.readonly);
const value = ref(props.modelValue ?? '');
const active = ref<Partial<Record<RichTextCommand, boolean>>>({});
const text = ref('');
const empty = ref(!props.modelValue);
const content = ref<HTMLElement | null>(null);
const toolbarEl = ref<HTMLElement | null>(null);
let surface: RichTextSurface | undefined;
let emitted: string | null = null;

const count = computed(() => countLabel(text.value, strings.value, props.maxLength));
const hasFooter = computed(() => props.counter || typeof props.maxLength === 'number');

function baseId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function hasText(value: string | undefined): boolean {
  return value !== undefined && value !== '';
}

function isInvalid(): boolean {
  return props.invalid || hasText(props.error);
}

function describedBy(): string | undefined {
  const own = attrs['aria-describedby'];
  const ids = [
    hasText(props.hint) ? `${baseId()}-hint` : undefined,
    hasText(props.error) ? `${baseId()}-error` : undefined,
    typeof own === 'string' && own !== '' ? own : undefined,
  ].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function rootAttrs(): Record<string, unknown> {
  const { class: _class, id: _id, name: _name, 'aria-describedby': _describedBy, ...rest } = attrs;
  return mergeProps(rest, {
    class: ['apui-rich-text-editor', attrs.class, props.classes?.root],
    id: baseId(),
    'data-output': props.output,
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
  });
}

function measure(): void {
  const root = content.value;
  if (!root) return;
  text.value = root.textContent ?? '';
  empty.value = text.value.trim() === '' && !root.querySelector('img');
}

function commit(html: string): void {
  measure();
  const next = richTextFromHtml(html, props.output);
  if (next === value.value) return;
  emitted = next;
  value.value = next;
  emit('update:modelValue', next);
}

function refresh(): void {
  const next: Partial<Record<RichTextCommand, boolean>> = {};
  for (const command of surface?.active() ?? []) next[command] = true;
  active.value = next;
}

function run(command: RichTextCommand): void {
  if (!editable.value || !surface) return;
  if (command === 'link') {
    const url = active.value.link ? '' : window.prompt(strings.value.linkPrompt, 'https://');
    if (url === null) return;
    surface.run('link', safeLinkUrl(url) ?? '');
    return;
  }
  if (command === 'image') {
    const src = safeImageUrl(window.prompt(strings.value.imagePrompt, 'https://'));
    if (!src) return;
    surface.run('image', { src, alt: window.prompt(strings.value.imageAltPrompt, '') ?? '' });
    return;
  }
  surface.run(command);
}

function onToolbarKeydown(event: KeyboardEvent): void {
  if (toolbarEl.value) rovingKeydown(event, toolbarEl.value, '[data-part="button"]');
}

onMounted(() => {
  if (!content.value) return;
  surface = new RichTextSurface(content.value, {
    onChange: commit,
    onSelectionChange: refresh,
    onLinkShortcut: () => run('link'),
    canEdit: () => !props.disabled && !props.readonly,
    maxLength: () => props.maxLength,
  });
  surface.setHtml(richTextToHtml(value.value, props.output));
  measure();
});

onBeforeUnmount(() => {
  surface?.destroy();
  surface = undefined;
});

watch(
  () => props.modelValue,
  (next) => {
    const incoming = next ?? '';
    if (incoming === emitted) return;
    emitted = null;
    value.value = incoming;
    surface?.setHtml(richTextToHtml(incoming, props.output));
    measure();
  },
);

function contentAttrs(): Record<string, unknown> {
  return {
    ...part('rich-text-editor', 'content', props.classes?.content),
    id: `${baseId()}-content`,
    contenteditable: editable.value ? 'true' : 'false',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-labelledby': hasText(props.label) ? `${baseId()}-label` : undefined,
    'aria-describedby': describedBy(),
    'aria-invalid': isInvalid() ? 'true' : undefined,
    'aria-required': props.required ? 'true' : undefined,
    'aria-readonly': props.readonly ? 'true' : undefined,
    'aria-disabled': props.disabled ? 'true' : undefined,
    'aria-placeholder': hasText(props.placeholder) ? props.placeholder : undefined,
  };
}

function buttonAttrs(command: RichTextCommand): Record<string, unknown> {
  return {
    ...part('rich-text-editor', 'button', props.classes?.button),
    id: `${baseId()}-${command}`,
    type: 'button',
    'data-command': command,
    'aria-label': strings.value[command],
    'aria-pressed': RICH_TEXT_COMMANDS[command].toggle
      ? active.value[command]
        ? 'true'
        : 'false'
      : undefined,
    tabindex: command === firstButton.value ? '0' : '-1',
    disabled: editable.value ? undefined : true,
  };
}

function hiddenAttrs(): Record<string, unknown> {
  return { type: 'hidden', name: attrs.name, value: value.value };
}

watch(items, () => {
  if (toolbarEl.value) syncRovingTabIndex(toolbarEl.value, '[data-part="button"]');
});
</script>

<template>
  <div v-bind="rootAttrs()">
    <span
      v-if="label"
      v-bind="part('rich-text-editor', 'label', classes?.label)"
      :id="`${baseId()}-label`"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('rich-text-editor', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></span
    >
    <div v-bind="part('rich-text-editor', 'box', classes?.box)" :id="`${baseId()}-box`">
      <div
        ref="toolbarEl"
        v-bind="part('rich-text-editor', 'toolbar', classes?.toolbar)"
        :id="`${baseId()}-toolbar`"
        role="toolbar"
        :aria-label="strings.toolbar"
        :aria-controls="`${baseId()}-content`"
        @keydown="onToolbarKeydown"
      >
        <template v-for="(item, index) in items" :key="`${item}-${index}`">
          <span
            v-if="item === '|'"
            v-bind="part('rich-text-editor', 'divider', classes?.divider)"
            role="separator"
            aria-orientation="vertical"
          ></span>
          <button v-else v-bind="buttonAttrs(item)" @mousedown.prevent @click="run(item)">
            <DsIcon :name="RICH_TEXT_COMMANDS[item].icon" />
          </button>
        </template>
      </div>
      <div ref="content" v-bind="contentAttrs()"></div>
      <p
        v-if="placeholder"
        v-bind="
          part('rich-text-editor', 'placeholder', classes?.placeholder, { 'aria-hidden': 'true' })
        "
        :hidden="!empty || undefined"
      >
        {{ placeholder }}
      </p>
      <div v-if="hasFooter" v-bind="part('rich-text-editor', 'footer', classes?.footer)">
        <span>{{ strings.shortcuts }}</span>
        <span v-bind="part('rich-text-editor', 'count', classes?.count)">{{ count }}</span>
      </div>
    </div>
    <input v-bind="hiddenAttrs()" />
    <p
      v-if="hint"
      v-bind="part('rich-text-editor', 'hint', classes?.hint)"
      :id="`${baseId()}-hint`"
    >
      {{ hint }}
    </p>
    <p
      v-if="error"
      v-bind="part('rich-text-editor', 'error', classes?.error)"
      :id="`${baseId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>

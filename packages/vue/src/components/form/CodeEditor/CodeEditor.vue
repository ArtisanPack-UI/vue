<script setup lang="ts">
/**
 * @module CodeEditor
 *
 * Editable code in a native textarea, with file tabs, a language select,
 * line numbers, diagnostics listed in text and a status bar. Renders the
 * design-system CodeEditor markup contract (`.apui-code-editor`, #53). The
 * code stays left to right in RTL (D-004).
 */
import {
  codeEditorKeydown,
  codeEditorTranslations,
  gutterLines,
  normalizeOptions,
  positionLabel as formatPosition,
  problemsLabel as formatProblems,
  rovingKeydown,
  severityByLine,
} from '@artisanpack-ui/behavior';
import { computed, mergeProps, ref, useAttrs, useId, watch } from 'vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { CodeEditorEmits, CodeEditorProps } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CodeEditorProps>(), {
  language: undefined,
  languages: undefined,
  tabs: undefined,
  tab: undefined,
  diagnostics: undefined,
  tabSize: 2,
  rows: 12,
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  readonly: false,
  required: false,
  placeholder: undefined,
  modelValue: undefined,
  tabsLabel: undefined,
  languageLabel: undefined,
  positionLabel: undefined,
  spacesLabel: undefined,
  errorCountLabel: undefined,
  errorsCountLabel: undefined,
  warningCountLabel: undefined,
  warningsCountLabel: undefined,
  problemsLabel: undefined,
  lineLabel: undefined,
  severityErrorLabel: undefined,
  severityWarningLabel: undefined,
  severityInfoLabel: undefined,
  instructionsLabel: undefined,
  classes: undefined,
});

const emit = defineEmits<CodeEditorEmits>();

const attrs = useAttrs();
const autoId = useId();

const SEVERITY_ICONS = { error: 'circle-alert', warning: 'triangle-alert', info: 'info' } as const;

const strings = computed(() =>
  codeEditorTranslations({
    tabs: props.tabsLabel,
    language: props.languageLabel,
    position: props.positionLabel,
    spaces: props.spacesLabel,
    error: props.errorCountLabel,
    errors: props.errorsCountLabel,
    warning: props.warningCountLabel,
    warnings: props.warningsCountLabel,
    problems: props.problemsLabel,
    line: props.lineLabel,
    severityError: props.severityErrorLabel,
    severityWarning: props.severityWarningLabel,
    severityInfo: props.severityInfoLabel,
    instructions: props.instructionsLabel,
  }),
);
const tabList = computed(() => normalizeOptions(props.tabs));
const languageList = computed(() => normalizeOptions(props.languages));
const diagnosticList = computed(() =>
  (props.diagnostics ?? []).filter(
    (diagnostic) =>
      typeof diagnostic === 'object' &&
      diagnostic !== null &&
      typeof diagnostic.line === 'number' &&
      typeof diagnostic.message === 'string',
  ),
);
const severities = computed(() => severityByLine(diagnosticList.value));
const problems = computed(() => formatProblems(diagnosticList.value, strings.value));

const current = ref(props.modelValue ?? '');
const caret = ref(0);
/** Whether the caret has been placed, so the gutter marks its line. */
const tracked = ref(false);
watch(
  () => props.modelValue,
  (value) => {
    current.value = value ?? '';
  },
);

const selectedTab = ref(props.tab ?? tabList.value[0]?.value);
watch(
  () => [props.tab, tabList.value] as const,
  () => {
    selectedTab.value = props.tab ?? tabList.value[0]?.value;
  },
);

const tabsEl = ref<HTMLElement | null>(null);

const lineTotal = computed(() => gutterLines(current.value, props.rows));
const activeLine = computed(() => current.value.slice(0, caret.value).split('\n').length);
const position = computed(() => formatPosition(current.value, caret.value, strings.value));
const languageText = computed(() => {
  if (!props.language) return undefined;
  return (
    languageList.value.find((option) => option.value === props.language)?.label ?? props.language
  );
});

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

function hasText(value: string | undefined): boolean {
  return value !== undefined && value !== '';
}

function isInvalid(): boolean {
  return props.invalid || hasText(props.error);
}

function rootAttrs(): Record<string, unknown> {
  return {
    class: ['apui-code-editor', attrs.class, props.classes?.root],
    'data-invalid': flag(isInvalid()),
    'data-disabled': flag(props.disabled),
    'data-readonly': flag(props.readonly),
  };
}

function track(event: Event): void {
  const control = event.target as HTMLTextAreaElement;
  caret.value = control.selectionStart ?? 0;
  tracked.value = true;
}

function onInput(event: Event): void {
  const control = event.target as HTMLTextAreaElement;
  current.value = control.value;
  caret.value = control.selectionStart ?? 0;
  tracked.value = true;
  emit('update:modelValue', control.value);
}

function onKeydown(event: KeyboardEvent): void {
  const control = event.target as HTMLTextAreaElement;
  if (codeEditorKeydown(event, control, props.tabSize)) caret.value = control.selectionStart ?? 0;
}

function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': describedBy, ...rest } = attrs;
  const id = fieldId();
  const describedByIds = [
    hasText(props.hint) ? `${id}-hint` : undefined,
    hasText(props.error) ? `${id}-error` : undefined,
    `${id}-instructions`,
    typeof describedBy === 'string' && describedBy !== '' ? describedBy : undefined,
  ].filter(Boolean);
  const own: Record<string, unknown> = {
    ...part('code-editor', 'control', props.classes?.control),
    id,
    rows: lineTotal.value,
    wrap: 'off',
    spellcheck: 'false',
    autocapitalize: 'off',
    autocomplete: 'off',
    placeholder: props.placeholder,
    disabled: props.disabled || undefined,
    readonly: props.readonly || undefined,
    required: props.required || undefined,
    'aria-describedby': describedByIds.join(' '),
    value: current.value,
    onInput,
    onKeydown,
    onKeyup: track,
    onClick: track,
    onFocus: track,
    onSelect: track,
  };
  if (isInvalid()) own['aria-invalid'] = 'true';
  return mergeProps(rest, own);
}

function selectTab(value: string): void {
  if (selectedTab.value === value) return;
  selectedTab.value = value;
  emit('tab-change', value);
}

function onTabsKeydown(event: KeyboardEvent): void {
  if (!tabsEl.value) return;
  const focused = rovingKeydown(event, tabsEl.value, '[data-part="tab"]');
  const value = focused?.getAttribute('data-value');
  if (value) selectTab(value);
}

function onLanguageChange(event: Event): void {
  emit('language-change', (event.target as HTMLSelectElement).value);
}

const selectedIndex = computed(() =>
  tabList.value.findIndex((option) => option.value === selectedTab.value),
);

function bodyAttrs(): Record<string, unknown> {
  const hasTabs = tabList.value.length > 0;
  return {
    ...part('code-editor', 'body', props.classes?.body),
    id: `${fieldId()}-body`,
    dir: 'ltr',
    role: hasTabs ? 'tabpanel' : undefined,
    'aria-labelledby':
      hasTabs && selectedIndex.value >= 0 ? `${fieldId()}-tab-${selectedIndex.value}` : undefined,
  };
}

function lineAttrs(line: number): Record<string, unknown> {
  return part('code-editor', 'line', props.classes?.line, {
    'data-active': flag(tracked.value && line === activeLine.value),
    'data-severity': severities.value.get(line),
  });
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label v-if="label" v-bind="part('code-editor', 'label', classes?.label)" :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('code-editor', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="part('code-editor', 'box', classes?.box)">
      <div
        v-if="tabList.length || languageList.length"
        v-bind="part('code-editor', 'header', classes?.header)"
      >
        <div
          v-if="tabList.length"
          ref="tabsEl"
          v-bind="part('code-editor', 'tabs', classes?.tabs)"
          :id="`${fieldId()}-tabs`"
          role="tablist"
          :aria-label="strings.tabs"
          @keydown="onTabsKeydown"
        >
          <button
            v-for="(item, index) in tabList"
            :key="item.value"
            v-bind="part('code-editor', 'tab', classes?.tab)"
            :id="`${fieldId()}-tab-${index}`"
            type="button"
            role="tab"
            :data-value="item.value"
            :aria-controls="`${fieldId()}-body`"
            :aria-selected="item.value === selectedTab ? 'true' : 'false'"
            :tabindex="item.value === selectedTab ? '0' : '-1'"
            @click="selectTab(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
        <select
          v-if="languageList.length"
          v-bind="part('code-editor', 'languageSelect', classes?.languageSelect)"
          :id="`${fieldId()}-language`"
          :aria-label="strings.language"
          :disabled="disabled || undefined"
          @change="onLanguageChange"
        >
          <option
            v-for="option in languageList"
            :key="option.value"
            :value="option.value"
            :selected="option.value === language || undefined"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <div v-bind="bodyAttrs()">
        <div v-bind="part('code-editor', 'gutter', classes?.gutter, { 'aria-hidden': 'true' })">
          <span v-for="line in lineTotal" :key="line" v-bind="lineAttrs(line)">{{ line }}</span>
        </div>
        <textarea v-bind="controlAttrs()" />
      </div>
      <ul
        v-if="diagnosticList.length"
        v-bind="part('code-editor', 'diagnostics', classes?.diagnostics)"
        :aria-label="strings.problems"
      >
        <li
          v-for="(diagnostic, index) in diagnosticList"
          :key="index"
          v-bind="part('code-editor', 'diagnostic', classes?.diagnostic)"
          :data-severity="diagnostic.severity ?? 'error'"
        >
          <DsIcon :name="SEVERITY_ICONS[diagnostic.severity ?? 'error']" /><span
            class="apui-sr-only"
            >{{
              diagnostic.severity === 'warning'
                ? strings.severityWarning
                : diagnostic.severity === 'info'
                  ? strings.severityInfo
                  : strings.severityError
            }}:</span
          ><span>{{ strings.line.split(':line').join(String(diagnostic.line)) }}</span
          ><span>{{ diagnostic.message }}</span>
        </li>
      </ul>
      <div v-bind="part('code-editor', 'status', classes?.status)">
        <span v-if="problems">{{ problems }}</span>
        <span>{{ position }}</span>
        <span>{{ strings.spaces.split(':count').join(String(Math.max(1, tabSize))) }}</span>
        <span v-if="languageText">{{ languageText }}</span>
      </div>
    </div>
    <span
      data-scope="code-editor"
      data-part="instructions"
      :id="`${fieldId()}-instructions`"
      class="apui-sr-only"
      >{{ strings.instructions }}</span
    >
    <p v-if="hint" v-bind="part('code-editor', 'hint', classes?.hint)" :id="`${fieldId()}-hint`">
      {{ hint }}
    </p>
    <p
      v-if="error"
      v-bind="part('code-editor', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
  </div>
</template>

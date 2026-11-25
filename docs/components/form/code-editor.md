---
title: CodeEditor
menu_order: 40
meta_description: The Vue CodeEditor component. Editable code with file tabs, a language select, line numbers, diagnostics and a status bar, with every prop.
---

# CodeEditor

Editable code in a native `<textarea>`, with line numbers, optional file tabs, a language select, diagnostics listed in text and a status bar. Tab indents instead of leaving the field. Use it for snippets, templates, CSS and other short code people type into a form. It doesn't highlight syntax; to show code read-only, use [Code](../display/code.md).

```ts
import { CodeEditor } from '@artisanpack-ui/vue/form';
// or
import { CodeEditor } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { CodeEditor } from '@artisanpack-ui/vue/form';

const css = ref('.listing-card {\n  border-radius: 8px;\n}');
</script>

<template>
  <CodeEditor v-model="css" label="Custom CSS" language="CSS" name="custom_css" :rows="8" />
</template>
```

The editor shows at least `rows` lines and grows with its content. The gutter, caret position and indentation in the status bar follow the value.

### Indentation

Tab inserts `tabSize` spaces (2 by default). With several lines selected, Tab indents every line and Shift+Tab outdents them. The changes go through the browser's editing commands, so undo works and `update:modelValue` fires. To leave the editor with the keyboard, press Escape, then Tab. Read-only and disabled editors let Tab move focus as usual.

```vue
<template>
  <CodeEditor v-model="script" label="Script" :tab-size="4" />
</template>
```

### Tabs and languages

`tabs` adds a row of file tabs over the code; `tab` is the selected one (the first by default). Selecting a tab only emits `tab-change`: swap the value for that file yourself. `languages` adds a language select; `language` is the selected one and is also shown in the status bar. Choosing one emits `language-change`.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { CodeEditor } from '@artisanpack-ui/vue/form';

const files = ref<Record<string, string>>({
  'index.html': '<main></main>',
  'styles.css': 'main { padding: 1rem; }',
});
const active = ref('index.html');
const language = computed(() => (active.value.endsWith('.css') ? 'css' : 'html'));
</script>

<template>
  <CodeEditor
    v-model="files[active]"
    label="Theme files"
    :tabs="Object.keys(files)"
    :tab="active"
    :language="language"
    :languages="[
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
    ]"
    @tab-change="(value) => (active = value)"
  />
</template>
```

Options for `tabs` and `languages` are strings or `{ value, label }` objects.

### Diagnostics

`diagnostics` marks lines in the gutter and lists each problem under the code with its line and severity, so it isn't shown by color alone. The status bar counts errors and warnings. Severity defaults to `error`.

```vue
<template>
  <CodeEditor
    v-model="css"
    label="Custom CSS"
    language="CSS"
    :diagnostics="[
      { line: 2, column: 18, message: 'Unknown property “colour”.', severity: 'error' },
      { line: 5, message: 'Prefer a design token.', severity: 'warning' },
    ]"
  />
</template>
```

### Hint, error and states

`hint`, `error`, `invalid`, `disabled`, `readonly` and `required` work as on [Input](input.md). `required` shows the `*` mark after the label.

### Translating the built-in text

Every built-in string is a prop: the tablist and language select names, the status bar's position, indentation and counts, the problems list and its line and severity labels, and the keyboard instructions. Each defaults to the translated English text. Placeholders such as `:line`, `:column` and `:count` are filled in for you.

```vue
<template>
  <CodeEditor
    v-model="css"
    label="CSS personnalisé"
    position-label="Ligne :line, colonne :column"
    instructions-label="Tab insère une indentation. Pour quitter l’éditeur, appuyez sur Échap, puis Tab."
  />
</template>
```

## Props

| Prop                   | Type                                      | Default                                                                               | Description                                                                                                                          |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `modelValue`           | `string`                                  | —                                                                                     | The code, bound with `v-model`.                                                                                                      |
| `language`             | `string`                                  | —                                                                                     | The language, shown in the status bar and selected in the language select.                                                           |
| `languages`            | `CodeEditorOption[]`                      | —                                                                                     | Options for the language select. The select renders when there are any.                                                              |
| `tabs`                 | `CodeEditorOption[]`                      | —                                                                                     | File tabs over the code.                                                                                                             |
| `tab`                  | `string`                                  | first tab                                                                             | The selected tab's value.                                                                                                            |
| `diagnostics`          | `CodeDiagnostic[]`                        | —                                                                                     | Problems marked in the gutter and listed in text under the code. Entries without a numeric `line` or a string `message` are ignored. |
| `tabSize`              | `number`                                  | `2`                                                                                   | Spaces Tab inserts.                                                                                                                  |
| `rows`                 | `number`                                  | `12`                                                                                  | The fewest lines shown; the editor grows with its content.                                                                           |
| `label`                | `string`                                  | —                                                                                     | The visible label, linked to the control.                                                                                            |
| `hint`                 | `string`                                  | —                                                                                     | Help text under the editor, linked with `aria-describedby`.                                                                          |
| `error`                | `string`                                  | —                                                                                     | Validation message. Marks the field invalid and is linked with `aria-describedby`.                                                   |
| `invalid`              | `boolean`                                 | `false`                                                                               | Marks the field invalid without a message.                                                                                           |
| `disabled`             | `boolean`                                 | `false`                                                                               | Disables the control and the language select.                                                                                        |
| `readonly`             | `boolean`                                 | `false`                                                                               | Makes the code read-only.                                                                                                            |
| `required`             | `boolean`                                 | `false`                                                                               | Sets `required` on the control and shows the required mark.                                                                          |
| `placeholder`          | `string`                                  | —                                                                                     | Placeholder text. Never a replacement for the label.                                                                                 |
| `tabsLabel`            | `string`                                  | `'Open files'`, translated                                                            | The file tablist's accessible name.                                                                                                  |
| `languageLabel`        | `string`                                  | `'Language'`, translated                                                              | The language select's accessible name.                                                                                               |
| `positionLabel`        | `string`                                  | `'Ln :line, Col :column'`, translated                                                 | The caret position in the status bar.                                                                                                |
| `spacesLabel`          | `string`                                  | `'Spaces: :count'`, translated                                                        | The indentation in the status bar; `:count` is `tabSize`.                                                                            |
| `errorCountLabel`      | `string`                                  | `':count error'`, translated                                                          | The status bar's count for one error.                                                                                                |
| `errorsCountLabel`     | `string`                                  | `':count errors'`, translated                                                         | The status bar's count for several errors.                                                                                           |
| `warningCountLabel`    | `string`                                  | `':count warning'`, translated                                                        | The status bar's count for one warning.                                                                                              |
| `warningsCountLabel`   | `string`                                  | `':count warnings'`, translated                                                       | The status bar's count for several warnings.                                                                                         |
| `problemsLabel`        | `string`                                  | `'Problems'`, translated                                                              | The diagnostics list's accessible name.                                                                                              |
| `lineLabel`            | `string`                                  | `'Line :line'`, translated                                                            | A diagnostic's line.                                                                                                                 |
| `severityErrorLabel`   | `string`                                  | `'Error'`, translated                                                                 | The visually hidden severity name of an error.                                                                                       |
| `severityWarningLabel` | `string`                                  | `'Warning'`, translated                                                               | The visually hidden severity name of a warning.                                                                                      |
| `severityInfoLabel`    | `string`                                  | `'Info'`, translated                                                                  | The visually hidden severity name of an info diagnostic.                                                                             |
| `instructionsLabel`    | `string`                                  | `'Tab inserts indentation. To leave the editor, press Escape, then Tab.'`, translated | The visually hidden keyboard instructions linked to the control.                                                                     |
| `classes`              | `Partial<Record<CodeEditorPart, string>>` | —                                                                                     | Extra classes per [part](#parts). Use `class` for the root.                                                                          |

`class` goes to the root `<div>`. Every other attribute, including `id`, `name`, `aria-*` and listeners, goes to the native `<textarea>`. An `id` you pass becomes the control's id, and the other ids (hint, error, instructions, tabs, body) are built from it. Your own `aria-describedby` is kept and added after them.

## v-model

| Binding   | Type     | Carries                                                 |
| --------- | -------- | ------------------------------------------------------- |
| `v-model` | `string` | The code on every edit, including indentation from Tab. |

Without `v-model`, the editor keeps its own value.

## Slots

CodeEditor has no slots.

## Events

| Event                | Payload  | Description                                                                   |
| -------------------- | -------- | ----------------------------------------------------------------------------- |
| `@update:modelValue` | `string` | The code changed.                                                             |
| `@tab-change`        | `string` | A file tab was selected, by click or arrow key. Swap the value for that file. |
| `@language-change`   | `string` | A language was chosen in the select. Update `language` to follow it.          |

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part             | Element    | Description                                                                                               |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `root`           | `div`      | The editor, `.apui-code-editor`. Carries `data-invalid`, `data-disabled` and `data-readonly`.             |
| `label`          | `label`    | The visible label.                                                                                        |
| `required`       | `span`     | The `*` mark inside the label. `aria-hidden`.                                                             |
| `box`            | `div`      | The bordered frame around the header, body, diagnostics and status bar.                                   |
| `header`         | `div`      | The row with the tabs and language select. Only rendered with `tabs` or `languages`.                      |
| `tabs`           | `div`      | The file tablist.                                                                                         |
| `tab`            | `button`   | One file tab.                                                                                             |
| `languageSelect` | `select`   | The language select. Rendered as `data-part="languageSelect"`.                                            |
| `body`           | `div`      | The gutter and the control. The tab panel when there are tabs. Always left to right.                      |
| `gutter`         | `div`      | The line numbers. `aria-hidden`.                                                                          |
| `line`           | `span`     | One line number. Carries `data-active` on the caret's line and `data-severity` on lines with diagnostics. |
| `control`        | `textarea` | The native textarea.                                                                                      |
| `diagnostics`    | `ul`       | The list of problems.                                                                                     |
| `diagnostic`     | `li`       | One problem, with `data-severity`.                                                                        |
| `status`         | `div`      | The status bar: problem counts, caret position, indentation and language.                                 |
| `hint`           | `p`        | The help text.                                                                                            |
| `error`          | `p`        | The error message, with an alert icon.                                                                    |

A visually hidden `instructions` span (`data-part="instructions"`) carries the keyboard instructions. It doesn't take extra classes.

## Types

```ts
import type {
  CodeDiagnostic,
  CodeEditorEmits,
  CodeEditorOption,
  CodeEditorPart,
  CodeEditorProps,
  CodeEditorTranslations,
} from '@artisanpack-ui/vue/form';
```

| Type                     | Description                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CodeEditorProps`        | The component's props.                                                                                                                                     |
| `CodeEditorEmits`        | The component's events.                                                                                                                                    |
| `CodeEditorOption`       | A tab or language option: `string \| { value: string; label?: string }`.                                                                                   |
| `CodeDiagnostic`         | `{ line: number; column?: number; message: string; severity?: 'error' \| 'warning' \| 'info' }`. `line` and `column` are 1-based.                          |
| `CodeEditorTranslations` | The built-in strings by key (`tabs`, `language`, `position`, …), from `@artisanpack-ui/behavior`. The Vue component takes them as separate `*Label` props. |
| `CodeEditorPart`         | The part names in the [Parts](#parts) table.                                                                                                               |

## Accessibility

| Keys                       | Action                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `Tab` / `Shift+Tab`        | Inside the code, indents or outdents the line or every selected line by `tabSize` spaces. |
| `Escape`, then `Tab`       | Leaves the editor: after Escape, Tab and Shift+Tab move focus as usual.                   |
| `ArrowLeft` / `ArrowRight` | Moves between file tabs and selects them, following the text direction.                   |
| `Home` / `End`             | Goes to the first or last file tab.                                                       |

- Always pass a visible `label`; it's linked with `for`/`id`.
- The way out (Escape, then Tab) is read out through visually hidden instructions linked to the control.
- Hint, error and the instructions are linked to the control with `aria-describedby`; invalid sets `aria-invalid`.
- Diagnostics are listed in text with their line and severity, not only marked in the gutter.
- The file tabs are a tablist with one tab stop; the body is their tab panel.
- The code and gutter stay left to right in RTL; the header and status bar mirror.
- Colors come from tokens, so the editor follows the light or dark theme.

## Related

- [CodeEditor in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/code-editor): anatomy, tokens and live examples.
- [Code](../display/code.md) to show highlighted code read-only.
- [Textarea](textarea.md) for plain multi-line text.
- [RichTextEditor](rich-text-editor.md) for formatted text.

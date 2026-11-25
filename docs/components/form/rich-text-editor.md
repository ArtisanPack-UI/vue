---
title: RichTextEditor
menu_order: 170
meta_description: The Vue RichTextEditor component. Formatted text editing with a toolbar, HTML or Markdown output, shortcuts and a counter.
---

# RichTextEditor

Formatted text editing with a toolbar: bold, italic, headings, lists, quotes, code, links and images. It runs on the built-in `contentEditable` engine from `@artisanpack-ui/behavior` and reads and writes HTML or Markdown. Use it for descriptions, posts and other content that needs formatting. For plain text, use [Textarea](textarea.md). For source code, use [CodeEditor](code-editor.md).

```ts
import { RichTextEditor } from '@artisanpack-ui/vue/form';
// or
import { RichTextEditor } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RichTextEditor } from '@artisanpack-ui/vue/form';

const description = ref('<p>Bright two-bedroom flat near the park.</p>');
</script>

<template>
  <RichTextEditor v-model="description" label="Description" placeholder="Describe the listing…" />
</template>
```

### Output format

`output` sets the format `v-model` reads and writes: `'html'` (the default) or `'markdown'`. Markdown is CommonMark plus `~~strike~~`. Underline can't be written in Markdown, so its button is dropped from the toolbar.

```vue
<template>
  <RichTextEditor v-model="notes" label="Notes" output="markdown" />
</template>
```

The value is sanitized to the editor's formats before it's shown: paragraphs, headings, lists, quotes, code, links and images. Anything else is unwrapped to its text, or dropped with its content, as scripts, styles and embeds are. Links keep only relative, `http`, `https`, `mailto` and `tel` URLs. Images keep only relative, `http` and `https` URLs. Sanitize the value on the server too.

### Toolbar

`toolbar` takes a preset name or a list of commands, with `'|'` for a divider.

| Preset    | Commands                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `default` | bold, italic, underline, strike, heading 2, heading 3, bulleted list, numbered list, quote, code, link, image, undo, redo |
| `compact` | bold, italic, link, bulleted list                                                                                         |
| `minimal` | bold, italic, link                                                                                                        |

```vue
<template>
  <RichTextEditor v-model="bio" label="Bio" toolbar="minimal" />
  <RichTextEditor
    v-model="body"
    label="Body"
    :toolbar="['bold', 'italic', '|', 'bulletList', 'orderedList', '|', 'link']"
  />
</template>
```

The commands are `bold`, `italic`, `underline`, `strike`, `heading2`, `heading3`, `bulletList`, `orderedList`, `quote`, `code`, `link`, `image`, `undo` and `redo`. Unknown names are dropped, and dividers never lead, trail or double up. An unknown preset name falls back to `default`.

### Links and images

The link button asks for a URL with the browser's prompt, and removes the link when the caret is already in one. The image button asks for a URL, then for a description that becomes the image's `alt`. Unsafe URLs are dropped.

### Counter and length limit

`counter` shows a footer with the word and character count, such as "78 words · 486 characters". `maxLength` stops typing, pasting and dropping at that many characters, and the footer counts against it, such as "486 / 500 characters". The footer shows whenever either is set, along with a note that Markdown shortcuts are on.

```vue
<template>
  <RichTextEditor v-model="summary" label="Summary" :max-length="500" />
</template>
```

### Forms

Pass `name` to submit the value with a plain form. It goes on a hidden input that holds the value in the `output` format.

```vue
<template>
  <form method="post" action="/listings">
    <RichTextEditor name="description" label="Description" />
  </form>
</template>
```

### Translating the labels

Every button name, prompt and footer string has its own prop, such as `boldLabel`, `linkPromptLabel` and `wordsLabel`. Each defaults to its translated string. The footer labels take a `:count` placeholder, and `limitLabel` also takes `:max`.

```vue
<template>
  <RichTextEditor
    v-model="body"
    label="Contenu"
    toolbar="minimal"
    toolbar-label="Mise en forme"
    bold-label="Gras"
    italic-label="Italique"
    link-label="Lien"
    link-prompt-label="URL du lien"
  />
</template>
```

### States

```vue
<template>
  <RichTextEditor v-model="body" label="Body" hint="Shown on the listing page." />
  <RichTextEditor v-model="body" label="Body" error="Add a description." required />
  <RichTextEditor v-model="body" label="Body" readonly />
  <RichTextEditor v-model="body" label="Body" disabled />
</template>
```

`readonly` shows the content without editing it. `disabled` also disables the toolbar.

> **Note:** The editor needs a DOM to sanitize and render its content, so it fills in after mount. On a server it renders an empty editor.

## Props

| Prop                  | Type                                          | Default                                  | Description                                                                                       |
| --------------------- | --------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `modelValue`          | `string`                                      | —                                        | The content in the `output` format, bound with `v-model`.                                         |
| `output`              | `'html' \| 'markdown'`                        | `'html'`                                 | The format the value is read and written in. Emitted as `data-output`.                            |
| `toolbar`             | `string \| RichTextToolbarItem[]`             | `'default'`                              | A preset (`default`, `compact`, `minimal`) or a list of commands and `'\|'` dividers.             |
| `maxLength`           | `number`                                      | —                                        | The most characters allowed. Typing stops there, and the footer counts against it.                |
| `counter`             | `boolean`                                     | `false`                                  | Shows the footer with the word and character count.                                               |
| `label`               | `string`                                      | —                                        | The visible label. It names the content. Without it, name the content another way.                |
| `hint`                | `string`                                      | —                                        | Help text under the editor, linked to the content with `aria-describedby`.                        |
| `error`               | `string`                                      | —                                        | Validation message. Marks the field invalid and is linked to the content with `aria-describedby`. |
| `invalid`             | `boolean`                                     | `false`                                  | Marks the field invalid without a message.                                                        |
| `disabled`            | `boolean`                                     | `false`                                  | Disables editing and the toolbar.                                                                 |
| `readonly`            | `boolean`                                     | `false`                                  | Shows the content without editing it. The toolbar is disabled.                                    |
| `required`            | `boolean`                                     | `false`                                  | Sets `aria-required` on the content and shows the required mark.                                  |
| `placeholder`         | `string`                                      | —                                        | Text shown while the content is empty. Also set as `aria-placeholder`.                            |
| `toolbarLabel`        | `string`                                      | `'Formatting'`, translated               | The toolbar's accessible name.                                                                    |
| `boldLabel`           | `string`                                      | `'Bold'`, translated                     | The Bold button's accessible name.                                                                |
| `italicLabel`         | `string`                                      | `'Italic'`, translated                   | The Italic button's accessible name.                                                              |
| `underlineLabel`      | `string`                                      | `'Underline'`, translated                | The Underline button's accessible name.                                                           |
| `strikeLabel`         | `string`                                      | `'Strikethrough'`, translated            | The Strikethrough button's accessible name.                                                       |
| `heading2Label`       | `string`                                      | `'Heading 2'`, translated                | The Heading 2 button's accessible name.                                                           |
| `heading3Label`       | `string`                                      | `'Heading 3'`, translated                | The Heading 3 button's accessible name.                                                           |
| `bulletListLabel`     | `string`                                      | `'Bulleted list'`, translated            | The bulleted list button's accessible name.                                                       |
| `orderedListLabel`    | `string`                                      | `'Numbered list'`, translated            | The numbered list button's accessible name.                                                       |
| `quoteLabel`          | `string`                                      | `'Quote'`, translated                    | The Quote button's accessible name.                                                               |
| `codeLabel`           | `string`                                      | `'Code'`, translated                     | The Code button's accessible name.                                                                |
| `linkLabel`           | `string`                                      | `'Link'`, translated                     | The Link button's accessible name.                                                                |
| `imageLabel`          | `string`                                      | `'Image'`, translated                    | The Image button's accessible name.                                                               |
| `undoLabel`           | `string`                                      | `'Undo'`, translated                     | The Undo button's accessible name.                                                                |
| `redoLabel`           | `string`                                      | `'Redo'`, translated                     | The Redo button's accessible name.                                                                |
| `linkPromptLabel`     | `string`                                      | `'Link URL'`, translated                 | The prompt that asks for a link URL.                                                              |
| `imagePromptLabel`    | `string`                                      | `'Image URL'`, translated                | The prompt that asks for an image URL.                                                            |
| `imageAltPromptLabel` | `string`                                      | `'Describe the image'`, translated       | The prompt that asks for an image description.                                                    |
| `shortcutsLabel`      | `string`                                      | `'Markdown shortcuts on'`, translated    | The footer note about Markdown shortcuts.                                                         |
| `wordLabel`           | `string`                                      | `':count word'`, translated              | The footer's word count for one word.                                                             |
| `wordsLabel`          | `string`                                      | `':count words'`, translated             | The footer's word count.                                                                          |
| `characterLabel`      | `string`                                      | `':count character'`, translated         | The footer's character count for one character.                                                   |
| `charactersLabel`     | `string`                                      | `':count characters'`, translated        | The footer's character count.                                                                     |
| `limitLabel`          | `string`                                      | `':count / :max characters'`, translated | The footer's count with `maxLength`.                                                              |
| `classes`             | `Partial<Record<RichTextEditorPart, string>>` | —                                        | Extra classes per [part](#parts), such as `{ content: 'min-h-64' }`.                              |

RichTextEditor sets `inheritAttrs: false`. `class` and every other attribute go to the root, except `name`, which goes to the hidden input, and `aria-describedby`, which is added to the content after the hint and error ids. An `id` you pass becomes the base for the inner ids, such as `<id>-content` and `<id>-toolbar`.

## v-model

| Binding   | Type     | Carries                                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| `v-model` | `string` | The sanitized content in the `output` format, after every edit. An empty editor is `''`. |

Without `v-model`, the editor keeps its own content. A new `modelValue` from outside replaces the content. The value the editor just emitted doesn't, so the caret stays in place while people type.

## Slots

RichTextEditor has no slots.

## Events

| Event                | Payload  | Description                                |
| -------------------- | -------- | ------------------------------------------ |
| `@update:modelValue` | `string` | The content changed, in the output format. |

Other listeners fall through to the root.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element  | Description                                                                                                      |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `root`        | `div`    | The field, `.apui-rich-text-editor`. Carries `data-output`, `data-invalid`, `data-disabled` and `data-readonly`. |
| `label`       | `span`   | The visible label. It names the content through `aria-labelledby`.                                               |
| `required`    | `span`   | The required mark. `aria-hidden`.                                                                                |
| `box`         | `div`    | The bordered box around the toolbar, content and footer.                                                         |
| `toolbar`     | `div`    | The toolbar, `role="toolbar"`.                                                                                   |
| `button`      | `button` | One toolbar button. Carries `data-command`.                                                                      |
| `divider`     | `span`   | A toolbar divider, `role="separator"`.                                                                           |
| `content`     | `div`    | The editable content, `role="textbox"`.                                                                          |
| `placeholder` | `p`      | The placeholder. `aria-hidden`, and hidden once there's content.                                                 |
| `footer`      | `div`    | The footer with the shortcuts note and the count.                                                                |
| `count`       | `span`   | The word and character count.                                                                                    |
| `hint`        | `p`      | The hint text.                                                                                                   |
| `error`       | `p`      | The error text with its icon.                                                                                    |

## Types

```ts
import type {
  RichTextEditorEmits,
  RichTextEditorPart,
  RichTextEditorProps,
  RichTextOutput,
  RichTextToolbarItem,
  RichTextTranslations,
} from '@artisanpack-ui/vue/form';
```

| Type                   | Description                                                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RichTextEditorProps`  | The component's props.                                                                                                                                                                         |
| `RichTextEditorEmits`  | The component's events.                                                                                                                                                                        |
| `RichTextOutput`       | `'html' \| 'markdown'`                                                                                                                                                                         |
| `RichTextToolbarItem`  | A command name or `'\|'`.                                                                                                                                                                      |
| `RichTextTranslations` | The editor's built-in strings, keyed `toolbar`, `bold`, `linkPrompt`, `words` and so on. Re-exported from `@artisanpack-ui/behavior`. The Vue component takes them as separate `*Label` props. |
| `RichTextEditorPart`   | The part names in the [Parts](#parts) table.                                                                                                                                                   |

## Accessibility

| Keys                                             | Action                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| `Tab`                                            | Moves into the toolbar (one stop), then to the content.                 |
| `ArrowLeft` / `ArrowRight`                       | Moves between toolbar buttons, following the text direction.            |
| `Home` / `End`                                   | Moves to the first or last toolbar button.                              |
| `Mod+B` / `Mod+I` / `Mod+U`                      | Bold, italic and underline. Mod is `Ctrl`, or `⌘` on Apple platforms.   |
| `Mod+Shift+X` / `Mod+Shift+7` / `Mod+Shift+8`    | Strikethrough, numbered list and bulleted list.                         |
| `Mod+K`                                          | Adds a link to the selection, or removes the one at the caret.          |
| `##`, `###`, `-`, `*`, `1.` or `>`, then `Space` | Markdown shortcuts at the start of a line: headings, lists and a quote. |

- The toolbar is `role="toolbar"` with an accessible name and one tab stop. Arrow keys follow the text direction.
- Toggle buttons use `aria-pressed`. Every button is icon-only with an accessible name, which you can translate.
- The content is `role="textbox"` with `aria-multiline="true"`, named by the label and described by the hint and error. Always pass a `label`.
- An error or `invalid` sets `aria-invalid` on the content. The error is text, never color alone.
- Document the keyboard and Markdown shortcuts for your users.
- Undo and redo icons mirror in right-to-left layouts. Code blocks stay left to right.
- Disabled and read-only use the sunken surface, never opacity alone.
- Shows a visible focus ring on the box while the content has focus.

## Related

- [RichTextEditor in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/rich-text-editor): anatomy, tokens and live examples.
- [Textarea](textarea.md) for plain multi-line text.
- [CodeEditor](code-editor.md) for source code.
- [Markdown](../utility/markdown.md) for rendering Markdown.

---
title: Markdown
menu_order: 40
meta_description: The Vue Markdown component. Safe GitHub-flavored Markdown in prose styles, with write, preview and split modes and v-model:source.
---

# Markdown

Renders GitHub-flavored Markdown in the shared prose styles: headings, lists, task lists, tables, code and links. Raw HTML is escaped and unsafe link and image URLs are dropped, so it's safe for user content. With `mode="write"` or `mode="split"`, it adds Write, Preview and Split tabs over a Textarea for editing.

```ts
import { Markdown } from '@artisanpack-ui/vue/utility';
// or
import { Markdown } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Markdown } from '@artisanpack-ui/vue/utility';

const notes = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room
`;
</script>

<template>
  <Markdown :source="notes" />
</template>
```

The HTML comes from `renderMarkdown` in `@artisanpack-ui/behavior`, the same output the Blade and React components produce.

### Editing

`mode="write"` opens on a Write tab with a Textarea, and `mode="split"` shows the source and the preview side by side. Every editing mode has Write, Preview and Split tabs. Bind `v-model:source` to keep the edited Markdown:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Markdown } from '@artisanpack-ui/vue/utility';

const draft = ref('## Notes\n\nStart typing…');
</script>

<template>
  <Markdown v-model:source="draft" mode="split" />
</template>
```

The selected tab starts on `mode`, and follows a new `mode` when you change it.

### Controlled and uncontrolled

When you pass `source` and listen for the edit (`v-model:source` or `@source-change`), the parent owns the text: an edit you don't accept never shows. Without a listener, the editor keeps its own draft, starting from `source` and replaced when `source` changes. An edit made in write mode still shows when you switch to preview.

### Raw HTML

By default every raw HTML tag in the Markdown is escaped and shows as text. With `:sanitize="false"`, an allowlist of formatting tags, such as `<kbd>`, `<sub>` and `<details>`, renders with safe attributes, and every other tag is still escaped. Script-capable markup and unsafe URLs never render either way.

```vue
<template>
  <Markdown source="Press <kbd>Esc</kbd> to close." :sanitize="false" />
</template>
```

## Props

| Prop           | Type                                    | Default                          | Description                                                                                                                                              |
| -------------- | --------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`       | `string`                                | —                                | The Markdown. In write and split modes, the Textarea's value; bind it with `v-model:source`.                                                             |
| `content`      | `string`                                | —                                | Deprecated. The 2.x name of `source`, still accepted. `source` wins.                                                                                     |
| `mode`         | `'preview' \| 'write' \| 'split'`       | `'preview'`                      | `preview` renders the Markdown only. `write` and `split` add Write, Preview and Split tabs over the source, opening on that tab. Emitted as `data-mode`. |
| `sanitize`     | `boolean`                               | `true`                           | Escapes raw HTML. `false` keeps the allowlisted formatting tags with safe attributes and escapes every other tag.                                        |
| `tabsLabel`    | `string`                                | `'Markdown mode'`, translated    | Names the mode tabs.                                                                                                                                     |
| `writeLabel`   | `string`                                | `'Write'`, translated            | The Write tab.                                                                                                                                           |
| `previewLabel` | `string`                                | `'Preview'`, translated          | The Preview tab.                                                                                                                                         |
| `splitLabel`   | `string`                                | `'Split'`, translated            | The Split tab.                                                                                                                                           |
| `editorLabel`  | `string`                                | `'Markdown source'`, translated  | Names the source Textarea.                                                                                                                               |
| `outputLabel`  | `string`                                | `'Rendered preview'`, translated | Names the preview region in write and split modes.                                                                                                       |
| `classes`      | `Partial<Record<MarkdownPart, string>>` | —                                | Extra classes per [part](#parts).                                                                                                                        |

`class`, `style` and every other attribute go to the root `<div>`.

## v-model

| Binding          | Type     | Description                                                       |
| ---------------- | -------- | ----------------------------------------------------------------- |
| `v-model:source` | `string` | The Markdown, updated as the user types in write and split modes. |

## Slots

Markdown has no slots.

## Events

| Event            | Payload          | Description                            |
| ---------------- | ---------------- | -------------------------------------- |
| `@source-change` | `source: string` | The source was edited in the Textarea. |
| `@update:source` | `source: string` | The same, for `v-model:source`.        |

## Parts

Pass extra classes to a part with `classes`. Every part except `root` carries a `data-part` attribute you can also target in CSS.

| Part      | Element | Description                                                                                             |
| --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `root`    | `div`   | The wrapper, `.apui-markdown`. In preview mode it's also `.apui-prose` and holds the HTML.              |
| `editor`  | `div`   | Holds the source Textarea, in the Write tab and the Split tab.                                          |
| `preview` | `div`   | The rendered HTML in the Preview and Split tabs, `.apui-prose`, `role="region"` named by `outputLabel`. |
| `split`   | `div`   | The side-by-side layout in the Split tab.                                                               |

## Deprecated props

| Deprecated | Use instead |
| ---------- | ----------- |
| `content`  | `source`    |

## Types

```ts
import type {
  MarkdownEmits,
  MarkdownMode,
  MarkdownPart,
  MarkdownProps,
} from '@artisanpack-ui/vue/utility';
```

| Type            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `MarkdownProps` | The component's props.                                       |
| `MarkdownEmits` | The component's events: `source-change` and `update:source`. |
| `MarkdownMode`  | `'preview' \| 'write' \| 'split'`                            |
| `MarkdownPart`  | `'root' \| 'editor' \| 'preview' \| 'split'`                 |

## Accessibility

| Keys                      | Action                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `ArrowRight`, `ArrowLeft` | On the mode tabs, move between Write, Preview and Split, following the text direction. |
| `Tab`                     | From the selected tab into its panel: the Textarea, or the preview's links.            |

- Headings keep their levels and tables keep their header cells, so the structure reads as written. Start the Markdown at the heading level that fits the page.
- Task-list checkboxes are real, disabled checkboxes, named by their item's text.
- Raw HTML is escaped, or with `:sanitize="false"` filtered to formatting tags. Event handlers, styles and unsafe URLs never render.
- The mode tabs are [Tabs](../layout/tabs.md) named by `tabsLabel`. The Textarea is named by `editorLabel` and the preview region by `outputLabel`.
- Prose text keeps 4.5:1 on every surface, and links are underlined.
- Line length is capped for readability, and the text reflows at 320px.
- Code blocks stay left to right in right-to-left pages; everything else mirrors.

## Related

- [Markdown in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/markdown): anatomy, tokens and live examples.
- [Textarea](../form/textarea.md) for plain text input.
- [RichTextEditor](../form/rich-text-editor.md) for formatted text without Markdown.

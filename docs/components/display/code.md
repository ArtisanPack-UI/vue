---
title: Code
menu_order: 40
meta_description: The Vue Code component. Read-only code blocks with a file name, language badge, copy button, line numbers and highlighted lines, or inline code.
---

# Code

Shows read-only code: a block with a header (file name, language and a copy button) and optional line numbers and highlighted lines, or inline code in running text. It renders a `<div class="apui-code">` with a scrollable `<pre>`, or a `<code>` when inline. There's no syntax highlighting. For editable code, use [CodeEditor](../form/code-editor.md).

```ts
import { Code } from '@artisanpack-ui/vue/display';
// or
import { Code } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Code } from '@artisanpack-ui/vue/display';

const snippet = `npm install @artisanpack-ui/vue`;
</script>

<template>
  <Code :code="snippet" language="bash" />
</template>
```

The code is rendered as text, so HTML in it is never interpreted. Each line is its own `line` part, separated by newlines, so the text reads line by line.

### File name, line numbers and highlights

`fileName` goes at the start of the header. `numbered` shows line numbers, and `highlight` takes 1-based line numbers to emphasize. Selecting and copying the code leaves the line numbers out.

```vue
<script setup lang="ts">
import { Code } from '@artisanpack-ui/vue/display';

const config = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
});`;
</script>

<template>
  <Code :code="config" file-name="vite.config.ts" language="ts" numbered :highlight="[2, 5]" />
</template>
```

### Copying

The copy button is on by default. It copies the exact source, including a final newline, and announces "Copied to clipboard" in a live region. If the copy fails, it announces an error that asks the user to copy the text themselves. Changing `code` clears a stale "Copied" state. Set `copyable` to `false` to hide the button. Without a file name, a language or the copy button, the header isn't rendered.

```vue
<template>
  <Code :code="token" :copyable="false" />
  <Code :code="token" copy-label="Copy token" copied-message="Token copied" />
</template>
```

### Inline

`inline` renders a `<code>` element for running text, without a header, line numbers or copy button.

```vue
<template>
  <p>Run <Code inline code="npm run build" /> before deploying.</p>
</template>
```

## Props

| Prop            | Type                                | Default                                                              | Description                                                                                  |
| --------------- | ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `code`          | `string`                            | —                                                                    | The code, shown as text.                                                                     |
| `language`      | `string`                            | —                                                                    | The language, shown as an outline badge in the header. Only a label: nothing is highlighted. |
| `fileName`      | `string`                            | —                                                                    | The file name or a title, at the start of the header.                                        |
| `numbered`      | `boolean`                           | `false`                                                              | Shows line numbers, which copying leaves out. Emitted as `data-numbered`.                    |
| `highlight`     | `number[]`                          | —                                                                    | Line numbers to emphasize, 1-based. Highlighted lines carry `data-highlight`.                |
| `inline`        | `boolean`                           | `false`                                                              | Renders inline code in running text: no header, numbers or copy.                             |
| `copyable`      | `boolean`                           | `true`                                                               | Shows the copy button.                                                                       |
| `label`         | `string`                            | `fileName`, then `language`, then `'Code'` (translated)              | Names the scroll region.                                                                     |
| `copyLabel`     | `string`                            | `'Copy'`, translated                                                 | The copy button's label.                                                                     |
| `copiedLabel`   | `string`                            | `'Copied'`, translated                                               | The button's label after a copy.                                                             |
| `copiedMessage` | `string`                            | `'Copied to clipboard'`, translated                                  | Announced after a copy.                                                                      |
| `errorMessage`  | `string`                            | `"Couldn't copy. Select the text and copy it yourself."`, translated | Announced when the copy fails.                                                               |
| `classes`       | `Partial<Record<CodePart, string>>` | —                                                                    | Extra classes per [part](#parts).                                                            |

`class`, `style` and every other attribute go to the root `<div>`, or to the `<code>` when `inline` is set.

## Slots

Code has no slots. Pass the code as the `code` prop.

## Events

Code has no events of its own. Listeners fall through to the root element.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part       | Element         | Description                                                                 |
| ---------- | --------------- | --------------------------------------------------------------------------- |
| `root`     | `div` or `code` | The block, `.apui-code`. A `code` element with `data-inline` when inline.   |
| `header`   | `div`           | The header. Only rendered with a file name, a language or the copy button.  |
| `file`     | `span`          | The file name.                                                              |
| `language` | `span`          | The language badge, an outline `.apui-badge`.                               |
| `copy`     | `button`        | The copy button, with `data-state` (`idle`, `copied` or `error`).           |
| `status`   | `span`          | The visually hidden `role="status"` live region for copy messages.          |
| `pre`      | `pre`           | The focusable, scrollable `role="region"`.                                  |
| `line`     | `span`          | One line, with `data-n` (its number) and `data-highlight` when highlighted. |

## Types

```ts
import type { CodePart, CodeProps } from '@artisanpack-ui/vue/display';
```

| Type        | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| `CodeProps` | The component's props.                                                                |
| `CodePart`  | `'root' \| 'header' \| 'file' \| 'language' \| 'copy' \| 'status' \| 'pre' \| 'line'` |

## Accessibility

| Keys             | Action                                                         |
| ---------------- | -------------------------------------------------------------- |
| `Tab`            | Moves to the copy button, then to the code region.             |
| `Enter`, `Space` | On the copy button, copies the code.                           |
| Arrow keys       | In the focused code region, scroll long lines and long blocks. |

- The block is a focusable `role="region"` named by `label`, the file name, the language or "Code", so keyboard users can scroll long lines.
- Copying is announced in a live region, and so is a failure. The button's label changes to "Copied".
- Line numbers aren't text: selecting and copying the code leaves them out.
- The code stays left-to-right in every direction. The header mirrors in RTL.
- Highlighted lines keep a 4.5:1 contrast for their text and numbers.

## Related

- [Code in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/code): anatomy, tokens and live examples.
- [Diff](diff.md) for comparing two versions of code or text.
- [CodeEditor](../form/code-editor.md) for editable code.
- [Clipboard](../utility/clipboard.md) for a standalone copy button.
- [Kbd](../utility/kbd.md) for keyboard keys in running text.

---
title: Clipboard
menu_order: 10
meta_description: The Vue Clipboard component. Copy buttons, icon buttons and copy fields with an announced result and a manual fallback, with every prop and event.
---

# Clipboard

Copies a value with a clear confirmation. It renders a copy button, an icon button or a read-only copy field. After a copy the label changes to "Copied" for a moment, and the result, or the failure, is announced in a live region. When copying fails, the value shows and is selected, so it can be copied by hand.

```ts
import { Clipboard } from '@artisanpack-ui/vue/utility';
// or
import { Clipboard } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Clipboard } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <Clipboard value="https://horizonhomes.com/l/grove-greenfield" />
</template>
```

Clipboard uses `navigator.clipboard`, with a fallback for browsers or contexts where it isn't available.

### Variants

`button` (the default) is an outline button with a label. `icon` is a ghost icon button, named by `label`. `field` shows the value in a box with the button beside it.

```vue
<template>
  <Clipboard value="LST-4127" />
  <Clipboard value="LST-4127" variant="icon" label="Copy reference" />
  <Clipboard
    value="https://horizonhomes.com/l/grove-greenfield"
    variant="field"
    size="md"
    label="Copy share link"
  />
</template>
```

### Sizes

`size` sets the button's size and the field's height: `xs`, `sm` (the default) or `md`.

### Reacting to a copy

`copied` fires with the value once it reaches the clipboard, and `error` fires when it can't be copied.

```vue
<script setup lang="ts">
import { Clipboard } from '@artisanpack-ui/vue/utility';

const apiKey = 'pk_live_4127';

function track(value: string): void {
  // …
}

function report(error: unknown): void {
  // …
}
</script>

<template>
  <Clipboard :value="apiKey" variant="field" @copied="track" @error="report" />
</template>
```

### Timing and text

"Copied" shows for `timeout` milliseconds (default `2000`). `label`, `copiedLabel`, `copiedMessage` and `errorMessage` replace the built-in text. Changing `value` clears a stale "Copied" and the manual-copy box.

## Props

| Prop            | Type                                     | Default                                                              | Description                                                                    |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `value`         | `string`                                 | —                                                                    | What to copy. The field variant shows it.                                      |
| `modelValue`    | `string`                                 | —                                                                    | The same as `value`, under the design-system kit's Vue spelling. `value` wins. |
| `text`          | `string`                                 | —                                                                    | Deprecated. The 2.x name of `value`. `value` and `modelValue` win.             |
| `timeout`       | `number`                                 | `2000`                                                               | How long "Copied" shows, in milliseconds.                                      |
| `variant`       | `'button' \| 'icon' \| 'field'`          | `'button'`                                                           | A copy button, an icon button or a copy field. Emitted as `data-variant`.      |
| `size`          | `'xs' \| 'sm' \| 'md'`                   | `'sm'`                                                               | The button's size and the field's height. Emitted as `data-size`.              |
| `label`         | `string`                                 | `'Copy'`, translated                                                 | The button's label, and the icon button's accessible name.                     |
| `copiedLabel`   | `string`                                 | `'Copied'`, translated                                               | The label after a copy.                                                        |
| `copiedMessage` | `string`                                 | `'Copied to clipboard'`, translated                                  | Announced after a copy.                                                        |
| `errorMessage`  | `string`                                 | `"Couldn't copy. Select the text and copy it yourself."`, translated | Announced when the copy fails.                                                 |
| `classes`       | `Partial<Record<ClipboardPart, string>>` | —                                                                    | Extra classes per [part](#parts).                                              |

`class`, `style` and every other attribute go to the root `<span>` (or `<div>` for the field variant). The root and the button carry `data-state`: `idle`, `copied` or `failed`.

## Slots

Clipboard has no slots.

## Events

| Event     | Payload          | Description                                                           |
| --------- | ---------------- | --------------------------------------------------------------------- |
| `@copied` | `value: string`  | The value reached the clipboard.                                      |
| `@error`  | `error: unknown` | The copy failed. The value is shown and selected for copying by hand. |
| `@copy`   | `value: string`  | Deprecated. The 2.x name of `copied`, emitted with it.                |

`copy` is declared as a component event, so a `@copy` listener never catches the native `copy` event.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element         | Description                                                                                          |
| --------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| `root`    | `span` or `div` | The wrapper, `.apui-clipboard`. A `div` for the field variant.                                       |
| `button`  | `button`        | The copy button, styled as an `.apui-button`. Its icon switches from `copy` to `check` after a copy. |
| `field`   | `span`          | The box holding the value. Shown for the field variant, and in every variant after a failed copy.    |
| `value`   | `span`          | The value itself, selectable.                                                                        |
| `tooltip` | `span`          | The `role="status"` live region with the result message.                                             |

## Deprecated props

| Deprecated    | Use instead |
| ------------- | ----------- |
| `text` prop   | `value`     |
| `@copy` event | `@copied`   |

Both are removed in a later major release.

## Types

```ts
import type {
  ClipboardPart,
  ClipboardProps,
  ClipboardSize,
  ClipboardVariant,
} from '@artisanpack-ui/vue/utility';
```

| Type               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `ClipboardProps`   | The component's props.                                  |
| `ClipboardVariant` | `'button' \| 'icon' \| 'field'`                         |
| `ClipboardSize`    | `'xs' \| 'sm' \| 'md'`                                  |
| `ClipboardPart`    | `'root' \| 'button' \| 'field' \| 'value' \| 'tooltip'` |

## Accessibility

| Keys             | Action                            |
| ---------------- | --------------------------------- |
| `Enter`, `Space` | Copies the value (native button). |

- The result is announced in a `role="status"` live region, success or failure. A copy is never silent.
- The label changes to "Copied" while copied, and the icon button's accessible name does too.
- Give the icon variant a `label` that says what it copies, such as "Copy reference".
- The value in a copy field reads left to right in every direction and stays selectable, so it can be copied by hand when copying fails. The button and icon variants show it, selected, after a failure.

## Related

- [Clipboard in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/clipboard): anatomy, tokens and live examples.
- [Code](../display/code.md), whose copy button uses the same copy behavior.
- [Button](../form/button.md) for other actions.

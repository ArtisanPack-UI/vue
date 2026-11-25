---
title: Kbd
menu_order: 30
meta_description: The Vue Kbd component. Keyboard keys and shortcuts as kbd elements, with platform-aware modifier keys and text alternatives for symbols.
---

# Kbd

Shows a keyboard key or a shortcut. It renders `<kbd>` elements: one for a single key, or a `<kbd>` of `<kbd>` elements for a shortcut. `mod` shows as ⌘ on Apple platforms and Ctrl elsewhere, and symbol keys carry their name as hidden text.

```ts
import { Kbd } from '@artisanpack-ui/vue/utility';
// or
import { Kbd } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Kbd } from '@artisanpack-ui/vue/utility';
</script>

<template>
  <p>Press <Kbd :keys="['mod', 'k']" /> to search, or <Kbd :keys="['?']" /> for all shortcuts.</p>
</template>
```

### Key names

`keys` lists a shortcut's keys in order. Named keys, matched without regard to case, become the platform's key cap:

| Name                                            | Apple   | Elsewhere |
| ----------------------------------------------- | ------- | --------- |
| `mod`                                           | ⌘       | Ctrl      |
| `cmd`, `command`                                | ⌘       | ⌘         |
| `meta`                                          | ⌘       | Meta      |
| `ctrl`, `control`                               | ⌃       | Ctrl      |
| `alt`, `option`, `opt`                          | ⌥       | Alt       |
| `shift`                                         | ⇧       | Shift     |
| `enter`, `return`                               | ↵       | ↵         |
| `esc`, `escape`                                 | Esc     | Esc       |
| `tab`                                           | Tab     | Tab       |
| `space`                                         | Space   | Space     |
| `backspace`                                     | ⌫       | Backspace |
| `delete`, `del`                                 | Del     | Del       |
| `up`, `down`, `left`, `right` (or `arrowup`, …) | ↑ ↓ ← → | ↑ ↓ ← →   |

A single character is uppercased, symbols such as `⌘` or `↵` are kept as given, and anything else, such as `F5` or `PgUp`, shows as written. Empty entries are dropped.

### Platform

With `platform="auto"` (the default), Kbd checks the platform after it mounts, so a server render shows the non-Apple keys until the page hydrates. Set `mac` or `other` to fix it, such as on a page that documents one platform.

```vue
<template>
  <Kbd :keys="['mod', 'shift', 'p']" platform="mac" />
</template>
```

### A single key

Without `keys`, the default slot is one key:

```vue
<template>
  <Kbd>F5</Kbd>
</template>
```

### Sizes

`size` is `md` (the default) or `sm`, for tight spaces such as menu items.

### Translating symbol names

Symbol keys carry a hidden name, such as "Command" for ⌘, from the package translations. `labels` replaces any of them for one instance:

```vue
<template>
  <Kbd :keys="['mod', 'enter']" :labels="{ command: 'Commande', enter: 'Entrée' }" />
</template>
```

## Props

| Prop       | Type                               | Default                  | Description                                                                                                                                              |
| ---------- | ---------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | `string[]`                         | —                        | A shortcut's keys in order, such as `['mod', 'shift', 'p']`. Renders a combo. Without it, the default slot is one key.                                   |
| `size`     | `'sm' \| 'md'`                     | `'md'`                   | Key cap size. Emitted as `data-size` on each key.                                                                                                        |
| `platform` | `'auto' \| 'mac' \| 'other'`       | `'auto'`                 | Whose keys to show: measured after mount, or fixed.                                                                                                      |
| `labels`   | `KbdLabels`                        | Translated English names | The hidden names of symbol keys, by name: `command`, `control`, `option`, `shift`, `enter`, `tab`, `escape`, `backspace`, `up`, `down`, `left`, `right`. |
| `classes`  | `Partial<Record<KbdPart, string>>` | —                        | Extra classes per [part](#parts).                                                                                                                        |

`class`, `style` and every other attribute go to the outer `<kbd>`.

## Slots

| Slot      | Description                                              |
| --------- | -------------------------------------------------------- |
| `default` | One key's text. Used only when `keys` is empty or unset. |

## Events

Kbd has no events.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part    | Element | Description                                                                                             |
| ------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `root`  | `kbd`   | The outer element: the combo, or the single key.                                                        |
| `combo` | `kbd`   | The shortcut, `.apui-kbd-combo`. Only rendered with `keys`.                                             |
| `key`   | `kbd`   | One key cap, `.apui-kbd`. A symbol key holds the symbol (`aria-hidden`) and its name (visually hidden). |

## Types

```ts
import type { KbdPart, KbdPlatform, KbdProps, KbdSize } from '@artisanpack-ui/vue/utility';
```

| Type          | Description                  |
| ------------- | ---------------------------- |
| `KbdProps`    | The component's props.       |
| `KbdSize`     | `'sm' \| 'md'`               |
| `KbdPlatform` | `'auto' \| 'mac' \| 'other'` |
| `KbdPart`     | `'root' \| 'combo' \| 'key'` |

`KbdLabels`, the type of `labels`, isn't re-exported by this package. Import it from `@artisanpack-ui/behavior`, or write the object inline.

## Accessibility

Kbd isn't interactive, so it has no keyboard behavior.

- Every key is a `<kbd>` element, and a shortcut is a `<kbd>` of `<kbd>` elements.
- Symbols (⌘, ⌥, ⇧, ⌃, ↵, arrows) have a text alternative that screen readers read instead of the symbol.
- The keys match the platform: ⌘ on Apple platforms, Ctrl elsewhere.
- Kbd isn't a control. Never use it as a button.

## Related

- [Kbd in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/kbd): anatomy, tokens and live examples.
- [Tooltip](tooltip.md), which shows a shortcut after its label.
- [Spotlight](../navigation/spotlight.md), which shows its shortcut on the trigger.

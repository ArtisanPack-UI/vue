---
title: Diff
menu_order: 50
meta_description: The Vue Diff component. Shows the changes between two versions of a text, unified or side by side, with word-level marks and counts.
---

# Diff

Shows the changes between two versions of a text. It renders a `<div class="apui-diff">` with a header (file name and counts) and a table of changed lines with their surrounding context, in one column or side by side. Changed words inside a line are marked with `<ins>` and `<del>`. The diff is computed in the browser, with no diff library.

```ts
import { Diff } from '@artisanpack-ui/vue/display';
// or
import { Diff } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Diff } from '@artisanpack-ui/vue/display';

const before = `title: Lakeside cabin
price: 120
guests: 4`;

const after = `title: Lakeside cabin
price: 135
guests: 4
pets: true`;
</script>

<template>
  <Diff :old-content="before" :new-content="after" file-name="listing.yml" />
</template>
```

### Split view

`view="split"` shows the old version on the left and the new one on the right, with matching lines paired.

```vue
<template>
  <Diff :old-content="before" :new-content="after" view="split" />
</template>
```

### Context and word marks

`context` sets how many unchanged lines are kept around each change. Changes farther apart are split into hunks, each with a header row. `wordLevel` marks the changed words inside a changed line. Turn it off to mark whole lines only.

```vue
<template>
  <Diff :old-content="before" :new-content="after" :context="1" :word-level="false" />
</template>
```

### Header actions

The `actions` slot adds controls to the end of the header, such as a view switch.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Diff, type DiffView } from '@artisanpack-ui/vue/display';

const view = ref<DiffView>('unified');
</script>

<template>
  <Diff :old-content="before" :new-content="after" :view="view">
    <template #actions>
      <Button
        size="xs"
        variant="ghost"
        color="neutral"
        @click="view = view === 'split' ? 'unified' : 'split'"
      >
        {{ view === 'split' ? 'Unified' : 'Split' }}
      </Button>
    </template>
  </Diff>
</template>
```

### No changes

When the versions are the same, the table shows one row with `emptyLabel` ("No changes" by default).

## Props

| Prop          | Type                                | Default                                                      | Description                                                                             |
| ------------- | ----------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `oldContent`  | `string`                            | —                                                            | The earlier version.                                                                    |
| `newContent`  | `string`                            | —                                                            | The later version.                                                                      |
| `fileName`    | `string`                            | —                                                            | What changed, at the start of the header.                                               |
| `view`        | `'unified' \| 'split'`              | `'unified'`                                                  | One column, or the versions side by side. Emitted as `data-view`.                       |
| `wordLevel`   | `boolean`                           | `true`                                                       | Marks the changed words inside a changed line.                                          |
| `context`     | `number`                            | `3`                                                          | Unchanged lines kept around each change.                                                |
| `countsLabel` | `string`                            | `'{additions} additions, {deletions} deletions'`, translated | The counts read by assistive technology. `{additions}` and `{deletions}` are filled in. |
| `emptyLabel`  | `string`                            | `'No changes'`, translated                                   | Shown when the versions are the same.                                                   |
| `actions`     | `string`                            | —                                                            | Header controls as text. Usually the `actions` slot instead, which overrides it.        |
| `classes`     | `Partial<Record<DiffPart, string>>` | —                                                            | Extra classes per [part](#parts).                                                       |

`class`, `style` and every other attribute go to the root `<div>`.

## Slots

| Slot      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `actions` | Controls at the end of the header. Overrides the `actions` prop. |

## Events

Diff has no events of its own. Listeners fall through to the root `<div>`.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS. Line, number, sign and code cells carry `data-type`: `add`, `del`, `ctx` (unchanged) or `empty` (the blank side of a split row).

| Part         | Element | Description                                                                                              |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------- |
| `root`       | `div`   | The diff, `.apui-diff`.                                                                                  |
| `header`     | `div`   | The header.                                                                                              |
| `icon`       | `span`  | The `git-compare` icon. `aria-hidden`.                                                                   |
| `file`       | `span`  | The file name.                                                                                           |
| `counts`     | `span`  | The visible `+N −N` counts (hidden from assistive technology) and the counts in words (visually hidden). |
| `actions`    | `div`   | The header controls. Only rendered with the `actions` slot or prop.                                      |
| `table`      | `table` | The lines.                                                                                               |
| `hunk`       | `tr`    | A hunk header row, or the "No changes" row.                                                              |
| `line`       | `tr`    | One line, or one paired row in split view.                                                               |
| `lineNumber` | `td`    | A line number. Unified rows have the old and the new number.                                             |
| `sign`       | `td`    | `+`, `−` or a space.                                                                                     |
| `code`       | `td`    | The line's text.                                                                                         |
| `ins`        | `ins`   | An added word inside a changed line.                                                                     |
| `del`        | `del`   | A deleted word inside a changed line.                                                                    |

## Types

```ts
import type { DiffPart, DiffProps, DiffView } from '@artisanpack-ui/vue/display';
```

| Type        | Description                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DiffProps` | The component's props.                                                                                                                                 |
| `DiffView`  | `'unified' \| 'split'`                                                                                                                                 |
| `DiffPart`  | `'root' \| 'header' \| 'icon' \| 'file' \| 'counts' \| 'actions' \| 'table' \| 'hunk' \| 'line' \| 'lineNumber' \| 'sign' \| 'code' \| 'ins' \| 'del'` |

## Accessibility

Diff isn't interactive and has no keyboard behavior of its own. Controls in the `actions` slot keep their own.

- Every changed line has a `+` or `−` sign in text, and changed words are `<ins>` and `<del>` elements: color is never the only signal.
- The counts are read as words (`countsLabel`). The visible `+3 −2` is hidden from assistive technology. Translate `countsLabel` if you override it.
- The code stays left-to-right in every direction. The header mirrors in RTL.
- Soft add and delete fills keep a 4.5:1 contrast for their text, and line numbers keep 4.5:1.

## Related

- [Diff in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/diff): anatomy, tokens and live examples.
- [Code](code.md) for showing a single version of code.

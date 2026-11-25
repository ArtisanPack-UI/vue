---
title: EmptyState
menu_order: 20
meta_description: The Vue EmptyState component. Explains why a list or page is empty and what to do next, with every prop, slot and part.
---

# EmptyState

Explains why there's nothing here and what to do next. It renders a `<div>` with an icon tile tinted by the variant, a heading, a description and an actions row. Use it in place of an empty list, table or page. For content that failed to load, use [ErrorState](error-state.md).

```ts
import { EmptyState } from '@artisanpack-ui/vue/feedback';
// or
import { EmptyState } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { EmptyState } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';
</script>

<template>
  <EmptyState
    title="No listings yet"
    description="Add your first listing to start getting inquiries."
  >
    <template #actions>
      <Button leading-icon="plus" href="/listings/new">New listing</Button>
    </template>
  </EmptyState>
</template>
```

### Variants

`variant` says why it's empty. It picks the tile's tint and the default icon.

| Variant      | Default icon   | Use it when                                          |
| ------------ | -------------- | ---------------------------------------------------- |
| `first-use`  | `inbox`        | Nothing has been created yet.                        |
| `no-results` | `search-x`     | A search or filter matched nothing.                  |
| `cleared`    | `circle-check` | Everything has been handled, such as an empty inbox. |

```vue
<script setup lang="ts">
import { EmptyState } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';

function clearFilters(): void {
  // …
}
</script>

<template>
  <EmptyState
    variant="no-results"
    title="No listings match your filters"
    description="Try fewer filters or a different search."
  >
    <template #actions>
      <Button variant="outline" color="neutral" @click="clearFilters">Clear filters</Button>
    </template>
  </EmptyState>
</template>
```

### Size, alignment and icon

`size="sm"` suits a panel or card. `align="start"` lines the content up with the start edge. `icon` replaces the variant's icon with any name from the icon registry.

```vue
<template>
  <EmptyState size="sm" align="start" icon="mail" title="No messages" />
</template>
```

### Heading level

The title renders as an `<h3>` by default. Set `headingLevel` (2 to 6) to fit the page's outline. Values outside the range are clamped.

```vue
<template>
  <EmptyState :heading-level="2" title="No saved searches" />
</template>
```

## Props

| Prop           | Type                                       | Default       | Description                                                                                        |
| -------------- | ------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------- |
| `variant`      | `'first-use' \| 'no-results' \| 'cleared'` | `'first-use'` | Why it's empty. Picks the tile's tint and default icon. Emitted as `data-variant`.                 |
| `size`         | `'sm' \| 'md'`                             | `'md'`        | `md` for a page or card, `sm` for a panel. Emitted as `data-size`.                                 |
| `align`        | `'center' \| 'start'`                      | `'center'`    | Centered, or aligned to the start edge. Emitted as `data-align`.                                   |
| `icon`         | `string`                                   | —             | An icon name from the icon registry. Defaults to the variant's icon. The `icon` slot overrides it. |
| `title`        | `string`                                   | —             | Why it's empty, rendered as a heading. The `title` slot overrides it.                              |
| `description`  | `string`                                   | —             | What to do next. The `description` and default slots override it.                                  |
| `actions`      | `string`                                   | —             | Text for the actions row. Usually you use the `actions` slot instead.                              |
| `headingLevel` | `number`                                   | `3`           | The title's heading level, clamped to 2–6.                                                         |
| `classes`      | `Partial<Record<EmptyStatePart, string>>`  | —             | Extra classes per [part](#parts). Use `class` for the root.                                        |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<div>`.

## Slots

| Slot          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `default`     | The description. Used when the `description` slot isn't set. |
| `title`       | Replaces the `title` prop, inside the heading element.       |
| `description` | Replaces the `description` prop and the default slot.        |
| `icon`        | Replaces the icon in the tile. The tile stays `aria-hidden`. |
| `actions`     | Buttons or links for the next step.                          |

## Events

EmptyState has no events of its own. Listeners fall through to the root element.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element   | Description                                                          |
| ------------- | --------- | -------------------------------------------------------------------- |
| `root`        | `div`     | The empty state, `.apui-empty-state`.                                |
| `icon`        | `span`    | The icon tile. `aria-hidden`.                                        |
| `title`       | `h2`–`h6` | The heading, at `headingLevel`. Only rendered when there is a title. |
| `description` | `div`     | The description. Only rendered when there is one.                    |
| `actions`     | `div`     | The actions row. Only rendered when there are actions.               |

## Types

```ts
import type { EmptyStatePart, EmptyStateProps } from '@artisanpack-ui/vue/feedback';
```

| Type              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `EmptyStateProps` | The component's props.                                      |
| `EmptyStatePart`  | `'root' \| 'icon' \| 'title' \| 'description' \| 'actions'` |

## Accessibility

EmptyState adds no keyboard behavior of its own; focus moves through the actions as usual.

- The title is a real heading. Set `headingLevel` so it fits the page outline.
- The icon tile is decorative (`aria-hidden`). The title and description carry the meaning.
- Text keeps a 4.5:1 contrast ratio in every theme.
- EmptyState has no live-region role. When it replaces content after a search, announce the result count yourself if that matters.

## Related

- [EmptyState in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/empty-state): anatomy, tokens and live examples.
- [ErrorState](error-state.md) for content that failed to load.
- [Table](../data/table.md), which shows its own empty text.

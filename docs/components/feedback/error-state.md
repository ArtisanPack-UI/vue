---
title: ErrorState
menu_order: 30
meta_description: The Vue ErrorState component. Explains what failed and how to recover, with variants, a status numeral, a reference code and focus handling.
---

# ErrorState

Explains what failed, what's safe and how to recover, in place of content that couldn't load. It renders a `<div role="alert">` with an icon tile or a large numeral, a heading, a description, a reference code and recovery actions. Use it for a failed request, an offline state, a missing page or a permission error. For a list of form errors, use [ValidationSummary](../form/validation-summary.md); for an inline message, use an [Alert](alert.md).

```ts
import { ErrorState } from '@artisanpack-ui/vue/feedback';
// or
import { ErrorState } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ErrorState } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';

function reload(): void {
  // …
}
</script>

<template>
  <ErrorState
    title="We couldn't load your listings"
    description="Your listings are safe. Try again in a moment."
    code="REQ-4F2A"
  >
    <template #actions>
      <Button @click="reload">Try again</Button>
    </template>
  </ErrorState>
</template>
```

### Variants

`variant` says what failed. It picks the tile's tint and the default icon.

| Variant     | Default visual      | Use it when                       |
| ----------- | ------------------- | --------------------------------- |
| `request`   | `server-crash` icon | A request failed.                 |
| `offline`   | `wifi-off` icon     | The connection dropped.           |
| `not-found` | `404` numeral       | The page or record doesn't exist. |
| `forbidden` | `lock` icon         | The person can't access it.       |

```vue
<script setup lang="ts">
import { ErrorState } from '@artisanpack-ui/vue/feedback';
import { Button } from '@artisanpack-ui/vue/form';
</script>

<template>
  <ErrorState
    variant="not-found"
    title="This listing doesn't exist"
    description="It may have been removed or the link is wrong."
  >
    <template #actions>
      <Button href="/listings">Back to listings</Button>
    </template>
  </ErrorState>
</template>
```

### Numeral and icon

`numeral` shows a large status number, such as `503`, in place of the default icon. An explicit `icon` (or the `icon` slot) still shows alongside a numeral.

```vue
<template>
  <ErrorState numeral="503" title="We're down for maintenance" description="Back by 04:00 UTC." />
  <ErrorState variant="offline" size="sm" align="start" title="You're offline" />
</template>
```

### Full-page errors

On a full-page error, set `focusTitle` so focus moves to the title when it renders. The title gets `tabindex="-1"` and shows the focus ring. Turning `focusTitle` on later focuses the title once it has re-rendered.

```vue
<template>
  <ErrorState
    focus-title
    :heading-level="1"
    variant="forbidden"
    title="You don't have access to this workspace"
    description="Ask a workspace owner to invite you."
  />
</template>
```

## Props

| Prop           | Type                                                   | Default     | Description                                                                                        |
| -------------- | ------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------- |
| `variant`      | `'request' \| 'offline' \| 'not-found' \| 'forbidden'` | `'request'` | What failed. Picks the tint and default icon; `not-found` shows `404`. Emitted as `data-variant`.  |
| `size`         | `'sm' \| 'md'`                                         | `'md'`      | `md` for a page or card, `sm` for a panel. Emitted as `data-size`.                                 |
| `align`        | `'center' \| 'start'`                                  | `'center'`  | Centered, or aligned to the start edge. Emitted as `data-align`.                                   |
| `icon`         | `string`                                               | —           | An icon name from the icon registry. Defaults to the variant's icon. The `icon` slot overrides it. |
| `numeral`      | `string`                                               | —           | A large status number, such as `'404'` or `'503'`, in place of the default icon.                   |
| `title`        | `string`                                               | —           | What failed, rendered as a heading. The `title` slot overrides it.                                 |
| `description`  | `string`                                               | —           | What's safe and what to do. The `description` and default slots override it.                       |
| `code`         | `string`                                               | —           | A reference people can quote to support.                                                           |
| `actions`      | `string`                                               | —           | Text for the actions row. Usually you use the `actions` slot instead.                              |
| `headingLevel` | `number`                                               | `3`         | The title's heading level, clamped to 1–6.                                                         |
| `focusTitle`   | `boolean`                                              | `false`     | Moves focus to the title when it renders, for a full-page error.                                   |
| `classes`      | `Partial<Record<ErrorStatePart, string>>`              | —           | Extra classes per [part](#parts). Use `class` for the root.                                        |

The component sets `inheritAttrs: false` and binds `class`, `style` and every other attribute to the root `<div>`.

## Slots

| Slot          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `default`     | The description. Used when the `description` slot isn't set. |
| `title`       | Replaces the `title` prop, inside the heading element.       |
| `description` | Replaces the `description` prop and the default slot.        |
| `icon`        | Replaces the icon in the tile. The tile stays `aria-hidden`. |
| `actions`     | Recovery buttons or links.                                   |

## Events

ErrorState has no events of its own. Listeners fall through to the root element.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part          | Element   | Description                                                                          |
| ------------- | --------- | ------------------------------------------------------------------------------------ |
| `root`        | `div`     | The error state, `.apui-error-state`, `role="alert"`.                                |
| `icon`        | `span`    | The icon tile. `aria-hidden`. Not rendered when a numeral replaces the default icon. |
| `numeral`     | `span`    | The large status number. Only rendered with `numeral` or the `not-found` variant.    |
| `title`       | `h1`–`h6` | The heading, at `headingLevel`. Carries `data-focus-title` with `focusTitle`.        |
| `description` | `div`     | The description. Only rendered when there is one.                                    |
| `code`        | `span`    | The reference code. Only rendered with `code`.                                       |
| `actions`     | `div`     | The actions row. Only rendered when there are actions.                               |

## Types

```ts
import type { ErrorStatePart, ErrorStateProps } from '@artisanpack-ui/vue/feedback';
```

| Type              | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `ErrorStateProps` | The component's props.                                                             |
| `ErrorStatePart`  | `'root' \| 'icon' \| 'numeral' \| 'title' \| 'description' \| 'code' \| 'actions'` |

## Accessibility

| Keys  | Action                                                                            |
| ----- | --------------------------------------------------------------------------------- |
| `Tab` | Moves through the recovery actions. With `focusTitle`, focus starts on the title. |

- The root is `role="alert"`, so an error that replaces content is announced.
- On a full-page error, set `focusTitle` so focus moves to the title, which shows the focus ring.
- The title is a real heading. Set `headingLevel` so it fits the page outline.
- The icon tile is decorative (`aria-hidden`).
- Say what failed and what's safe, include a reference code people can quote, and don't blame the person.

## Related

- [ErrorState in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/error-state): anatomy, tokens and live examples.
- [EmptyState](empty-state.md) for lists and pages that are empty, not broken.
- [Alert](alert.md) for an inline message about a section.
- [ValidationSummary](../form/validation-summary.md) for a list of form errors.

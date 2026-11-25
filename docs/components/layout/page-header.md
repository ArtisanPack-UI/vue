---
title: PageHeader
menu_order: 120
meta_description: The Vue PageHeader component. The title block at the top of a page, with breadcrumbs, meta, description, actions and tabs.
---

# PageHeader

The title block at the top of a page. It renders breadcrumbs, then a row with the meta, the title (the page's `<h1>` by default) and the description beside the actions, then tabs. Each region is a plain-text prop or a slot of the same name, and is left out when empty.

```ts
import { PageHeader } from '@artisanpack-ui/vue/layout';
// or
import { PageHeader } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue/form';
import { PageHeader } from '@artisanpack-ui/vue/layout';
</script>

<template>
  <PageHeader
    title="Dashboard"
    description="Income, profit and transactions across all stores."
    meta="Edited 20 min ago"
  >
    <template #actions>
      <Button variant="outline" color="neutral">Share</Button>
      <Button leading-icon="plus">New report</Button>
    </template>
  </PageHeader>
</template>
```

### Breadcrumbs and tabs

The `breadcrumbs` slot sits above the title row and the `tabs` slot below it.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { PageHeader, Tab, Tabs } from '@artisanpack-ui/vue/layout';
import { Breadcrumbs } from '@artisanpack-ui/vue/navigation';

const tab = ref('overview');
const trail = [{ label: 'Listings', href: '/listings' }, { label: 'Cedarwood Estates' }];
</script>

<template>
  <PageHeader title="Cedarwood Estates">
    <template #breadcrumbs>
      <Breadcrumbs :items="trail" />
    </template>
    <template #tabs>
      <Tabs v-model="tab" label="Listing sections">
        <Tab value="overview" label="Overview" />
        <Tab value="offers" label="Offers" />
      </Tabs>
    </template>
  </PageHeader>
</template>
```

### Heading level

The title is an `<h1>` by default. Set `level` (1 to 6) when the header sits below the page's main heading. Values outside the range are clamped.

```vue
<template>
  <PageHeader :level="2" title="Team settings" />
</template>
```

## Props

| Prop          | Type                                      | Default | Description                                                                             |
| ------------- | ----------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `title`       | `string`                                  | —       | The page's title. The `title` slot overrides it.                                        |
| `description` | `string`                                  | —       | Supporting text under the title. The `description` slot overrides it.                   |
| `level`       | `number`                                  | `1`     | The title's heading level, clamped to 1–6.                                              |
| `breadcrumbs` | `string`                                  | —       | Breadcrumbs above the title. Usually the `breadcrumbs` slot.                            |
| `meta`        | `string`                                  | —       | Status above the title, such as when the page was edited. The `meta` slot overrides it. |
| `actions`     | `string`                                  | —       | Buttons at the inline end of the title row. Usually the `actions` slot.                 |
| `tabs`        | `string`                                  | —       | Tabs under the title row. Usually the `tabs` slot.                                      |
| `classes`     | `Partial<Record<PageHeaderPart, string>>` | —       | Extra classes per [part](#parts). `classes.root` merges with `class`.                   |

`class`, `style` and other attributes go to the root `<div>`.

## Slots

| Slot          | Description                                             |
| ------------- | ------------------------------------------------------- |
| `title`       | The heading content. Replaces `title`.                  |
| `description` | Replaces `description`.                                 |
| `breadcrumbs` | Above the title row. Replaces `breadcrumbs`.            |
| `meta`        | Above the title. Replaces `meta`.                       |
| `actions`     | At the inline end of the title row. Replaces `actions`. |
| `tabs`        | Under the title row. Replaces `tabs`.                   |

PageHeader has no default slot.

## Events

PageHeader has no events.

## Parts

Pass extra classes to a part with `classes`. Every part except the root carries a `data-part` attribute you can also target in CSS.

| Part          | Element   | Description                                                       |
| ------------- | --------- | ----------------------------------------------------------------- |
| `root`        | `div`     | The header, `.apui-page-header`.                                  |
| `breadcrumbs` | `div`     | The breadcrumbs region.                                           |
| `row`         | `div`     | The row holding the title group and the actions. Always rendered. |
| `meta`        | `div`     | The status above the title.                                       |
| `title`       | `h1`–`h6` | The title.                                                        |
| `description` | `p`       | The description.                                                  |
| `actions`     | `div`     | The actions.                                                      |
| `tabs`        | `div`     | The tabs region.                                                  |

## Types

```ts
import type { PageHeaderPart, PageHeaderProps } from '@artisanpack-ui/vue/layout';
```

| Type              | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `PageHeaderProps` | The component's props.                                                                          |
| `PageHeaderPart`  | `'root' \| 'breadcrumbs' \| 'row' \| 'meta' \| 'title' \| 'description' \| 'actions' \| 'tabs'` |

## Accessibility

PageHeader has no keyboard interaction of its own; the controls you put in it keep theirs.

- The title is the page's `<h1>` unless `level` says otherwise. Keep one `h1` per page.
- The description is plain text after the heading, so it's read in order.
- Actions keep the order they're read in: put the primary action last, at the inline end.
- The row wraps rather than overflowing at 320px.

## Related

- [PageHeader in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/page-header): anatomy, tokens and live examples.
- [Breadcrumbs](../navigation/breadcrumbs.md) and [Tabs](tabs.md) for its regions.
- [Heading](heading.md) for section titles.
- [AppShell](app-shell.md) for the frame around the page.

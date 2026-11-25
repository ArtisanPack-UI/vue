---
title: Tabs
menu_order: 150
meta_description: The Vue Tabs and Tab components. Switch between views of the same content, with v-model, variants, orientation and activation modes.
---

# Tabs

Switches between views of the same content. It renders a tablist of trigger buttons and one panel per tab, with a roving tabindex and arrow keys that follow the orientation and the text direction. Build it from `Tab` children, each describing a trigger and holding its panel, or pass the same tabs as data with `tabs`.

```ts
import { Tab, Tabs } from '@artisanpack-ui/vue/layout';
// or
import { Tab, Tabs } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Tab, Tabs } from '@artisanpack-ui/vue/layout';

const section = ref('overview');
</script>

<template>
  <Tabs v-model="section" label="Sections">
    <Tab value="overview" label="Overview" icon="list">Your portfolio at a glance.</Tab>
    <Tab value="notifications" label="Notifications" :count="4">Four unread notifications.</Tab>
    <Tab value="history" label="Trade history">Every trade in the last year.</Tab>
    <Tab value="archived" label="Archived" disabled />
  </Tabs>
</template>
```

Each `Tab`'s `label`, `icon`, `count` and `disabled` describe its trigger, and its default slot is the panel. `Tab` children must sit directly in the Tabs' default slot (`v-for` and `<template>` fragments are fine); a `Tab` wrapped in another component isn't found.

### Selected tab with v-model

`v-model` binds the selected tab's value. Without a value, the first enabled tab is selected, on the server too. When you pass `modelValue`, the tabs show exactly what it says, so a parent that ignores a change keeps the selection where it is.

### Tabs as data

`tabs` renders the same triggers and panels from an array. Data tabs render before any `Tab` children. `content` is plain text; use composed tabs for rich panels.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, type TabData } from '@artisanpack-ui/vue/layout';

const range = ref('week');
const ranges: TabData[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];
</script>

<template>
  <Tabs v-model="range" size="sm" label="Range" :tabs="ranges" />
</template>
```

### Variants and sizes

`variant` is `segmented` (the default) or `underline`. `size` is `sm` or `md` (the default).

```vue
<template>
  <Tabs variant="underline" label="Listing sections">
    <Tab value="overview" label="Overview">…</Tab>
    <Tab value="offers" label="Offers">…</Tab>
  </Tabs>
</template>
```

### Vertical tabs

`orientation="vertical"` lays the tablist out in a column. The up and down arrow keys then move between tabs.

```vue
<template>
  <Tabs orientation="vertical" variant="underline" label="Settings">
    <Tab value="profile" label="Profile">Name and photo.</Tab>
    <Tab value="security" label="Security">Password and two-factor.</Tab>
  </Tabs>
</template>
```

### Manual activation

With the default `automatic` activation, a tab is selected as soon as the arrow keys reach it. `activation-mode="manual"` only moves focus; `Enter` or `Space` selects. Use manual activation when showing a panel is slow.

```vue
<template>
  <Tabs activation-mode="manual" label="Reports">
    <!-- … -->
  </Tabs>
</template>
```

## Props

| Prop             | Type                                | Default        | Description                                                                                                           |
| ---------------- | ----------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `modelValue`     | `string`                            | —              | The selected tab's value. Bind with `v-model`. Without it, the first enabled tab is selected.                         |
| `tabs`           | `TabData[]`                         | —              | Tabs as data, rendered before the `Tab` children.                                                                     |
| `variant`        | `'segmented' \| 'underline'`        | `'segmented'`  | The visual treatment. Emitted as `data-variant`.                                                                      |
| `size`           | `'sm' \| 'md'`                      | `'md'`         | The triggers' size. Emitted as `data-size`.                                                                           |
| `orientation`    | `'horizontal' \| 'vertical'`        | `'horizontal'` | Lays the tablist out in a row or a column. Emitted as `data-orientation` and `aria-orientation`.                      |
| `activationMode` | `'automatic' \| 'manual'`           | `'automatic'`  | `automatic` selects as the arrow keys move; `manual` waits for `Enter` or `Space`. Emitted as `data-activation-mode`. |
| `label`          | `string`                            | —              | Names the tablist for assistive technology.                                                                           |
| `classes`        | `Partial<Record<TabsPart, string>>` | —              | Extra classes per [part](#parts). `classes.root` merges with `class`.                                                 |

`class`, `style` and other attributes go to the root `<div>`.

## v-model

| Binding   | Type     | Carries                   |
| --------- | -------- | ------------------------- |
| `v-model` | `string` | The selected tab's value. |

## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | `Tab` children, rendered after the `tabs` data. |

## Events

| Event                | Payload  | Description                            |
| -------------------- | -------- | -------------------------------------- |
| `@update:modelValue` | `string` | A tab was selected. Carries its value. |

## Parts

Pass extra classes to a part with `classes` on the Tabs. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element  | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `root`    | `div`    | The tabs, `.apui-tabs`.                                                   |
| `list`    | `div`    | The tablist, `role="tablist"`.                                            |
| `trigger` | `button` | A tab, `role="tab"`. Its text is the `label`, or the `value` without one. |
| `icon`    | `span`   | The trigger's icon. `aria-hidden`.                                        |
| `count`   | `span`   | The count at the end of the trigger.                                      |
| `content` | `div`    | A panel, `role="tabpanel"`. Hidden while another tab is selected.         |

## Tab

One tab of a Tabs. Its props describe the trigger that Tabs renders in the tablist, and its default slot is the panel. It must be inside a `Tabs`, or it throws. `class`, `style` and other attributes go to the panel.

### Tab props

| Prop       | Type               | Default | Description                                                                                                                            |
| ---------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | `string`           | —       | Required. The tab's value, unique within the tabs.                                                                                     |
| `label`    | `string`           | —       | The trigger's text. Falls back to `value`.                                                                                             |
| `icon`     | `string`           | —       | An icon name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), before the label. |
| `count`    | `string \| number` | —       | A count at the end of the trigger, such as unread items.                                                                               |
| `disabled` | `boolean`          | `false` | Disables the tab. The arrow keys skip it.                                                                                              |

### Tab slots

| Slot      | Description        |
| --------- | ------------------ |
| `default` | The panel content. |

Tab has no events.

## Deprecated types

| Type      | Replacement                                   |
| --------- | --------------------------------------------- |
| `TabItem` | `TabData`. It's an alias with the same shape. |

## Types

```ts
import type {
  TabData,
  TabProps,
  TabsActivationMode,
  TabsOrientation,
  TabsPart,
  TabsProps,
  TabsSize,
  TabsVariant,
} from '@artisanpack-ui/vue/layout';
```

| Type                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `TabsProps`          | The Tabs' props.                                                             |
| `TabProps`           | The Tab's props.                                                             |
| `TabData`            | One entry of `tabs`: `{ value, label, icon?, count?, disabled?, content? }`. |
| `TabItem`            | Deprecated alias of `TabData`.                                               |
| `TabsVariant`        | `'segmented' \| 'underline'`                                                 |
| `TabsSize`           | `'sm' \| 'md'`                                                               |
| `TabsOrientation`    | `'horizontal' \| 'vertical'`                                                 |
| `TabsActivationMode` | `'automatic' \| 'manual'`                                                    |
| `TabsPart`           | `'root' \| 'list' \| 'trigger' \| 'icon' \| 'count' \| 'content'`            |

## Accessibility

| Keys                      | Action                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ArrowRight`, `ArrowLeft` | Horizontal tabs: moves to the next or previous tab, wrapping, and following the text direction (in right-to-left layouts `ArrowLeft` moves to the next tab). Automatic activation selects it too. |
| `ArrowDown`, `ArrowUp`    | Vertical tabs: moves to the next or previous tab, wrapping.                                                                                                                                       |
| `Home`, `End`             | Moves to the first or last tab.                                                                                                                                                                   |
| `Enter`, `Space`          | Manual activation: selects the focused tab.                                                                                                                                                       |
| `Tab`                     | From the selected tab, moves into its panel; the other tabs are out of the Tab order.                                                                                                             |

- The tablist has `role="tablist"`, the triggers `role="tab"` and the panels `role="tabpanel"`. The selected trigger sets `aria-selected="true"` and controls its panel.
- Each panel is labelled by its trigger and is hidden while another tab is selected.
- Disabled tabs set `disabled` and `aria-disabled` and are skipped by the arrow keys.
- Name the tablist with `label` when a page has several sets of tabs.
- A count in a trigger is part of its name, so screen readers announce it.
- The selected trigger is shown by surface and edge, not by color alone.

## Related

- [Tabs in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/tabs): anatomy, tokens and live examples.
- [Accordion](accordion.md) when several sections may be open at once.
- [PageHeader](page-header.md), which has a `tabs` region.

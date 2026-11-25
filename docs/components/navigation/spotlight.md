---
title: Spotlight
menu_order: 60
meta_description: The Vue Spotlight command palette. Grouped results, the Cmd+K shortcut, server search, recent choices and v-model:open, with every prop, slot, event and part.
---

# Spotlight

A command palette: search across pages, records and actions from one dialog. ⌘K on Apple platforms, or Ctrl+K elsewhere, toggles it from anywhere on the page. The arrow keys move through the results, Enter opens one and Escape closes the palette. It replaces the deprecated `SpotlightSearch`.

```ts
import { Spotlight } from '@artisanpack-ui/vue/navigation';
// or
import { Spotlight } from '@artisanpack-ui/vue';
```

## Usage

Pass the results as `groups`. Spotlight filters them as the user types, by every word of the query against each item's label, description and keywords.

```vue
<script setup lang="ts">
import {
  Spotlight,
  type SpotlightGroup,
  type SpotlightResult,
} from '@artisanpack-ui/vue/navigation';

const groups: SpotlightGroup[] = [
  {
    label: 'Pages',
    items: [
      { label: 'Analytics › Reports', href: '/reports', icon: 'file-text', keywords: ['growth'] },
      { label: 'Settings', href: '/settings', icon: 'settings' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { value: 'add', label: 'Add property', icon: 'plus', color: 'success', shortcut: '⌘ N' },
      { value: 'import', label: 'Import listings from CSV', icon: 'upload' },
    ],
  },
];

function run(item: SpotlightResult & { value: string }): void {
  if (item.value === 'add') {
    // …
  }
}
</script>

<template>
  <Spotlight trigger="Search" :groups="groups" @select="run" />
</template>
```

An item with an `href` is a link: choosing it follows the link. Every chosen item is also reported with `select`, and the palette closes.

### Items

Each item takes a `label`, and optionally:

- `value`: identifies the item in `select`. Defaults to `href`, then `label`.
- `description`: secondary text under the label, searched too.
- `href`: makes the item a link. Only relative, `http`, `https`, `mailto`, `tel` and `sms` URLs are used; anything else renders a plain option.
- `icon` and `color`: an icon from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), drawn in a tile tinted by `color` (default `neutral`).
- `shortcut`: a keyboard hint at the end, such as `'⌘ N'` or `['⌘', 'N']`. Display only.
- `keywords`: more words the search matches.
- `disabled`: the item shows but can't be chosen, and the arrow keys skip it.

Matches in each label are marked with `<mark>`, ignoring case and accents.

### Opening the palette

With `trigger` (or the `trigger` slot), Spotlight renders an outline button that opens it and shows the shortcut's keys. Without one, the shortcut opens it, or bind `v-model:open`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@artisanpack-ui/vue/form';
import { Spotlight } from '@artisanpack-ui/vue/navigation';

const open = ref(false);
</script>

<template>
  <Button variant="ghost" leading-icon="search" @click="open = true">Search</Button>
  <Spotlight v-model:open="open" :groups="groups" />
</template>
```

`shortcut` changes the global shortcut: modifiers and a key joined with `+`, where `mod` is ⌘ on Apple platforms and Ctrl elsewhere, such as `'mod+shift+p'`. An empty string turns it off. A single-key shortcut never fires while typing in a field.

### Server search

With `remote`, Spotlight doesn't filter: `groups` are your results for the current query. Listen for `search-change`, fetch, and set `loading` while you wait. Binding `search` makes the query controlled.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { Spotlight, type SpotlightGroup } from '@artisanpack-ui/vue/navigation';

const search = ref('');
const results = ref<SpotlightGroup[]>([]);
const loading = ref(false);

watch(search, async (query) => {
  if (!query.trim()) {
    results.value = [];
    return;
  }
  loading.value = true;
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  results.value = await response.json();
  loading.value = false;
});
</script>

<template>
  <Spotlight
    trigger="Search listings"
    placeholder="Search listings…"
    :groups="results"
    :search="search"
    remote
    :loading="loading"
    @search-change="search = $event"
  />
</template>
```

`search-change` fires only for typing, not when the query is cleared on close. Debounce the request in a real app.

### Recent choices

With `recent`, the palette remembers the last choices and lists them first, in a Recent group, while the query is empty. They're kept in the browser's `localStorage` under a key built from the palette's `id`, so set a stable `id` when a page has more than one palette. It's off by default.

```vue
<template>
  <Spotlight id="global-search" trigger="Search" :groups="groups" recent />
</template>
```

### In place

By default the palette is modal and teleported to the end of `<body>`. Set `:portal="false"` to render it where it's written, and `:modal="false"` to leave the rest of the page reachable, such as for a palette that's always open in a page.

```vue
<template>
  <Spotlight :open="true" :modal="false" :portal="false" :groups="groups" />
</template>
```

## Props

| Prop            | Type                                     | Default                     | Description                                                                                                                                            |
| --------------- | ---------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `open`          | `boolean`                                | `false`                     | Whether it's open (`v-model:open`). Controlled when the parent passes it. Emitted as `data-state` on every part.                                       |
| `groups`        | `SpotlightGroup[]`                       | `[]`                        | The results, in groups. Unless `remote`, items are filtered as the user types.                                                                         |
| `search`        | `string`                                 | —                           | The query text. Passing it makes the query controlled; pair it with `@search-change`.                                                                  |
| `remote`        | `boolean`                                | `false`                     | The page searches: `groups` are the results for `search` and aren't filtered here.                                                                     |
| `loading`       | `boolean`                                | `false`                     | Shows the loading row and marks the results busy.                                                                                                      |
| `shortcut`      | `string`                                 | `'mod+k'`                   | The global shortcut: modifiers and a key joined with `+`. `mod` is ⌘ on Apple platforms and Ctrl elsewhere. Empty turns it off.                        |
| `recent`        | `boolean`                                | `false`                     | Lists recent choices first, in a Recent group, while the query is empty. Stored in `localStorage`.                                                     |
| `label`         | `string`                                 | `'Search'`, translated      | The palette's accessible name, also used for the query and the results.                                                                                |
| `placeholder`   | `string`                                 | `'Search…'`, translated     | The query's placeholder.                                                                                                                               |
| `emptyLabel`    | `string`                                 | `'No results.'`, translated | Shown when nothing matches. The `empty` slot overrides it.                                                                                             |
| `loadingLabel`  | `string`                                 | `'Searching…'`, translated  | Shown while loading.                                                                                                                                   |
| `recentLabel`   | `string`                                 | `'Recent'`, translated      | The Recent group's label.                                                                                                                              |
| `closeLabel`    | `string`                                 | `'Close'`, translated       | Part of the Esc button's accessible name, "Esc, Close".                                                                                                |
| `navigateLabel` | `string`                                 | `'Navigate'`, translated    | The footer's hint beside the arrow keys.                                                                                                               |
| `selectLabel`   | `string`                                 | `'Open'`, translated        | The footer's hint beside the Enter key.                                                                                                                |
| `trigger`       | `string`                                 | —                           | Text for a trigger button that opens the palette, shown with the shortcut's keys. The `trigger` slot overrides it. Without either, no trigger renders. |
| `footer`        | `string`                                 | —                           | Replaces the footer's key hints. The `footer` slot overrides it.                                                                                       |
| `modal`         | `boolean`                                | `true`                      | Traps focus, locks scroll and hides the rest of the page from assistive technology.                                                                    |
| `portal`        | `boolean`                                | `true`                      | Renders the palette at the end of `<body>` with `Teleport`. Off renders it in place.                                                                   |
| `classes`       | `Partial<Record<SpotlightPart, string>>` | —                           | Extra classes per [part](#parts).                                                                                                                      |

Spotlight sets `inheritAttrs: false`. `id` seeds the ids of every part (and the recent-choices storage key). `class`, `style` and every other attribute go to the panel (the `content` part, `.apui-spotlight`), not the trigger.

## v-model

| Binding        | Type      | Description                                                                                                                   |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | Whether the palette is open. Updated by the trigger, the shortcut, Escape, the Esc button, the backdrop and choosing an item. |

Without `open`, Spotlight keeps its own state. The query isn't a `v-model`: pass `search` and update it from `@search-change`.

## Slots

| Slot      | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `trigger` | The trigger button's content. Replaces `trigger`. The shortcut's keys still follow it. |
| `empty`   | Shown when nothing matches. Replaces `emptyLabel`.                                     |
| `footer`  | The footer. Replaces `footer` and the key hints.                                       |

## Events

| Event            | Payload                                     | Description                                                                              |
| ---------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@update:open`   | `open: boolean`                             | The palette opened or closed.                                                            |
| `@select`        | `item: SpotlightResult & { value: string }` | An item was chosen, with its resolved `value`. A recent item reports its original value. |
| `@search-change` | `search: string`                            | The user typed in the query.                                                             |

## Parts

Pass extra classes to a part with `classes`. Every part carries `data-scope="spotlight"` and a `data-part` attribute you can also target in CSS; multi-word parts use kebab case, such as `data-part="item-group"`.

| Part              | Element      | Description                                                                    |
| ----------------- | ------------ | ------------------------------------------------------------------------------ |
| `root`            | `div`        | The panel, `.apui-spotlight`. The same element as `content`.                   |
| `content`         | `div`        | The dialog panel. Carries `class` and attributes.                              |
| `trigger`         | `button`     | The trigger button. Only rendered with `trigger` or the `trigger` slot.        |
| `backdrop`        | `div`        | The backdrop behind the panel.                                                 |
| `positioner`      | `div`        | Positions the panel.                                                           |
| `search`          | `div`        | The search row.                                                                |
| `icon`            | `span`       | The search icon. `aria-hidden`.                                                |
| `query`           | `input`      | The query, a combobox.                                                         |
| `closeTrigger`    | `button`     | The Esc button.                                                                |
| `results`         | `div`        | The listbox of results.                                                        |
| `itemGroup`       | `div`        | One group, `role="group"`.                                                     |
| `itemGroupLabel`  | `div`        | A group's label.                                                               |
| `item`            | `a` or `div` | One result, an option. A link when it has a safe `href`. Carries `data-color`. |
| `tile`            | `span`       | An item's icon tile. `aria-hidden`.                                            |
| `itemText`        | `span`       | An item's label and description.                                               |
| `itemDescription` | `span`       | An item's description.                                                         |
| `shortcut`        | `span`       | Shortcut keys, on the trigger, an item or the footer. `aria-hidden`.           |
| `itemIndicator`   | `span`       | The Enter glyph at the end of a result. `aria-hidden`.                         |
| `empty`           | `div`        | The empty state.                                                               |
| `loading`         | `div`        | The loading row.                                                               |
| `footer`          | `div`        | The footer with the key hints.                                                 |

## Types

```ts
import type {
  SpotlightGroup,
  SpotlightPart,
  SpotlightProps,
  SpotlightResult,
} from '@artisanpack-ui/vue/navigation';
```

| Type              | Description                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `SpotlightProps`  | The component's props.                                                                                                   |
| `SpotlightGroup`  | A group: `{ id?: string; label?: string; items: SpotlightResult[] }`. `id` defaults to the position.                     |
| `SpotlightResult` | One result: `label`, and optionally `value`, `description`, `href`, `icon`, `color`, `shortcut`, `keywords`, `disabled`. |
| `SpotlightPart`   | The part names in the table above.                                                                                       |

`SpotlightItem`, also exported from this subpath, is the deprecated `SpotlightSearch`'s item type, not Spotlight's.

## Accessibility

| Keys                   | Action                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `⌘K`, `Ctrl+K`         | Anywhere on the page, opens or closes the palette (the `shortcut` prop).                                          |
| `ArrowDown`, `ArrowUp` | Move to the next or previous result across groups, wrapping and skipping disabled ones. Focus stays in the query. |
| `Home`, `End`          | Move to the first or last result.                                                                                 |
| `Enter`                | Opens the active result: follows its link or reports `select`, then closes.                                       |
| `Escape`               | Closes the palette and returns focus to where it was.                                                             |
| `Tab`, `Shift+Tab`     | Move between the query and the Esc button. Focus stays in the palette.                                            |

- A dialog named by `label`, holding a combobox (the query) that controls an always-open listbox. The active result is `aria-activedescendant` and `aria-selected`.
- Focus moves to the query on open and returns to where it was on close.
- A modal palette sets `aria-modal`, hides the rest of the page from assistive technology and locks scroll.
- Groups are `role="group"`, labelled by their label.
- The results count ("3 results", "No results") is announced politely after typing.
- The listbox sets `aria-busy` while loading.
- The shortcut is exposed with `aria-keyshortcuts` on the trigger and the query.
- The Esc button's accessible name contains its visible text: "Esc, Close".
- Matches are marked with `<mark>`, whose text stays in the option's accessible name. The Enter glyph is `aria-hidden`.
- The arrow keys keep their vertical meaning in right-to-left layouts.

## Related

- [Spotlight in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/spotlight): anatomy, tokens and live examples.
- [Combobox](../form/combobox.md) for picking a value in a form.
- [Kbd](../utility/kbd.md) for showing shortcuts in your own UI.
- [Deprecated components](../deprecated.md) for migrating from `SpotlightSearch`.

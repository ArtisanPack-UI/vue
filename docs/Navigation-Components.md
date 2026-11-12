# Navigation Components

```ts
import { Breadcrumbs, Menu, Navbar, Pagination, Sidebar, Spotlight, Steps } from '@artisanpack-ui/vue/navigation';
```

---

## Breadcrumbs

Shows where the current page sits in the hierarchy, built on the design system (`.apui-breadcrumbs`, styled by `@artisanpack-ui/css`): a `nav` landmark holding an ordered list. The last item is the current page; it has `aria-current="page"` and is never a link. Separators are `aria-hidden` and mirror in RTL. Past `maxItems` the middle levels collapse behind an overflow button that reveals them in place and moves focus to the first one.

### BreadcrumbItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | The level's name |
| `href` | `string` | Where it links; ignored on the last item |
| `icon` | `string` | An icon name from the registry, before the label |
| `hideLabel` | `boolean` | Keeps the label for screen readers only (a home icon) |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | The trail as data; `BreadcrumbsItem` children follow it, and the last level is the current page |
| `maxItems` | `number` | `4` | Entries shown before the middle collapses: the first, the overflow button and the last `maxItems - 2`. `0` never collapses |
| `label` | `string` | `'Breadcrumb'` | The landmark's accessible name; translate it |
| `overflowLabel` | `string` | `'Show {count} more levels'` | The overflow button's name; translate it |
| `classes` | `Partial<Record<BreadcrumbsPart, string>>` | — | Extra classes per part: `root`, `list`, `item`, `link`, `separator`, `current`, `overflow` |

The scoped `link` slot (`{ item, href, attrs }`) renders a router link; bind `attrs` on it:

```vue
<Breadcrumbs
  :items="[
    { label: 'Home', href: '/', icon: 'house', hideLabel: true },
    { label: 'Properties', href: '/properties' },
    { label: 'Lakeview Lofts' },
  ]"
>
  <template #link="{ item, href, attrs }">
    <InertiaLink v-bind="attrs" :href="href">{{ item.label }}</InertiaLink>
  </template>
</Breadcrumbs>
```

`BreadcrumbsItem` children (`v-for` included) render the same levels after `items`; the default slot overrides `label`, and other attributes (`@click`) go to the link:

```vue
<Breadcrumbs>
  <BreadcrumbsItem label="All media" href="#" @click.prevent="goToRoot" />
  <BreadcrumbsItem :label="folder.name" />
</Breadcrumbs>
```

---

## Link

Navigates somewhere, built on the design system (`.apui-link`). Inline links stay underlined, so color isn't the only cue; `standalone` links drop the underline until hover and take icons. Without an `href`, Link renders a `<button type="button">` with the same styles.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | The destination. Only relative, http, https, mailto, tel and sms URLs are used |
| `tone` | `'primary' \| 'muted'` | `'primary'` | `muted` for secondary links (`data-tone`) |
| `standalone` | `boolean` | `false` | A link on its own line (`data-standalone`) |
| `external` | `boolean` | `false` | Opens a new tab, adds the external-link icon and announces it |
| `externalLabel` | `string` | `'(opens in a new tab)'` | The visually hidden text an external link announces; translate it |
| `leadingIcon` / `trailingIcon` | `string` | — | Icon names before and after the text; arrows mirror in RTL |
| slots `icon` / `iconEnd` | — | — | Override the icon names |
| `classes` | `Partial<Record<LinkPart, string>>` | — | Extra classes per part: `root`, `icon`, `iconEnd` |

```vue
<Link href="/properties" standalone trailing-icon="arrow-right">View all properties</Link>
<Link href="https://docs.artisanpackui.dev" external>Documentation</Link>
<Link @click="logOut">Log out</Link>
```

---

## Menu

A navigation list in a nav landmark, built on the design system (`.apui-menu`, design-system #56): links with icons and badges, section titles, separators and collapsible sub-menus. The current page sets `aria-current="page"`, and a sub-menu holding it renders open. Sub-menus follow the disclosure pattern (a button with `aria-expanded`), so this isn't an ARIA menu; for actions use DropdownMenu.

```vue
<script setup lang="ts">
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/vue';
</script>

<template>
  <Menu label="Main">
    <MenuItem href="/dashboard" icon="list">Dashboard</MenuItem>
    <MenuSub label="Properties" icon="settings">
      <MenuItem href="/properties">All properties</MenuItem>
      <MenuItem href="/properties/lakeview" current>Lakeview Lofts</MenuItem>
    </MenuSub>
    <MenuItem href="/inbox" icon="mail" badge="12">Inbox</MenuItem>
    <MenuTitle>Settings</MenuTitle>
    <MenuItem href="/team" icon="user">Team</MenuItem>
    <MenuSeparator />
    <MenuItem href="/billing" disabled>Billing</MenuItem>
  </Menu>
</template>
```

`items` renders the same children from data: `{ label, href, icon, badge, current, disabled }`, `{ label, icon, open, items }` for a sub-menu, `{ type: 'title', label }` and `{ type: 'separator' }` (`MenuItemData`).

A sub-menu's `open` in data is its initial state; it still toggles, and it opens when an item inside becomes current. On `MenuSub`, `v-model:open` controls it only when it's a boolean; otherwise `default-open` sets the initial state. Sub-menus also take `badge` and `disabled`. `key` keeps an item's identity stable when the list changes.

**Upgrading from 2.x:** `MenuItem` is now the component. Importing `MenuItem` as a type still compiles: it's kept as the 2.x item shape (`name`, `label`, `href`, `active`, `disabled`, `children`) and marked deprecated. Use `MenuItemData` for `items`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItemData[]` | -- | The menu as data, before the children |
| `collapsible` | `boolean` | `true` | Sub-menus open and close; off shows them all, with a heading item |
| `label` | `string` | -- | Names the nav landmark |
| `classes` | `Partial<Record<MenuPart, string>>` | -- | Extra classes for `root`, `list`, `item`, `icon`, `itemText`, `badge`, `chevron`, `sub`, `title`, `separator` |

`MenuItem`: `href`, `icon`, `badge`, `current`, `disabled` (drops the href and leaves the Tab order); without `href` it's a button. `MenuSub`: `label`, `icon`, `v-model:open`. The old `name`/`children`/`active` item shape, `horizontal`, `size` and `color` are gone.

---

## Navbar

The top bar, built on the design system (`.apui-navbar`, design-system #56): a brand, primary links or a search, and actions, as a full-width bar or an island. Glass is a surface (`surface="glass"`), falling back to an opaque one under reduced transparency and in high contrast. On a narrow bar the links scroll rather than wrap.

```vue
<script setup lang="ts">
import { Button, Navbar, NavbarItem } from '@artisanpack-ui/vue';
</script>

<template>
  <Navbar>
    <template #brand><a href="/">Horizon</a></template>
    <NavbarItem href="/properties" current>Properties</NavbarItem>
    <NavbarItem href="/analytics">Analytics</NavbarItem>
    <template #actions>
      <Button size="sm" href="/register">Get started</Button>
    </template>
  </Navbar>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'bar' \| 'island'` | `'bar'` | Full-width bar or rounded island |
| `surface` | `'default' \| 'glass'` | `'default'` | The surface |
| `sticky` | `boolean` | `true` | Sticks to the top of the scrolling container |
| `brand`, `search`, `actions` | `string` | -- | Text for each region; the `#brand`, `#search` and `#actions` slots override them |
| `links` | `NavbarLinkData[]` | -- | Links as data (`{ label, href, current }`), before the `NavbarItem` children |
| `label` | `string` | `'Main'` | Names the links' nav landmark |
| `classes` | `Partial<Record<NavbarPart, string>>` | -- | Extra classes for `root`, `brand`, `links`, `link`, `search`, `actions` |

The old `start`/`center`/`end` slots, `color` and `glass` are gone: use `#brand`, the default slot and `#actions`, and `surface="glass"`.

---

## Pagination

Moves between the pages of a long list, built on the design system (`.apui-pagination`): previous, the first and last pages, `siblings` pages around the current one, next, and an optional summary, in a `nav` landmark. The control keeps one width as the page changes. On the first or last page, previous or next stays focusable with `aria-disabled="true"`. Their chevrons mirror in RTL.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | `1` | The current page, from 1 |
| `pageCount` | `number` | — | How many pages there are. Without it, `total / perPage` |
| `total` | `number` | — | How many items the list has |
| `perPage` | `number` | `10` | How many items a page holds |
| `siblings` | `number` | `1` | Pages on each side of the current one |
| `summary` | `boolean` | `false` | Shows the summary before the pages |
| `@page-change`, `@update:page` | `number` | — | A page, previous or next was chosen; `v-model:page` binds it |
| `label` | `string` | `'Pagination'` | The landmark's accessible name; translate it |
| `previousLabel` / `nextLabel` | `string` | `'Previous page'` / `'Next page'` | The icon-only buttons' names; translate them |
| `pageLabel` | `string` | `'Page {page}'` | Each page's name; translate it |
| `summaryLabel` | `string` | `'Showing {from}–{to} of {total}'` | The summary, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}`; `'Page {page} of {pageCount}'` without a total |
| `classes` | `Partial<Record<PaginationPart, string>>` | — | Extra classes per part: `root`, `summary`, `previous`, `page`, `ellipsis`, `next` |

`currentPage`, `totalPages`, `siblingCount`, `size`, `className` and `update:currentPage` of 1.x are gone: use `page` (`v-model:page`), `pageCount`, `siblings` and `page-change`.

```vue
<Pagination v-model:page="page" :total="318" :per-page="10" summary />
```

---

## Sidebar

Collapsible side navigation panel. Responsive: overlay on mobile, fixed on desktop.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Sidebar, Menu } from '@artisanpack-ui/vue/navigation';

const sidebarOpen = ref(false);
const sidebarItems = [
  { name: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { name: 'settings', label: 'Settings', href: '/settings' },
];
</script>

<template>
  <Sidebar v-model:open="sidebarOpen">
    <Menu :items="sidebarItems" />
  </Sidebar>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Visibility (`v-model:open`) |
| `side` | `'left' \| 'right'` | `'left'` | Side of the screen |
| `responsive` | `boolean` | `true` | Always visible on `lg`+ breakpoints |
| `ariaLabel` | `string` | `'Sidebar navigation'` | Accessible label |
| `className` | `string` | -- | Additional CSS classes |

---

## Spotlight

A command palette for searching across pages, records and actions, built on the design system (`.apui-spotlight`, design-system #57). It's a modal dialog holding a search combobox whose listbox of grouped results is always open. ⌘K (Ctrl+K elsewhere) toggles it from anywhere on the page; the arrow keys move through the results, Enter opens one and Escape closes it. Replaces [SpotlightSearch](#spotlightsearch).

```vue
<script setup lang="ts">
import { Spotlight, type SpotlightGroup, type SpotlightResult } from '@artisanpack-ui/vue';

const groups: SpotlightGroup[] = [
  { label: 'Pages', items: [{ label: 'Reports', href: '/reports', icon: 'file-text' }] },
  { label: 'Actions', items: [{ value: 'add', label: 'Add property', icon: 'plus', shortcut: '⌘ N' }] },
];

function run(item: SpotlightResult) {
  if (!item.href) console.log('Run', item.value);
}
</script>

<template>
  <Spotlight trigger="Search" :groups="groups" @select="run" />
</template>
```

Each item takes `label`, and optionally `value` (defaults to `href`, then `label`), `description`, `href` (a link, followed when chosen), `icon` (a registry name, drawn in a tile), `color` (tints the tile), `shortcut` (a display hint such as `'⌘ N'`), `keywords` (more words to match) and `disabled`. Groups take `label`, `items` and an optional stable `id`. Unless `remote`, items are filtered as the user types by every word against label, description and keywords, and the matched words are marked with `<mark>`; the active result ends with an Enter glyph. With `recent`, recent choices come first in a Recent group while the query is empty (kept in `localStorage`, per `id`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether it's open. Bind it with `v-model:open` |
| `groups` | `SpotlightGroup[]` | `[]` | The results, in groups |
| `search` | `string` | -- | The query (controlled). Pair it with `@search-change` |
| `remote` | `boolean` | `false` | The page searches: `groups` are the results and aren't filtered here |
| `loading` | `boolean` | `false` | Shows the loading row and sets `aria-busy` on the results |
| `shortcut` | `string` | `'mod+k'` | Modifiers and a key joined with `+`; `mod` is ⌘ on Apple platforms and Ctrl elsewhere. Empty turns it off |
| `recent` | `boolean` | `false` | Recent choices first while the query is empty. Opt-in: they're kept in `localStorage` per `id` |
| `label` | `string` | `'Search'` | The palette's accessible name; translate it |
| `placeholder` | `string` | `'Search…'` | The query's placeholder; translate it |
| `emptyLabel` | `string` | `'No results.'` | Shown when nothing matches; the `#empty` slot overrides it |
| `loadingLabel` | `string` | `'Searching…'` | Shown while loading; translate it |
| `recentLabel` | `string` | `'Recent'` | The Recent group's label; translate it |
| `closeLabel` | `string` | `'Close'` | The Esc button's accessible name, after its visible key ("Esc, Close"); translate it |
| `navigateLabel` | `string` | `'Navigate'` | The footer hint beside the arrow keys; translate it |
| `selectLabel` | `string` | `'Open'` | The footer hint beside the Enter key; translate it |
| `trigger` | `string` | -- | Content for an outline trigger button, shown with the shortcut's keys; the `#trigger` slot overrides it |
| `footer` | `string` | -- | Replaces the footer's key hints; the `#footer` slot overrides it |
| `modal` | `boolean` | `true` | Traps focus, locks scroll and sets `aria-modal` |
| `portal` | `boolean` | `true` | Teleports the palette to the body. Off renders it in place |
| `classes` | `Partial<Record<SpotlightPart, string>>` | -- | Extra classes per part: `root`, `trigger`, `backdrop`, `positioner`, `search`, `icon`, `query`, `closeTrigger`, `results`, `itemGroup`, `itemGroupLabel`, `item`, `tile`, `itemText`, `itemDescription`, `shortcut`, `itemIndicator`, `empty`, `loading`, `footer` |

Events: `update:open` (it opened or closed itself: trigger, shortcut, Escape, backdrop, Esc button, a choice), `select` (the chosen item, with its `value`) and `search-change` (the query as the user types, and `''` when it closes). Other attributes go to the panel; pass an `id` to keep recent choices apart between palettes.

For server search, fetch from `@search-change` and pass the results back with `remote` and `loading`:

```vue
<Spotlight :groups="results" :search="search" remote :loading="loading" @search-change="search = $event" />
```

The behavior composable is `useSpotlight` from `@artisanpack-ui/behavior/vue`, if you need your own markup.

---

## SpotlightSearch

> **Deprecated.** Use [Spotlight](#spotlight). SpotlightSearch will be removed in a later major release. Its item type keeps the name `SpotlightItem`; Spotlight's item type is `SpotlightResult`.

Command palette / search overlay triggered by Cmd+K / Ctrl+K. Provides keyboard navigation, fuzzy filtering, and grouped results.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SpotlightSearch } from '@artisanpack-ui/vue/navigation';

const spotlightOpen = ref(false);
const commands = [
  { id: '1', label: 'Go to Dashboard', description: 'Navigate to dashboard', group: 'Navigation' },
  { id: '2', label: 'Create Post', description: 'Create a new blog post', group: 'Actions' },
];
</script>

<template>
  <SpotlightSearch v-model:open="spotlightOpen" :items="commands" placeholder="Type a command..." />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | -- | Visibility (`v-model:open`) |
| `items` | `SpotlightItem[]` | **required** | Searchable items |
| `placeholder` | `string` | `'Search...'` | Search input placeholder |
| `ariaLabel` | `string` | `'Search'` | Accessible label |
| `className` | `string` | -- | Additional CSS classes |

---

## Steps

Shows progress through a sequence, built on the design system (`.apui-steps`): an ordered list of steps, each complete, current, upcoming or in error. Compose it from `Step` children (numbered by position, `v-for` included), or pass the same structure as `steps`. The current step has `aria-current="step"`; complete and error steps carry visually hidden text.

### StepItem / Step props

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | The step's name (a `Step`'s default slot overrides it) |
| `description` | `string` | Supporting text under the title |
| `state` | `'complete' \| 'current' \| 'upcoming' \| 'error'` | The step's own state; without it, `value` decides |
| `icon` | `string` | An icon name that replaces the marker's number or check |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | — | The steps as data, rendered before the slot |
| `modelValue` (`v-model`) | `number` | — | The current step, from 1; `update:modelValue` reports a completed step chosen while `clickable` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | `data-orientation` |
| `clickable` | `boolean` | `false` | Completed steps' titles become buttons |
| `label` | `string` | — | The list's accessible name |
| `completeLabel` / `errorLabel` | `string` | `'Completed'` / `'Error'` | Hidden state text; translate it |
| `classes` | `Partial<Record<StepsPart, string>>` | — | Extra classes per part, steps included: `root`, `step`, `marker`, `title`, `connector`, `description` |

`currentStep` (0-based), `vertical`, `color` and `className` of 1.x are gone, and items take `title` instead of `label`: use `v-model` (from 1) and `orientation`.

```vue
<Steps v-model="step" label="Checkout progress">
  <Step title="Cart" />
  <Step title="Shipping" />
  <Step title="Payment" />
</Steps>

<Steps v-model="step" clickable :steps="[{ title: 'Cart' }, { title: 'Shipping' }]" />
```

---
title: Layout
menu_order: 20
meta_description: The Vue layout components. App frames, containers, overlays, menus, tabs and type primitives from @artisanpack-ui/vue/layout.
---

# Layout

Layout components build the structure of a page: the app frame and page header, containers and layout primitives, overlays such as dialogs and drawers, menus, tabs and the type primitives. Import them from `@artisanpack-ui/vue/layout`, or from the package root.

```ts
import { Card, Dialog, Stack } from '@artisanpack-ui/vue/layout';
```

## Components

- [Accordion](layout/accordion.md): stacked sections that expand and collapse, with `AccordionItem`.
- [AppShell](layout/app-shell.md): the application frame with a sidebar, header and main landmark.
- [Card](layout/card.md): a surface with optional media, header, body and footer.
- [Collapse](layout/collapse.md): a single disclosure or read-more region.
- [Dialog](layout/dialog.md): a modal window for a focused task or a confirmation.
- [Divider](layout/divider.md): a horizontal, vertical or labelled rule.
- [Drawer](layout/drawer.md): a panel that slides in from an edge.
- [DropdownMenu](layout/dropdown-menu.md): actions and options anchored to a trigger, with `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`.
- [Grid](layout/grid.md): children in equal, optionally reflowing columns.
- [Heading](layout/heading.md): a title with separate semantic level and visual size.
- [ListItem](layout/list-item.md): a row with leading, title, description and trailing parts, with `List`.
- [PageHeader](layout/page-header.md): the title block at the top of a page.
- [Popover](layout/popover.md): an anchored, non-modal panel for a short task.
- [Stack](layout/stack.md): children in a column or a row.
- [Tabs](layout/tabs.md): switches between views of the same content, with `Tab`.
- [Text](layout/text.md): body text with a size, tone and weight.
- [UserMenu](layout/user-menu.md): the account menu with workspaces, theme and Log out.

`Modal` and `Dropdown`/`DropdownItem` are still exported from `/layout` as deprecated aliases of Dialog and DropdownMenu. See [Deprecated components](deprecated.md).

## Shared behavior

### Overlays

Dialog, Drawer, Popover, DropdownMenu and UserMenu share a few conventions:

- `v-model:open` binds whether they're open. When you pass `open`, they're controlled: they report every change through `update:open` and show only what the prop says, so a parent that ignores a change keeps them where they are. Without `open`, they keep their own state.
- They teleport their panel to the end of `<body>`. Set `:portal="false"` to render it in place.
- They don't inherit attributes onto a wrapper: `class`, `style`, `aria-label` and other attributes go to the panel, not the trigger.
- Their `root` and `content` parts are the same element, the panel.

### Composed or data-driven

Accordion, Tabs and DropdownMenu accept their children either as components (`AccordionItem`, `Tab`, `DropdownMenuItem`) or as data (`items` or `tabs`). Both render the same markup, and data entries render before composed children. Child components throw when they're rendered outside their parent.

### Props and slots

Where a component has a text region, such as a card's `title` or a page header's `actions`, it takes a plain-text prop and a slot of the same name. The slot wins, and an empty region isn't rendered. Components with several elements take a `classes` prop that adds classes per part; the part names are exported as types (`CardPart`, `DialogPart`, …).

### Translated labels

Built-in labels, such as Dialog's "Close" and AppShell's "Skip to main content", are translated through the package's translation catalogues. Each one also has a prop (`closeLabel`, `skipLabel`, …) to override it.

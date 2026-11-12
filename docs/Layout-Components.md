# Layout Components

```ts
import {
  Accordion, Card, Collapse, Dialog, Divider, Drawer, DropdownMenu, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator, Grid, Popover, Stack, Tabs,
} from '@artisanpack-ui/vue/layout';
```

---

## Accordion

Container that manages open/close state of child Collapse components. Supports single and multiple open panels.

```vue
<Accordion>
  <Collapse title="Section 1">Content 1</Collapse>
  <Collapse title="Section 2">Content 2</Collapse>
</Accordion>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously |
| `openIndices` | `number[]` | -- | Controlled mode: currently open panel indices |
| `defaultOpenIndices` | `number[]` | -- | Uncontrolled mode: initially open panel indices |
| `join` | `boolean` | `true` | Apply DaisyUI join styling to group panels |

---

## Card

Content container with optional header, footer, figure, and menu slots. Renders as `<a>` when `link` is provided.

```vue
<Card title="Dashboard" subtitle="Overview">
  <template #header><h3>Custom Header</h3></template>
  Content here
  <template #footer><Button>Action</Button></template>
</Card>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- | Title rendered as `<h2>` |
| `subtitle` | `string` | -- | Subtitle below the title |
| `figurePosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Figure element position |
| `noShadow` | `boolean` | `false` | Remove card shadow |
| `bordered` | `boolean` | `false` | Add border |
| `compact` | `boolean` | `false` | Reduce padding |
| `glass` | `boolean` | `false` | Glass morphism styling |
| `link` | `string` | -- | Render as `<a>` with this URL |
| `external` | `boolean` | `false` | Open link in new tab |

---

## Collapse

Expandable/collapsible content section. Supports controlled (`v-model:open`) and uncontrolled modes.

```vue
<Collapse title="Details" icon="arrow">
  Expandable content here.
</Collapse>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Clickable heading text |
| `icon` | `'arrow' \| 'plus' \| 'none'` | `'arrow'` | Expand/collapse indicator style |
| `open` | `boolean` | -- | Controlled open state (`v-model:open`) |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `name` | `string` | -- | Radio group name for single-open behavior |
| `bordered` | `boolean` | `false` | Add border |
| `disabled` | `boolean` | `false` | Disable interaction |

---

## Dialog

A modal window for a focused task or a confirmation, built on the design system (`.apui-dialog`, design-system #49). Focus moves into the dialog and is trapped while it's modal, page scroll is locked and the rest of the page is hidden from assistive technology. Escape, the close button and the backdrop close it, and focus returns to the trigger. Replaces Modal.

```vue
<script setup lang="ts">
import { Button, Dialog, Input } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <Dialog
    v-model:open="open"
    trigger="Invite member"
    title="Invite member"
    description="They'll get an email with a link to join the project."
  >
    <Input type="email" label="Email" />

    <template #footer>
      <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
      <Button @click="open = false">Send invite</Button>
    </template>
  </Dialog>
</template>
```

For a confirmation that interrupts, use `role="alertdialog"`: the backdrop doesn't close it, and focus starts on the close button, the safe action.

```vue
<Button color="error" variant="soft" @click="open = true">Delete listing</Button>
<Dialog
  v-model:open="open"
  role="alertdialog"
  size="sm"
  color="error"
  icon="trash"
  title="Delete Cedarwood Estates?"
  description="The listing and its 3 open offers will be removed. This can't be undone."
>
  <template #footer>
    <Button variant="outline" color="neutral" @click="open = false">Cancel</Button>
    <Button color="error" @click="open = false">Delete listing</Button>
  </template>
</Dialog>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether it's open. Passed (`v-model:open` or `:open`), it's controlled: it shows what the prop says, so ignoring `update:open` keeps it as it is. Not passed, the dialog keeps its own state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Panel width: 360px, 480px or 640px (`data-size`) |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | `alertdialog` for confirmations that interrupt |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The panel's surface (`data-surface`) |
| `color` | semantic color | -- | Tints the header icon (`data-color`) |
| `icon` | `string` | -- | Icon name from the registry, in a tinted circle before the title |
| `title` | `string` | -- | The heading (`<h2>`) and the dialog's accessible name |
| `description` | `string` | -- | Supporting text, linked with `aria-describedby` |
| `footer` | `string` | -- | The actions row (usually the `#footer` slot) |
| `trigger` | `string` | -- | Renders a trigger button that opens the dialog |
| `modal` | `boolean` | `true` | Trap focus, lock scroll and hide the rest of the page |
| `portal` | `boolean` | `true` | Teleport to the body; `false` renders in place |
| `hideClose` | `boolean` | `false` | Hide the header's close button (Escape still closes) |
| `closeLabel` | `string` | `'Close'` | The close button's accessible name; translate it |
| `classes` | `Partial<Record<DialogPart, string>>` | -- | Extra classes per part (`header`, `body`, `footer`, …) |

**Slots:** default (body), `#trigger`, `#icon`, `#title`, `#description`, `#footer`. **Events:** `update:open` (`boolean`), when the dialog opens or closes itself. `class` and other attributes go to the panel.

---

## Divider

Visual separator with optional label and color.

```vue
<Divider />
<Divider label="OR" color="primary" />
<Divider vertical />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Vertical orientation |
| `color` | `DaisyColor` | -- | Color variant |
| `label` | `string` | -- | Inline label text |
| `labelPosition` | `'start' \| 'center' \| 'end'` | `'center'` | Label position |

---

## Drawer

Side panel overlay with focus trapping and keyboard dismissal.

```vue
<Drawer v-model:open="isOpen" aria-label="Navigation">
  <nav>Sidebar content</nav>
</Drawer>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Visibility (`v-model:open`) |
| `end` | `boolean` | `false` | Open from the right side |
| `persistent` | `boolean` | `false` | Prevent closing via Escape/overlay click |
| `ariaLabel` | `string` | -- | Accessible label |
| `ariaLabelledby` | `string` | -- | ID of labelling element |

---

## Dropdown (deprecated)

> Deprecated: use [DropdownMenu](#dropdownmenu). Dropdown and DropdownItem stay exported for now.

Trigger + popover menu with keyboard navigation and ARIA semantics.

```vue
<Dropdown label="Actions">
  <DropdownItem @click="edit">Edit</DropdownItem>
  <DropdownItem @click="remove" disabled>Delete</DropdownItem>
</Dropdown>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `'Options'` | Trigger button text |
| `end` | `boolean` | `false` | Align menu to the right |
| `top` | `boolean` | `false` | Open above the trigger |
| `hover` | `boolean` | `false` | Open on hover |
| `open` | `boolean` | -- | Controlled open state (`v-model:open`) |

---

## DropdownMenu

A list of actions or options anchored to a trigger button, built on the design system (`.apui-dropdown-menu`, design-system #50): action, checkbox and radio items, in groups with labels. Arrow keys move (skipping disabled items), Home and End jump, typeahead finds an item, Enter and Space choose, and Escape closes and returns focus to the trigger. Replaces Dropdown.

```vue
<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/vue';
</script>

<template>
  <DropdownMenu label="Options" @select="(value) => console.log(value)">
    <DropdownMenuGroup label="Listing">
      <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
      <DropdownMenuItem value="duplicate" icon="copy">Duplicate</DropdownMenuItem>
      <DropdownMenuItem value="archive" disabled>Archive</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
  </DropdownMenu>
</template>
```

`items` renders the same children from data. Checkbox and radio items report `checked-change`; their checked state stays yours to set:

```vue
<script setup lang="ts">
import { DropdownMenu, type DropdownMenuEntry } from '@artisanpack-ui/vue';
import { computed, ref } from 'vue';

const showGrid = ref(true);
const sort = ref('newest');

const items = computed<DropdownMenuEntry[]>(() => [
  { type: 'checkbox', value: 'grid', label: 'Show grid', checked: showGrid.value },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Sort by',
    items: [
      { type: 'radio', value: 'newest', label: 'Newest', checked: sort.value === 'newest' },
      { type: 'radio', value: 'price', label: 'Price', checked: sort.value === 'price' },
    ],
  },
]);

function onCheckedChange({ value, checked }: { value: string; checked: boolean }) {
  if (value === 'grid') showGrid.value = checked;
  else if (checked) sort.value = value;
}
</script>

<template>
  <DropdownMenu label="View" align="end" :items="items" @checked-change="onCheckedChange" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether it's open. Passed (`v-model:open` or `:open`), it's controlled; not passed, the menu keeps its own state |
| `label` | `string` | -- | The trigger button's content (or the `#label` slot). For an icon-only trigger, see below |
| `items` | `DropdownMenuEntry[]` | -- | Items as data: action, `checkbox`, `radio`, `separator` and `group` entries |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Which edge lines up with the trigger; follows the text direction (`data-align`) |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The menu's surface (`data-surface`) |
| `portal` | `boolean` | `true` | Teleport the menu to the body; `false` renders it in place |
| `classes` | `Partial<Record<DropdownMenuPart, string>>` | -- | Extra classes per part (`trigger`, `item`, `separator`, …) |

**Events:** `update:open` (`boolean`), `select` (the chosen action item's `value`), `checked-change` (`{ value, checked }`). `class` and other attributes go to the panel.

An icon-only trigger still needs a name: put an icon and visually hidden text in the `#label` slot.

```vue
<DropdownMenu :items="items">
  <template #label>
    <span aria-hidden="true">⋯</span>
    <span class="apui-sr-only">More actions</span>
  </template>
</DropdownMenu>
```

**DropdownMenuItem** props: `value` (required), `icon`, `shortcut` (shown in a `<kbd>`), `color` (`'error'` for a danger item, put it last after a separator), `disabled`, `type` (`'item' | 'checkbox' | 'radio'`) and `checked`. It emits `select` and `checked-change` itself, and its attributes and listeners go to the item, so a `@click` runs from the keyboard too. **DropdownMenuGroup** takes a `label`; **DropdownMenuSeparator** takes nothing.

---

## Grid

CSS grid layout wrapper with responsive column counts and gap controls.

```vue
<Grid :cols="1" :cols-md="2" :cols-lg="3" :gap="4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1-12` | -- | Base column count |
| `colsSm` | `1-12` | -- | Columns at `sm` breakpoint |
| `colsMd` | `1-12` | -- | Columns at `md` breakpoint |
| `colsLg` | `1-12` | -- | Columns at `lg` breakpoint |
| `colsXl` | `1-12` | -- | Columns at `xl` breakpoint |
| `gap` | `0-16` | `4` | Uniform gap |
| `gapX` | `0-16` | -- | Horizontal gap (overrides `gap`) |
| `gapY` | `0-16` | -- | Vertical gap (overrides `gap`) |

---

## Modal (deprecated)

> Deprecated: use [Dialog](#dialog). Modal stays exported for now.

Dialog overlay with focus trapping, keyboard dismissal, and Teleport rendering.

```vue
<Modal v-model:open="showModal" title="Confirm Action">
  <p>Are you sure?</p>
  <template #actions>
    <Button @click="showModal = false">Cancel</Button>
    <Button color="primary" @click="confirm">Confirm</Button>
  </template>
</Modal>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Visibility (`v-model:open`) |
| `title` | `string` | -- | Title as `<h3>` |
| `subtitle` | `string` | -- | Subtitle below title |
| `persistent` | `boolean` | `false` | Prevent closing via Escape/backdrop |
| `glass` | `boolean` | `false` | Glass morphism styling |
| `bottom` | `boolean` | `false` | Bottom sheet on mobile |
| `ariaLabel` | `string` | -- | Accessible label (when no title) |

---

## Popover

Positioned floating content activated by hover or click.

```vue
<Popover position="top" trigger-mode="click">
  <template #trigger><Button>Info</Button></template>
  <p>Popover content here.</p>
</Popover>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `triggerMode` | `'hover' \| 'click'` | `'hover'` | Activation mode |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position relative to trigger |
| `showDelay` | `number` | `0` | Show delay in ms (hover mode) |
| `hideDelay` | `number` | `300` | Hide delay in ms (hover mode) |
| `open` | `boolean` | -- | Controlled state (`v-model:open`) |
| `persistent` | `boolean` | `false` | Prevent closing via Escape/click-outside |
| `ariaLabel` | `string` | -- | Accessible label |

---

## Stack

Flexbox layout wrapper with declarative direction, gap, alignment, and wrap.

```vue
<Stack direction="horizontal" :gap="4" align="center">
  <Avatar />
  <span>Username</span>
</Stack>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Flex direction |
| `gap` | `0-16` | `2` | Gap between items |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | -- | Cross-axis alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | -- | Main-axis justification |
| `wrap` | `boolean` | `false` | Allow items to wrap |
| `className` | `string` | -- | Additional CSS classes |

---

## Tabs

Switches between views of the same content, built on the design system (`.apui-tabs`, design-system #56) and the shared Zag tabs machine. Arrow keys move between tabs and follow the text direction (in RTL, ArrowLeft moves to the next tab), Home and End jump, and only the selected tab is in the Tab order. Automatic activation selects as the arrow keys move; manual waits for Enter or Space.

```vue
<script setup lang="ts">
import { Tab, Tabs } from '@artisanpack-ui/vue';
import { ref } from 'vue';

const section = ref('profile');
</script>

<template>
  <Tabs v-model="section" label="Account">
    <Tab value="profile" label="Profile" icon="user">Your name, photo and contact details.</Tab>
    <Tab value="notifications" label="Notifications" :count="4">Choose what we email you about.</Tab>
    <Tab value="archived" label="Archived" disabled />
  </Tabs>
</template>
```

Each `Tab` renders its trigger in the tablist and its default slot as the panel. `tabs` renders the same from data (`{ value, label, icon, count, disabled, content }`), before any `Tab` children. Without a value, the first enabled tab is selected.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | -- | The selected tab (`v-model`); emits `update:modelValue`. Unbound, the tabs keep their own state |
| `tabs` | `TabData[]` | -- | Tabs as data |
| `variant` | `'segmented' \| 'underline'` | `'segmented'` | Segmented for filters and view switches, underline under a page header |
| `size` | `'sm' \| 'md'` | `'md'` | Trigger size |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Row or column; picks the arrow keys |
| `activationMode` | `'automatic' \| 'manual'` | `'automatic'` | Whether the arrow keys select |
| `label` | `string` | -- | Names the tablist; needed when a page has several |
| `classes` | `Partial<Record<TabsPart, string>>` | -- | Extra classes for `root`, `list`, `trigger`, `icon`, `count`, `content` |

`Tab` props: `value` (required), `label`, `icon`, `count`, `disabled`. The old `tabs: { name, label }[]`, `activeTab`, `defaultTab`, DaisyUI variants and `color` are gone; `TabItem` is now an alias of `TabData`.


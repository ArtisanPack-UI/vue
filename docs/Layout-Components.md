# Layout Components

```ts
import { Accordion, Card, Collapse, Divider, Drawer, Dropdown, DropdownItem, Grid, Modal, Popover, Stack, Tabs } from '@artisanpack-ui/vue/layout';
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

## Dropdown

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

## Modal

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

Tabbed interface with controlled/uncontrolled modes, keyboard navigation, and ARIA semantics.

```vue
<Tabs :tabs="[
  { name: 'overview', label: 'Overview' },
  { name: 'settings', label: 'Settings' },
]" v-model:active-tab="currentTab">
  <template #tab-overview>Overview content</template>
  <template #tab-settings>Settings content</template>
</Tabs>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **required** | Tab definitions |
| `activeTab` | `string` | -- | Active tab name (`v-model:activeTab`) |
| `defaultTab` | `string` | -- | Initial active tab (uncontrolled) |
| `variant` | `'bordered' \| 'lifted' \| 'boxed'` | `'bordered'` | Tab styling variant |
| `size` | `Size` | -- | Tab size |
| `color` | `DaisyColor` | -- | Active tab color |

Dynamic slots named `#tab-{name}` for each tab's content panel.

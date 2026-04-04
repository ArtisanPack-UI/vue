<script setup lang="ts">
import { ref } from 'vue';
import SpotlightSearch from './SpotlightSearch.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const openCustom = ref(false);
const openDisabled = ref(false);

const items = [
  { id: '1', label: 'Dashboard', description: 'Go to dashboard', group: 'Pages' },
  { id: '2', label: 'Settings', description: 'Manage settings', group: 'Pages' },
  { id: '3', label: 'Users', description: 'Manage users', group: 'Pages' },
  { id: '4', label: 'Create Post', description: 'Write a new post', group: 'Actions' },
  { id: '5', label: 'Export Data', description: 'Download CSV', group: 'Actions' },
];

const itemsWithDisabled = [
  { id: '1', label: 'Dashboard', description: 'Go to dashboard', group: 'Pages' },
  { id: '2', label: 'Settings', description: 'Manage settings', group: 'Pages' },
  { id: '3', label: 'Billing', description: 'Requires admin role', group: 'Pages', disabled: true },
  { id: '4', label: 'Create Post', description: 'Write a new post', group: 'Actions' },
  {
    id: '5',
    label: 'Delete All',
    description: 'Permanently remove all data',
    group: 'Danger',
    disabled: true,
  },
];
</script>

<template>
  <Story title="Navigation/SpotlightSearch" group="navigation">
    <Variant title="Default">
      <Button color="primary" @click="open = true">Open Spotlight (Cmd+K)</Button>
      <SpotlightSearch v-model:open="open" :items="items" placeholder="Search commands..." />
    </Variant>

    <Variant title="Custom Placeholder and Aria Label">
      <Button color="secondary" @click="openCustom = true">Open Custom Spotlight</Button>
      <SpotlightSearch
        v-model:open="openCustom"
        :items="items"
        placeholder="Type a command..."
        aria-label="Command palette"
      />
    </Variant>

    <Variant title="With Disabled Items">
      <Button color="accent" @click="openDisabled = true">Open with Disabled Items</Button>
      <SpotlightSearch
        v-model:open="openDisabled"
        :items="itemsWithDisabled"
        placeholder="Search..."
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# SpotlightSearch

A command palette / spotlight search overlay triggered by Cmd+K (Mac) or Ctrl+K (Windows) with grouped results and keyboard navigation.

## Usage

```vue
<SpotlightSearch
  v-model:open="showSpotlight"
  :items="commands"
  placeholder="Search commands..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls visibility via `v-model:open` |
| `items` | `SpotlightItem[]` | — | Array of searchable items |
| `placeholder` | `string` | `'Search…'` | Placeholder text for the search input |
| `ariaLabel` | `string` | `'Search'` | Label for screen readers |
| `className` | `string` | — | Additional CSS classes for the modal container |

## SpotlightItem

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display label |
| `description` | `string?` | Optional description below the label |
| `group` | `string?` | Optional group name for categorization |
| `disabled` | `boolean?` | Whether the item is disabled |
</docs>

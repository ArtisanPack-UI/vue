<script setup lang="ts">
import { computed, ref } from 'vue';
import DropdownMenu from './DropdownMenu.vue';
import DropdownMenuGroup from './DropdownMenuGroup.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';
import DropdownMenuSeparator from './DropdownMenuSeparator.vue';
import type { DropdownMenuCheckedChange, DropdownMenuEntry } from './types';

const showGrid = ref(true);
const sort = ref('newest');
const chosen = ref('');

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

function onCheckedChange({ value, checked }: DropdownMenuCheckedChange) {
  if (value === 'grid') showGrid.value = checked;
  else if (checked) sort.value = value;
}
</script>

<template>
  <Story title="Layout/DropdownMenu" group="layout">
    <Variant title="Default">
      <div style="padding: 16px; min-height: 320px">
        <DropdownMenu label="Options" :open="true" :portal="false">
          <DropdownMenuGroup label="Listing">
            <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
            <DropdownMenuItem value="duplicate" icon="copy">Duplicate</DropdownMenuItem>
            <DropdownMenuItem value="archive" disabled>Archive</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
        </DropdownMenu>
      </div>
    </Variant>

    <Variant title="Checkbox and Radio Items">
      <div style="padding: 16px; min-height: 240px">
        <DropdownMenu
          label="View"
          :open="true"
          :portal="false"
          :items="items"
          @checked-change="onCheckedChange"
        />
      </div>
    </Variant>

    <Variant title="Interactive">
      <div style="display: flex; gap: 16px; align-items: center">
        <DropdownMenu label="Options" @select="(value) => (chosen = value)">
          <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
          <DropdownMenuItem value="duplicate" icon="copy">Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
        </DropdownMenu>
        <DropdownMenu label="View" align="end" :items="items" @checked-change="onCheckedChange" />
        <span>Chosen: {{ chosen || '—' }}</span>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# DropdownMenu

A list of actions or options anchored to a trigger button (`.apui-dropdown-menu`): action,
checkbox and radio items, in groups with labels. Arrow keys move, typeahead jumps, Escape
closes and returns focus to the trigger.

## Usage

```vue
<DropdownMenu label="Options" @select="(value) => console.log(value)">
  <DropdownMenuGroup label="Listing">
    <DropdownMenuItem value="edit" icon="pencil" shortcut="E">Edit</DropdownMenuItem>
    <DropdownMenuItem value="archive" disabled>Archive</DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem value="delete" icon="trash" color="error">Delete</DropdownMenuItem>
</DropdownMenu>
```

`items` renders the same children from data. Checkbox and radio items report
`checked-change` (`{ value, checked }`); their checked state stays yours to set.
</docs>

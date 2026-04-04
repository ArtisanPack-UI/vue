<script setup lang="ts">
import { ref } from 'vue';
import Drawer from './Drawer.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const openEnd = ref(false);
const openPersistent = ref(false);
const openAria = ref(false);
</script>

<template>
  <Story title="Layout/Drawer" group="layout">
    <Variant title="Default (Left)">
      <Button color="primary" @click="open = true">Open Drawer</Button>
      <Drawer v-model:open="open" aria-label="Main navigation drawer">
        <template #side>
          <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px">
            Drawer Content
          </h3>
          <p>This is the drawer content. It slides in from the left.</p>
          <Button color="primary" style="margin-top: 16px" @click="open = false">Close</Button>
        </template>
      </Drawer>
    </Variant>

    <Variant title="End (Right)">
      <Button color="secondary" @click="openEnd = true">Open Right Drawer</Button>
      <Drawer v-model:open="openEnd" :end="true" aria-label="Secondary drawer">
        <template #side>
          <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px">Right Drawer</h3>
          <p>This drawer slides in from the right.</p>
          <Button color="secondary" style="margin-top: 16px" @click="openEnd = false">Close</Button>
        </template>
      </Drawer>
    </Variant>

    <Variant title="Persistent (No Escape/Overlay Close)">
      <Button color="warning" @click="openPersistent = true">Open Persistent Drawer</Button>
      <Drawer
        v-model:open="openPersistent"
        :persistent="true"
        aria-label="Persistent drawer example"
      >
        <template #side>
          <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px">
            Persistent Drawer
          </h3>
          <p>This drawer cannot be closed by pressing Escape or clicking the overlay.</p>
          <Button color="primary" style="margin-top: 16px" @click="openPersistent = false">
            Close via Button
          </Button>
        </template>
      </Drawer>
    </Variant>

    <Variant title="With Aria Labelledby">
      <Button color="info" @click="openAria = true">Accessible Drawer</Button>
      <Drawer v-model:open="openAria" aria-labelledby="drawer-heading">
        <template #side>
          <h3
            id="drawer-heading"
            style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px"
          >
            Labeled by Heading
          </h3>
          <p>
            This drawer uses <code>aria-labelledby</code> pointing to the heading element for screen
            readers.
          </p>
          <Button color="info" style="margin-top: 16px" @click="openAria = false">Close</Button>
        </template>
      </Drawer>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Drawer

A side panel overlay with focus trapping and keyboard dismissal.

## Usage

```vue
<Drawer v-model:open="isOpen" aria-label="Navigation">
  <template #side>
    <nav>Drawer content</nav>
  </template>
</Drawer>
```

## Props

| Prop             | Type      | Default | Description                                                               |
| ---------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `open`           | `boolean` | —       | Controls visibility via `v-model:open`                                    |
| `end`            | `boolean` | `false` | Renders the drawer on the right side                                      |
| `persistent`     | `boolean` | `false` | Prevents closing via Escape or overlay click                              |
| `ariaLabel`      | `string`  | —       | Accessible label for the drawer dialog                                    |
| `ariaLabelledby` | `string`  | —       | ID of an element that labels the drawer (takes precedence over ariaLabel) |

## Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| `default` | Main page content rendered outside the drawer          |
| `side`    | Content rendered inside the slide-in drawer side panel |
</docs>

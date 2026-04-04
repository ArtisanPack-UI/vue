<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const openGlass = ref(false);
const openBottom = ref(false);
const openPersistent = ref(false);
const openSubtitle = ref(false);
const openAriaLabel = ref(false);
</script>

<template>
  <Story title="Layout/Modal" group="layout">
    <Variant title="Default">
      <Button color="primary" @click="open = true">Open Modal</Button>
      <Modal v-model:open="open" title="Confirm Action">
        <p>Are you sure you want to proceed? This action cannot be undone.</p>
        <template #actions>
          <Button @click="open = false">Cancel</Button>
          <Button color="primary" @click="open = false">Confirm</Button>
        </template>
      </Modal>
    </Variant>

    <Variant title="With Subtitle">
      <Button color="primary" @click="openSubtitle = true">Modal with Subtitle</Button>
      <Modal
        v-model:open="openSubtitle"
        title="Delete Account"
        subtitle="This action is permanent and cannot be reversed."
      >
        <p>All your data, posts, and settings will be permanently removed.</p>
        <template #actions>
          <Button @click="openSubtitle = false">Cancel</Button>
          <Button color="error" @click="openSubtitle = false">Delete</Button>
        </template>
      </Modal>
    </Variant>

    <Variant title="Glass">
      <Button color="accent" @click="openGlass = true">Glass Modal</Button>
      <Modal v-model:open="openGlass" title="Glass Modal" :glass="true">
        <p>This modal has a glass morphism effect.</p>
        <template #actions>
          <Button @click="openGlass = false">Close</Button>
        </template>
      </Modal>
    </Variant>

    <Variant title="Bottom Sheet">
      <Button color="secondary" @click="openBottom = true">Bottom Sheet</Button>
      <Modal v-model:open="openBottom" title="Bottom Sheet" :bottom="true">
        <p>This modal slides up from the bottom on mobile.</p>
        <template #actions>
          <Button @click="openBottom = false">Close</Button>
        </template>
      </Modal>
    </Variant>

    <Variant title="Persistent (No Escape/Backdrop Close)">
      <Button color="warning" @click="openPersistent = true">Persistent Modal</Button>
      <Modal v-model:open="openPersistent" title="Required Action" :persistent="true">
        <p>
          This modal cannot be closed by pressing Escape or clicking the backdrop. You must use the
          button below.
        </p>
        <template #actions>
          <Button color="primary" @click="openPersistent = false">I Understand</Button>
        </template>
      </Modal>
    </Variant>

    <Variant title="With Aria Label (No Title)">
      <Button color="info" @click="openAriaLabel = true">Aria-Labeled Modal</Button>
      <Modal v-model:open="openAriaLabel" aria-label="Notification dialog">
        <p>This modal has no visible title but is labeled via <code>aria-label</code>.</p>
        <template #actions>
          <Button @click="openAriaLabel = false">Close</Button>
        </template>
      </Modal>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Modal

A dialog modal with focus trapping, keyboard dismissal, and accessibility support.

## Usage

```vue
<Modal v-model:open="showModal" title="Confirm">
  <p>Are you sure?</p>
  <template #actions>
    <Button @click="showModal = false">Cancel</Button>
    <Button color="primary" @click="confirm">Yes</Button>
  </template>
</Modal>
```

## Props

| Prop         | Type      | Default | Description                                   |
| ------------ | --------- | ------- | --------------------------------------------- |
| `open`       | `boolean` | —       | Controls visibility via `v-model:open`        |
| `title`      | `string`  | —       | Header title rendered as `<h3>`               |
| `subtitle`   | `string`  | —       | Text displayed below the title                |
| `persistent` | `boolean` | `false` | Prevents closing via Escape or backdrop click |
| `glass`      | `boolean` | `false` | Applies glass morphism styling                |
| `bottom`     | `boolean` | `false` | Renders as bottom sheet on mobile             |
| `ariaLabel`  | `string`  | —       | Accessible label when no title is provided    |
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const openGlass = ref(false);
const openBottom = ref(false);
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

    <Variant title="Glass">
      <Button color="accent" @click="openGlass = true">Glass Modal</Button>
      <Modal v-model:open="openGlass" title="Glass Modal" :glass="true">
        <p>This modal has a glass effect.</p>
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
  </Story>
</template>

<docs lang="md">
# Modal

A dialog modal with title, actions slot, glass effect, and bottom sheet mode.
</docs>

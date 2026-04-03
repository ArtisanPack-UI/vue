<script setup lang="ts">
import { ref } from 'vue';
import Drawer from './Drawer.vue';
import Button from '../../form/Button/Button.vue';

const open = ref(false);
const openEnd = ref(false);
</script>

<template>
  <Story title="Layout/Drawer" group="layout">
    <Variant title="Default (Left)">
      <Button color="primary" @click="open = true">Open Drawer</Button>
      <Drawer v-model:open="open">
        <div style="padding: 16px">
          <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px">
            Drawer Content
          </h3>
          <p>This is the drawer content. It slides in from the left.</p>
          <Button color="primary" style="margin-top: 16px" @click="open = false">Close</Button>
        </div>
      </Drawer>
    </Variant>

    <Variant title="End (Right)">
      <Button color="secondary" @click="openEnd = true">Open Right Drawer</Button>
      <Drawer v-model:open="openEnd" :end="true">
        <div style="padding: 16px">
          <h3 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 12px">Right Drawer</h3>
          <p>This drawer slides in from the right.</p>
          <Button color="secondary" style="margin-top: 16px" @click="openEnd = false">Close</Button>
        </div>
      </Drawer>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Drawer

A slide-in drawer panel from left or right with overlay.
</docs>

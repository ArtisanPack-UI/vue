<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Button from '../../form/Button/Button.vue';

const openDefault = ref(true);
const openRight = ref(true);
</script>

<template>
  <Story title="Navigation/Sidebar" group="navigation">
    <Variant title="Default">
      <div style="position: relative; height: 400px; border: 1px solid #e5e7eb; overflow: hidden">
        <Sidebar v-model:open="openDefault">
          <template #sidebar>
            <ul style="padding: 16px">
              <li style="padding: 8px 0">Dashboard</li>
              <li style="padding: 8px 0">Users</li>
              <li style="padding: 8px 0">Settings</li>
            </ul>
          </template>
          <div style="padding: 16px">
            <Button color="primary" @click="openDefault = !openDefault">Toggle Sidebar</Button>
            <p style="margin-top: 16px">Main content area</p>
          </div>
        </Sidebar>
      </div>
    </Variant>

    <Variant title="Right Side">
      <div style="position: relative; height: 400px; border: 1px solid #e5e7eb; overflow: hidden">
        <Sidebar v-model:open="openRight" side="right">
          <template #sidebar>
            <ul style="padding: 16px">
              <li style="padding: 8px 0">Notifications</li>
              <li style="padding: 8px 0">Messages</li>
            </ul>
          </template>
          <div style="padding: 16px">
            <Button color="secondary" @click="openRight = !openRight">Toggle Right Sidebar</Button>
          </div>
        </Sidebar>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Sidebar

A responsive sidebar with left/right placement and toggle support.
</docs>

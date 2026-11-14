<script setup lang="ts">
import { ref } from 'vue';
import UserMenu from './UserMenu.vue';
import type { UserMenuTheme } from './types';

const user = {
  name: 'Olivia Rhye',
  email: 'olivia@company.com',
  role: 'Admin · Apexify',
  status: 'online' as const,
};
const workspaces = [
  { id: 'apexify', name: 'Apexify' },
  { id: 'horizon', name: 'Horizon Homes' },
];
const items = [
  { value: 'profile', label: 'Profile', icon: 'user' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
];
const workspace = ref('apexify');
const theme = ref<UserMenuTheme>('system');
</script>

<template>
  <Story title="Layout/UserMenu" group="layout">
    <Variant title="Sidebar">
      <UserMenu
        :user="user"
        :workspaces="workspaces"
        :workspace="workspace"
        :theme="theme"
        :items="items"
        @workspace-change="workspace = $event"
        @theme-change="theme = $event"
      />
    </Variant>

    <Variant title="Compact">
      <UserMenu :user="user" compact align="end" hide-theme />
    </Variant>

    <Variant title="Open">
      <UserMenu
        :user="user"
        :workspaces="workspaces"
        workspace="apexify"
        :items="items"
        :open="true"
        :portal="false"
      />
    </Variant>
  </Story>
</template>

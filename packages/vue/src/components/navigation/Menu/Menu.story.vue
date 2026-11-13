<script setup lang="ts">
import Menu from './Menu.vue';
import MenuItem from './MenuItem.vue';
import MenuSeparator from './MenuSeparator.vue';
import MenuSub from './MenuSub.vue';
import MenuTitle from './MenuTitle.vue';
import type { MenuItemData } from './types';

const items: MenuItemData[] = [
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: '#profile', current: true },
      { label: 'Security', href: '#security' },
    ],
  },
  { type: 'separator' },
  { label: 'Billing', href: '#billing', icon: 'lock' },
];
</script>

<template>
  <Story title="Navigation/Menu" group="navigation">
    <Variant title="Composition">
      <div style="width: 260px">
        <Menu label="Main">
          <MenuItem href="#dashboard" icon="list">Dashboard</MenuItem>
          <MenuSub label="Properties" icon="settings">
            <MenuItem href="#all">All properties</MenuItem>
            <MenuItem href="#lakeview" current>Lakeview Lofts</MenuItem>
            <MenuItem href="#drafts" badge="3">Drafts</MenuItem>
          </MenuSub>
          <MenuItem href="#inbox" icon="mail" badge="12">Inbox</MenuItem>
          <MenuTitle>Settings</MenuTitle>
          <MenuItem href="#team" icon="user">Team</MenuItem>
          <MenuSeparator />
          <MenuItem href="#billing" disabled>Billing</MenuItem>
        </Menu>
      </div>
    </Variant>
    <Variant title="From data, not collapsible">
      <div style="width: 260px">
        <Menu label="Settings" :collapsible="false" :items="items" />
      </div>
    </Variant>
  </Story>
</template>

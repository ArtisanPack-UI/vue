<script setup lang="ts">
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
</script>

<template>
  <Story title="Layout/Dropdown" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstCheckbox v-model="state.end" title="Align End" />
        <HstCheckbox v-model="state.top" title="Open Top" />
        <HstCheckbox v-model="state.hover" title="Hover" />
      </template>

      <template #default="{ state }">
        <div style="padding: 100px">
          <Dropdown
            :label="state.label || 'Options'"
            :end="state.end"
            :top="state.top"
            :hover="state.hover"
          >
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem :disabled="true">Disabled</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </Dropdown>
        </div>
      </template>
    </Variant>

    <Variant title="Hover">
      <div style="padding: 100px">
        <Dropdown label="Hover Me" :hover="true">
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
          <DropdownItem>Option 3</DropdownItem>
        </Dropdown>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Dropdown

A dropdown menu with click or hover trigger, positioning options, and disabled items.
</docs>

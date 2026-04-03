<script setup lang="ts">
import Tabs from './Tabs.vue';

const tabs = [
  { name: 'overview', label: 'Overview' },
  { name: 'features', label: 'Features' },
  { name: 'pricing', label: 'Pricing' },
  { name: 'disabled', label: 'Disabled', disabled: true },
];
</script>

<template>
  <Story title="Layout/Tabs" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="['', 'bordered', 'lifted', 'boxed']"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="['', 'xs', 'sm', 'md', 'lg']"
        />
        <HstCheckbox v-model="state.vertical" title="Vertical" />
      </template>

      <template #default="{ state }">
        <Tabs
          :tabs="tabs"
          default-tab="overview"
          :variant="state.variant || undefined"
          :size="state.size || undefined"
          :vertical="state.vertical"
        >
          <template #tab-overview>
            <p>This is the overview content.</p>
          </template>
          <template #tab-features>
            <p>Feature list goes here.</p>
          </template>
          <template #tab-pricing>
            <p>Pricing details go here.</p>
          </template>
        </Tabs>
      </template>
    </Variant>

    <Variant title="Bordered">
      <Tabs :tabs="tabs" default-tab="overview" variant="bordered">
        <template #tab-overview><p>Overview content.</p></template>
        <template #tab-features><p>Features content.</p></template>
        <template #tab-pricing><p>Pricing content.</p></template>
      </Tabs>
    </Variant>

    <Variant title="Lifted">
      <Tabs :tabs="tabs" default-tab="overview" variant="lifted">
        <template #tab-overview><p>Overview content.</p></template>
        <template #tab-features><p>Features content.</p></template>
        <template #tab-pricing><p>Pricing content.</p></template>
      </Tabs>
    </Variant>

    <Variant title="Boxed">
      <Tabs :tabs="tabs" default-tab="overview" variant="boxed">
        <template #tab-overview><p>Overview content.</p></template>
        <template #tab-features><p>Features content.</p></template>
        <template #tab-pricing><p>Pricing content.</p></template>
      </Tabs>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Tabs

A tab component with bordered, lifted, and boxed variants, plus vertical layout.
</docs>

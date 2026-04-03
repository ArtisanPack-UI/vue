<script setup lang="ts">
import Navbar from './Navbar.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Navigation/Navbar" group="navigation">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'neutral']"
        />
        <HstCheckbox v-model="state.glass" title="Glass" />
      </template>

      <template #default="{ state }">
        <Navbar :color="state.color || undefined" :glass="state.glass">
          <template #start>
            <span style="font-size: 1.25rem; font-weight: bold">ArtisanPack</span>
          </template>
          <template #center>
            <span>Home</span>
            <span style="margin-left: 16px">About</span>
            <span style="margin-left: 16px">Contact</span>
          </template>
          <template #end>
            <Button color="ghost" size="sm">Login</Button>
          </template>
        </Navbar>
      </template>
    </Variant>

    <Variant title="With Color">
      <Navbar color="primary">
        <template #start>
          <span style="font-size: 1.25rem; font-weight: bold; color: white">Brand</span>
        </template>
        <template #end>
          <Button color="ghost" size="sm">Sign Up</Button>
        </template>
      </Navbar>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Navbar

A navigation bar with start, center, and end slots plus color and glass options.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import ColorPicker from './ColorPicker.vue';

const primary = ref('#1f74bf');
const accent = ref('#de9d16');
const brand = [
  '#1f74bf',
  '#0b9488',
  '#1f6f3d',
  '#de9d16',
  '#e88761',
  '#c92f33',
  '#91256c',
  '#23272b',
];
</script>

<template>
  <Story title="Form/ColorPicker" group="form">
    <Variant title="Default">
      <ColorPicker v-model="primary" label="Primary color" />
    </Variant>

    <Variant title="Swatches">
      <ColorPicker v-model="accent" label="Accent color" hint="Brand swatches" :swatches="brand" />
    </Variant>

    <Variant title="Open, OKLCH">
      <ColorPicker
        v-model="accent"
        label="Accent color"
        format="oklch"
        :swatches="brand"
        :open="true"
        :portal="false"
      />
    </Variant>

    <Variant title="States">
      <div style="display: grid; gap: 16px">
        <ColorPicker
          label="Brand color"
          :alpha="false"
          model-value="#c92f33"
          error="Enter a color, such as #1f74bf."
        />
        <ColorPicker label="Locked color" model-value="#23272b" disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# ColorPicker

A color field (`.apui-color-picker`): a swatch that opens a popover (area, hue and opacity sliders,
format select, eyedropper, swatches), and a text value that is always available for typing. Bind it
with `v-model`; `format` picks HEX, RGB, HSL or OKLCH.

## Usage

```vue
<ColorPicker v-model="accent" label="Accent color" :swatches="brand" />
```
</docs>

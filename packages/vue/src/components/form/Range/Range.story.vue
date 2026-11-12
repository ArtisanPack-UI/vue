<script setup lang="ts">
import { ref } from 'vue';
import Range from './Range.vue';

const radius = ref(20);
const price = ref<[number, number]>([200, 450]);
const marks = [
  { value: 0, label: '0 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
];
</script>

<template>
  <Story title="Form/Range" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.showValue"
          title="Show value"
          :options="['never', 'focus', 'always']"
        />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="[
            'primary',
            'secondary',
            'accent',
            'neutral',
            'success',
            'warning',
            'error',
            'info',
          ]"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Range
          v-model="radius"
          label="Search radius"
          :max="50"
          format="{value} km"
          :marks="marks"
          :show-value="state.showValue || 'focus'"
          :color="state.color || 'primary'"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="Two thumbs">
      <Range
        v-model="price"
        label="Price"
        dual
        :min="100"
        :max="700"
        :step="10"
        format="${value}k"
        show-value="always"
      />
    </Variant>

    <Variant title="Colors, sizes and states">
      <div style="display: grid; gap: 16px">
        <Range label="Volume" :model-value="80" color="success" />
        <Range label="Opacity" :model-value="30" size="sm" />
        <Range label="Locked" :model-value="50" disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Range

A slider (`.apui-range`): one native `<input type="range">` per thumb over the drawn track.
`dual` gives a from–to range bound as `[from, to]`. `format` sets the bubble, marks and
`aria-valuetext`; `thumbLabels` names the two thumbs.

```vue
<Range v-model="radius" label="Search radius" :max="50" format="{value} km" />
<Range v-model="price" label="Price" dual :min="100" :max="700" format="${value}k" />
```
</docs>

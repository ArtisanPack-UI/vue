<script setup lang="ts">
import { ref } from 'vue';
import Rating from './Rating.vue';

const score = ref(4);
</script>

<template>
  <Story title="Form/Rating" group="form">
    <Variant title="Read-only">
      <div style="display: grid; gap: 12px">
        <Rating readonly :model-value="4.2" :count="17" />
        <Rating readonly :model-value="3.5" :count="128" />
        <Rating readonly size="sm" :model-value="5" :count="4" />
      </div>
    </Variant>

    <Variant title="Input">
      <Rating v-model="score" size="lg" label="Rate the viewing" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Rating

Shows a star score (`readonly`: one image with a text alternative, half stars) or collects one
with native radios (`.apui-rating`). Bind it with `v-model`. Pass `value-label` and
`count-label` to translate the labels.

## Usage

```vue
<Rating readonly :model-value="4.2" :count="17" />
<Rating v-model="score" label="Rate the viewing" />
```
</docs>

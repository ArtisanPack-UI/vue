<script setup lang="ts">
import { ref } from 'vue';
import RadioGroup from './RadioGroup.vue';

const visibility = ref<string | number>('public');
const plan = ref<string | number>('growth');
const view = ref<string | number>('Grid');
</script>

<template>
  <Story title="Form/RadioGroup" group="form">
    <Variant title="Default">
      <RadioGroup
        v-model="visibility"
        label="Listing visibility"
        :options="[
          { value: 'public', label: 'Public', description: 'Anyone can find it in search.' },
          { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link.' },
          { value: 'private', label: 'Private', description: 'Only you and co-owners.' },
        ]"
      />
    </Variant>

    <Variant title="Cards">
      <RadioGroup
        v-model="plan"
        label="Plan"
        variant="cards"
        orientation="horizontal"
        :options="[
          {
            value: 'starter',
            label: 'Starter',
            description: 'Up to 5 listings',
            meta: '$0 / month',
          },
          {
            value: 'growth',
            label: 'Growth',
            description: 'Up to 50 listings',
            meta: '$39 / month',
          },
          {
            value: 'portfolio',
            label: 'Portfolio',
            description: 'Unlimited',
            meta: '$129 / month',
          },
        ]"
      />
    </Variant>

    <Variant title="Segmented">
      <RadioGroup
        v-model="view"
        label="View"
        variant="segmented"
        orientation="horizontal"
        :options="['List', 'Grid', 'Map']"
      />
    </Variant>

    <Variant title="Invalid">
      <RadioGroup label="Plan" required error="Choose a plan." :options="['Starter', 'Growth']" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# RadioGroup

Chooses exactly one option from a small set (`.apui-radio-group`): native radios in a fieldset,
so arrow keys move between options and follow the text direction. Bind it with `v-model`.
Replaces the deprecated `Radio`.

## Usage

```vue
<RadioGroup v-model="plan" label="Plan" variant="cards" :options="plans" />
```
</docs>

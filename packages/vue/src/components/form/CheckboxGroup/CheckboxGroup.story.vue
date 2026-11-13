<script setup lang="ts">
import { ref } from 'vue';
import CheckboxGroup from './CheckboxGroup.vue';

const topics = ref<(string | number)[]>(['offers']);
const amenities = ref<(string | number)[]>(['Parking']);
const channels = ref<(string | number)[]>(['email']);
</script>

<template>
  <Story title="Form/CheckboxGroup" group="form">
    <Variant title="Select all">
      <CheckboxGroup
        v-model="topics"
        label="Notify me about"
        select-all
        :options="[
          { value: 'offers', label: 'New offers', description: 'Within an hour of submission' },
          { value: 'prices', label: 'Price changes in saved searches' },
          { value: 'digest', label: 'Weekly analytics digest' },
        ]"
      />
    </Variant>

    <Variant title="Columns">
      <CheckboxGroup
        v-model="amenities"
        label="Amenities"
        :columns="3"
        :options="[
          'In-unit laundry',
          'Parking',
          'Rooftop terrace',
          'Gym',
          'Bike storage',
          'Pets allowed',
        ]"
      />
    </Variant>

    <Variant title="Cards">
      <CheckboxGroup
        v-model="channels"
        label="Channels"
        variant="cards"
        :columns="3"
        :options="[
          { value: 'email', label: 'Email', description: 'olivia@company.com' },
          { value: 'sms', label: 'SMS', description: '•••• 4821' },
          { value: 'push', label: 'Push', description: '2 devices' },
        ]"
      />
    </Variant>
  </Story>
</template>

<docs lang="md">
# CheckboxGroup

A labeled set of related Checkboxes (`.apui-checkbox-group`) whose value is the array of checked
values, with select all, columns and cards. Bind it with `v-model`.

## Usage

```vue
<CheckboxGroup v-model="topics" label="Notify me about" :options="options" select-all />
```
</docs>

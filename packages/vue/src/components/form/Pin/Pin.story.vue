<script setup lang="ts">
import { ref } from 'vue';
import Pin from './Pin.vue';

const code = ref('');
const completed = ref('');
</script>

<template>
  <Story title="Form/Pin" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.length" title="Length" />
        <HstNumber v-model="state.groupSize" title="Group size" />
        <HstCheckbox v-model="state.mask" title="Mask" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstText v-model="state.error" title="Error" />
      </template>

      <template #default="{ state }">
        <Pin
          v-model="code"
          label="Verification code"
          :length="state.length || 6"
          :group-size="state.groupSize || undefined"
          :mask="state.mask"
          :disabled="state.disabled"
          :error="state.error || undefined"
          @complete="completed = $event"
        />
        <p v-if="completed">Completed: {{ completed }}</p>
      </template>
    </Variant>

    <Variant title="Masked and alphanumeric">
      <div style="display: grid; gap: 16px">
        <Pin label="PIN" :length="4" mask />
        <Pin label="Recovery code" :length="8" type="alphanumeric" :group-size="4" />
      </div>
    </Variant>

    <Variant title="States and sizes">
      <div style="display: grid; gap: 16px">
        <Pin label="Invalid" :group-size="3" model-value="991027" error="That code has expired." />
        <Pin label="Small" size="sm" :group-size="3" />
        <Pin label="Disabled" model-value="503186" :group-size="3" disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Pin

A row of cells for one-time codes (`.apui-pin`). One input with `autocomplete="one-time-code"`
drives the cells, so SMS autofill and paste fill the whole code. `complete` fires with the code
when the last cell is filled.

```vue
<Pin v-model="code" label="Verification code" :group-size="3" @complete="verify" />
```
</docs>

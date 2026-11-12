<script setup lang="ts">
import { ref } from 'vue';
import Textarea from './Textarea.vue';

const description = ref('');
</script>

<template>
  <Story title="Form/Textarea" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstNumber v-model="state.maxLength" title="Max length" />
        <HstCheckbox v-model="state.autoResize" title="Auto resize" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Read-only" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <Textarea
          v-model="description"
          :label="state.label || 'Description'"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :max-length="state.maxLength || undefined"
          :auto-resize="state.autoResize"
          :disabled="state.disabled"
          :readonly="state.readonly"
          :required="state.required"
        />
      </template>
    </Variant>

    <Variant title="Counter">
      <Textarea
        label="Description"
        placeholder="Describe the property, nearby amenities and anything renters should know…"
        :max-length="500"
      />
    </Variant>

    <Variant title="States">
      <div style="display: grid; gap: 16px">
        <Textarea label="Summary" error="Write at least 40 characters." model-value="Too short" />
        <Textarea label="Imported text" model-value="Imported from the March feed." readonly />
        <Textarea label="Internal notes" model-value="Locked while reviewed." disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Textarea

Multi-line text entry in Input's field anatomy (`.apui-textarea`). `maxLength` shows a counter;
screen readers hear the characters left only near the limit (`remainingLabel`). Bind it with
`v-model`.

```vue
<Textarea v-model="notes" label="Notes" :rows="3" />
<Textarea v-model="description" label="Description" :max-length="500" auto-resize />
```
</docs>

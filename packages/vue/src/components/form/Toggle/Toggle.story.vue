<script setup lang="ts">
import { ref } from 'vue';
import Toggle from './Toggle.vue';

const darkMode = ref(false);
</script>

<template>
  <Story title="Form/Toggle" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect v-model="state.size" title="Size" :options="['sm', 'md', 'lg']" />
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
        <Toggle
          v-model:checked="darkMode"
          :label="state.label || 'Dark mode'"
          :description="state.description || undefined"
          :size="state.size || 'md'"
          :color="state.color || 'primary'"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="Settings rows">
      <div style="display: grid; gap: 16px">
        <Toggle label="Weekly revenue digest" description="Every Monday at 9:00." />
        <Toggle
          label="Two-factor authentication"
          description="Required by your workspace admin."
          :checked="true"
          :disabled="true"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 32px">
        <Toggle label="Small" size="sm" :checked="true" />
        <Toggle label="Medium" :checked="true" />
        <Toggle label="Large" size="lg" color="success" :checked="true" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Toggle

A switch for settings that take effect immediately (`.apui-toggle`): a native checkbox with
`role="switch"`. Bind it with `v-model:checked`. Label the setting, not the state. In forms that
need a submit, use Checkbox.

```vue
<Toggle v-model:checked="darkMode" label="Dark mode" />
```
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import Password from './Password.vue';

const password = ref('');
const requirements = [
  { label: 'At least 12 characters', pattern: '.{12,}' },
  { label: 'One number', pattern: '\\d' },
  { label: 'One symbol', pattern: '[^A-Za-z0-9]' },
];
</script>

<template>
  <Story title="Form/Password" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.strengthMeter" title="Strength meter" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <Password
          v-model="password"
          :label="state.label || 'Password'"
          leading-icon="lock"
          :hint="state.hint || undefined"
          :error="state.error || undefined"
          :strength-meter="state.strengthMeter"
          :disabled="state.disabled"
          :required="state.required"
        />
      </template>
    </Variant>

    <Variant title="Strength and requirements">
      <Password
        label="New password"
        autocomplete="new-password"
        leading-icon="lock"
        strength-meter
        :requirements="requirements"
      />
    </Variant>

    <Variant title="Sizes">
      <div style="display: grid; gap: 16px">
        <Password label="Small" size="sm" />
        <Password label="Medium" />
        <Password label="Large" size="lg" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Password

Password entry with a reveal toggle (`.apui-password`). The reveal button keeps one name
(`revealLabel`) and toggles `aria-pressed`. Add `strength-meter` and `requirements` on sign-up
forms, with `autocomplete="new-password"`. Translate the built-in text with `labels`.

```vue
<Password v-model="password" label="Password" leading-icon="lock" />
<Password
  v-model="newPassword"
  label="New password"
  autocomplete="new-password"
  strength-meter
  :requirements="[{ label: 'At least 12 characters', pattern: '.{12,}' }]"
/>
```
</docs>

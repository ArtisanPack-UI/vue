<script setup lang="ts">
import { ref } from 'vue';
import Pin from './Pin.vue';

const value = ref('');
</script>

<template>
  <Story title="Form/Pin" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.length" title="Length" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstCheckbox v-model="state.numeric" title="Numeric Only" />
        <HstCheckbox v-model="state.hide" title="Hide Input" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Pin
          v-model="value"
          :length="state.length || 6"
          :error="state.error || undefined"
          :color="state.color || undefined"
          :numeric="state.numeric"
          :hide="state.hide"
          :disabled="state.disabled"
        />
      </template>
    </Variant>

    <Variant title="4-Digit Numeric">
      <Pin v-model="value" :length="4" :numeric="true" color="primary" />
    </Variant>

    <Variant title="Hidden (Password Style)">
      <Pin v-model="value" :length="6" :hide="true" color="secondary" />
    </Variant>

    <Variant title="With Error">
      <Pin v-model="value" :length="6" error="Invalid code" color="error" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Pin

An OTP/PIN input with configurable length, numeric-only mode, and hidden input support.
</docs>

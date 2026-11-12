<script setup lang="ts">
import { ref } from 'vue';
import Signature from './Signature.vue';

const signature = ref('');
const typed = ref('');
</script>

<template>
  <Story title="Form/Signature" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect v-model="state.mode" title="Mode" :options="['draw', 'type', 'upload']" />
        <HstSelect
          v-model="state.penColor"
          title="Pen color"
          :options="['default', 'primary', 'info', 'success', 'error']"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 560px">
          <Signature
            v-model="signature"
            :label="state.label || 'Signature'"
            :hint="state.hint || 'Olivia Rhye · Nov 7, 2026'"
            :error="state.error || undefined"
            :mode="state.mode || 'draw'"
            :pen-color="state.penColor || 'default'"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Type first">
      <div style="max-width: 560px">
        <Signature v-model="typed" mode="type" :modes="['draw', 'type']" label="Signature" />
      </div>
    </Variant>

    <Variant title="Invalid">
      <div style="max-width: 560px">
        <Signature label="Signature" required error="Sign to accept the lease." />
      </div>
    </Variant>
  </Story>
</template>

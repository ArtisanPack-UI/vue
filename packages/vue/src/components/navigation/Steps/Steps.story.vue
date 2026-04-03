<script setup lang="ts">
import Steps from './Steps.vue';

const steps = [
  { label: 'Register' },
  { label: 'Choose Plan' },
  { label: 'Payment' },
  { label: 'Confirm' },
];
</script>

<template>
  <Story title="Navigation/Steps" group="navigation">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstNumber v-model="state.currentStep" title="Current Step" />
        <HstSelect v-model="state.color" title="Color" :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']" />
        <HstCheckbox v-model="state.vertical" title="Vertical" />
      </template>

      <template #default="{ state }">
        <Steps
          :steps="steps"
          :current-step="state.currentStep ?? 1"
          :color="state.color || undefined"
          :vertical="state.vertical"
        />
      </template>
    </Variant>

    <Variant title="Colored Steps">
      <Steps
        :steps="[
          { label: 'Done', color: 'success' },
          { label: 'Done', color: 'success' },
          { label: 'In Progress', color: 'warning' },
          { label: 'Pending' },
        ]"
        :current-step="2"
      />
    </Variant>

    <Variant title="Vertical">
      <Steps :steps="steps" :current-step="2" :vertical="true" color="primary" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Steps

A step indicator for multi-step processes with color and vertical support.
</docs>

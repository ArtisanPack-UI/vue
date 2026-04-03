<script setup lang="ts">
import Alert from './Alert.vue';
</script>

<template>
  <Story title="Feedback/Alert" group="feedback">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect v-model="state.color" title="Color" :options="['', 'info', 'success', 'warning', 'error']" />
        <HstCheckbox v-model="state.dismissible" title="Dismissible" />
      </template>

      <template #default="{ state }">
        <Alert :color="state.color || undefined" :dismissible="state.dismissible">
          This is an alert message with important information.
        </Alert>
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Alert color="info">This is an info alert.</Alert>
        <Alert color="success">Operation completed successfully!</Alert>
        <Alert color="warning">Please review before proceeding.</Alert>
        <Alert color="error">An error occurred. Please try again.</Alert>
      </div>
    </Variant>

    <Variant title="Dismissible">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Alert color="success" :dismissible="true">You can dismiss this alert.</Alert>
        <Alert color="warning" :dismissible="true">This warning can be closed.</Alert>
      </div>
    </Variant>

    <Variant title="With Icon Slot">
      <Alert color="info">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </template>
        Here is some helpful information for you.
      </Alert>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Alert

A feedback alert with info, success, warning, and error colors plus dismissible option.
</docs>

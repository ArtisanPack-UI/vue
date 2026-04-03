<script setup lang="ts">
import ToastProvider from './ToastProvider.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Feedback/Toast" group="feedback">
    <Variant title="Default">
      <ToastProvider>
        <template #default="{ toast }">
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <Button color="info" @click="toast.info('This is an info toast')">Info</Button>
            <Button color="success" @click="toast.success('Operation successful!')">Success</Button>
            <Button color="warning" @click="toast.warning('Please be careful')">Warning</Button>
            <Button color="error" @click="toast.error('Something went wrong')">Error</Button>
          </div>
        </template>
      </ToastProvider>
    </Variant>

    <Variant title="Custom Duration">
      <ToastProvider :default-duration="5000">
        <template #default="{ toast }">
          <Button color="primary" @click="toast.success('This lasts 5 seconds')">5s Toast</Button>
        </template>
      </ToastProvider>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Toast

A toast notification system with info, success, warning, and error types. Uses a provider pattern.
</docs>

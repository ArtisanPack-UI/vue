<script setup lang="ts">
import ErrorDisplay from './Error.vue';
</script>

<template>
  <Story title="Feedback/Error" group="feedback">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.message" title="Message" />
        <HstCheckbox v-model="state.retryable" title="Retryable" />
        <HstText v-model="state.retryLabel" title="Retry Label" />
      </template>

      <template #default="{ state }">
        <ErrorDisplay
          :title="state.title || 'Something went wrong'"
          :message="state.message || 'An unexpected error occurred. Please try again later.'"
          :retryable="state.retryable"
          :retry-label="state.retryLabel || undefined"
        />
      </template>
    </Variant>

    <Variant title="Retryable">
      <ErrorDisplay
        title="Connection Failed"
        message="Unable to reach the server. Check your network connection."
        :retryable="true"
        retry-label="Try Again"
        @retry="() => alert('Retry clicked')"
      />
    </Variant>

    <Variant title="Simple Error">
      <ErrorDisplay title="404 Not Found" message="The page you're looking for doesn't exist." />
    </Variant>
  </Story>
</template>

<docs lang="md">
# Error

An error display component with title, message, and optional retry button.
</docs>

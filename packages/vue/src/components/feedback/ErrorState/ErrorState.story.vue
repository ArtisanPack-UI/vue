<script setup lang="ts">
import ErrorState from './ErrorState.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Feedback/ErrorState" group="feedback">
    <Variant title="Failed request">
      <ErrorState
        title="Couldn’t load transactions"
        description="The payments service didn’t respond. Your data is safe; try again in a moment."
        code="Error 503 · req_8f2c91"
      >
        <template #actions>
          <Button leading-icon="refresh-cw">Try again</Button>
        </template>
      </ErrorState>
    </Variant>
    <Variant title="Offline">
      <ErrorState
        variant="offline"
        title="You’re offline"
        description="Changes are saved on this device and will sync when you reconnect."
      />
    </Variant>
    <Variant title="Not found">
      <ErrorState
        variant="not-found"
        :heading-level="2"
        title="This page doesn’t exist"
        description="The listing may have been archived, or the link is mistyped."
      />
    </Variant>
  </Story>
</template>

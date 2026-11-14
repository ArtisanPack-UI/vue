<script setup lang="ts">
import Alert from './Alert.vue';
import Button from '../../form/Button/Button.vue';
import type { AlertColor } from './types';

const colors: AlertColor[] = ['info', 'success', 'warning', 'error', 'neutral'];
</script>

<template>
  <Story title="Feedback/Alert" group="feedback">
    <Variant title="Colors">
      <div style="display: grid; gap: 10px; padding: 16px">
        <Alert
          v-for="color in colors"
          :key="color"
          :color="color"
          :title="`A ${color} alert`"
          description="Say what happened and what to do next."
        />
      </div>
    </Variant>
    <Variant title="Variants and dismiss">
      <div style="display: grid; gap: 10px; padding: 16px">
        <Alert
          variant="outline"
          color="info"
          title="Outline variant"
          description="For alerts inside dense forms."
        />
        <Alert
          variant="solid"
          color="error"
          title="Solid variant"
          description="For page-level failures that block work."
        />
        <Alert color="success" title="Listing published" dismissible />
        <Alert color="warning" title="Your monthly traffic is close to the limit">
          You’ve used 92% of 50,000 visits.
          <template #actions>
            <Button size="xs" color="warning">Upgrade</Button>
          </template>
        </Alert>
      </div>
    </Variant>
  </Story>
</template>

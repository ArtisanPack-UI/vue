<script setup lang="ts">
import Clipboard from './Clipboard.vue';
</script>

<template>
  <Story title="Utility/Clipboard" group="utility">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.text" title="Text to Copy" />
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.successLabel" title="Success Label" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="['', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']"
        />
        <HstSelect v-model="state.size" title="Size" :options="['', 'xs', 'sm', 'md', 'lg']" />
      </template>

      <template #default="{ state }">
        <Clipboard
          :text="state.text || 'npm install @artisanpack-ui/vue'"
          :label="state.label || undefined"
          :success-label="state.successLabel || undefined"
          :color="state.color || undefined"
          :size="state.size || undefined"
        />
      </template>
    </Variant>

    <Variant title="With Label">
      <Clipboard
        text="hello@example.com"
        label="Copy Email"
        success-label="Copied!"
        color="primary"
      />
    </Variant>

    <Variant title="Code Copy">
      <div
        style="
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1e293b;
          color: #e2e8f0;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: monospace;
        "
      >
        <code>npm install @artisanpack-ui/vue</code>
        <Clipboard text="npm install @artisanpack-ui/vue" size="sm" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Clipboard

A copy-to-clipboard button with customizable label and success feedback.
</docs>

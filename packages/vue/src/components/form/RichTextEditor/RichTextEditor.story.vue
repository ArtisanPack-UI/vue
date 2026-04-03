<script setup lang="ts">
import { ref } from 'vue';
import RichTextEditor from './RichTextEditor.vue';

const value = ref('<p>Hello <strong>World</strong></p>');
</script>

<template>
  <Story title="Form/RichTextEditor" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstText v-model="state.minHeight" title="Min Height" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <RichTextEditor
            v-model="value"
            :label="state.label || 'Content'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :min-height="state.minHeight || undefined"
            :disabled="state.disabled"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="With Error">
      <div style="max-width: 600px">
        <RichTextEditor
          v-model="value"
          label="Article Body"
          error="Content is required"
        />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# RichTextEditor

A WYSIWYG rich text editor with toolbar, label, hint, and error support.
</docs>

<script setup lang="ts">
import File from './File.vue';
</script>

<template>
  <Story title="Form/File" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstText v-model="state.accept" title="Accept" />
        <HstCheckbox v-model="state.multiple" title="Multiple" />
        <HstCheckbox v-model="state.withDragDrop" title="Drag & Drop" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <File
            :label="state.label || 'Upload'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :accept="state.accept || undefined"
            :multiple="state.multiple"
            :with-drag-drop="state.withDragDrop"
            :disabled="state.disabled"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Drag and Drop">
      <div style="max-width: 400px">
        <File label="Documents" :with-drag-drop="true" accept=".pdf,.doc,.docx" hint="PDF or Word documents" />
      </div>
    </Variant>

    <Variant title="With Progress">
      <div style="max-width: 400px">
        <File label="Image" accept="image/*" :progress="65" />
      </div>
    </Variant>

    <Variant title="Multiple Files">
      <div style="max-width: 400px">
        <File label="Photos" accept="image/*" :multiple="true" hint="Select multiple images" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# File

A file upload component with drag-and-drop, progress bar, and multiple file support.
</docs>

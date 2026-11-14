<script setup lang="ts">
import { ref } from 'vue';
import RichTextEditor from './RichTextEditor.vue';

const value = ref(
  '<h3>About The Grove</h3><p>Twenty-four bright apartments around a <strong>shared garden courtyard</strong>.</p><ul><li>In-unit laundry</li><li>Rooftop terrace</li></ul>',
);
const note = ref('');
const summary = ref('## Highlights\n\n- In-unit laundry');
</script>

<template>
  <Story title="Form/RichTextEditor" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.toolbar"
          title="Toolbar"
          :options="['default', 'compact', 'minimal']"
        />
        <HstNumber v-model="state.maxLength" title="Max length" />
        <HstCheckbox v-model="state.counter" title="Counter" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Read-only" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 640px">
          <RichTextEditor
            v-model="value"
            :label="state.label || 'Description'"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :placeholder="state.placeholder || undefined"
            :toolbar="state.toolbar || 'default'"
            :max-length="state.maxLength || undefined"
            :counter="state.counter ?? true"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Compact">
      <div style="max-width: 640px">
        <RichTextEditor
          v-model="note"
          toolbar="compact"
          label="Note to buyer"
          placeholder="Write a note for the buyer…"
        />
      </div>
    </Variant>

    <Variant title="Markdown output">
      <div style="max-width: 640px">
        <RichTextEditor v-model="summary" output="markdown" :max-length="500" label="Summary" />
      </div>
    </Variant>

    <Variant title="Invalid">
      <div style="max-width: 640px">
        <RichTextEditor v-model="note" label="Article body" error="Write at least 40 characters." />
      </div>
    </Variant>
  </Story>
</template>

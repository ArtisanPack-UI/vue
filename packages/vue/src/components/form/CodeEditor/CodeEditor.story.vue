<script setup lang="ts">
import { reactive, ref } from 'vue';
import CodeEditor from './CodeEditor.vue';

const sources = reactive<Record<string, string>>({
  'format-price.ts':
    "export function formatPrice(amount: number, currency = 'USD') {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency,\n    maximumFractionDigits: '0',\n  }).format(amount);\n}",
  'listing.blade.php': '<x-artisanpack-card />',
});
const file = ref('format-price.ts');
const language = ref('typescript');
const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
];
const diagnostics = [
  {
    line: 5,
    column: 28,
    message: "Type 'string' is not assignable to type 'number'.",
    severity: 'error' as const,
  },
];
const css = ref('.listing {\n  color: var(--apui-text-default);\n}');
</script>

<template>
  <Story title="Form/CodeEditor" group="form">
    <Variant title="Files, languages and diagnostics">
      <div style="max-width: 720px">
        <CodeEditor
          v-model="sources[file]"
          label="Source"
          :tabs="Object.keys(sources)"
          :tab="file"
          :languages="languages"
          :language="language"
          :diagnostics="file === 'format-price.ts' ? diagnostics : []"
          :rows="8"
          @tab-change="(value) => (file = value)"
          @language-change="(value) => (language = value)"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstNumber v-model="state.tabSize" title="Tab size" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Read-only" />
        <HstCheckbox v-model="state.required" title="Required" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 720px">
          <CodeEditor
            v-model="css"
            language="CSS"
            :label="state.label || 'Custom CSS'"
            :hint="state.hint || 'Added after the theme styles.'"
            :error="state.error || undefined"
            :tab-size="state.tabSize || 2"
            :rows="6"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :required="state.required"
          />
        </div>
      </template>
    </Variant>
  </Story>
</template>

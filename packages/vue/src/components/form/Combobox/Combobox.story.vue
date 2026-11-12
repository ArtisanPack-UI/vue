<script setup lang="ts">
import { ref } from 'vue';
import Combobox from './Combobox.vue';
import type { ComboboxOption, ComboboxValue } from './types';

const properties: ComboboxOption[] = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', description: 'Canada, Toronto' },
  {
    value: 'silver-lake',
    label: 'Silver Lake Bungalows',
    description: 'United States, Los Angeles',
  },
  { value: 'harbor', label: 'Harbor Point', description: 'United States, Boston' },
];

const tagOptions = ref<ComboboxOption[]>([
  { value: 'Downtown', label: 'Downtown' },
  { value: 'Garden', label: 'Garden', color: 'success' },
  { value: 'Gated community', label: 'Gated community', color: 'info' },
  { value: 'Rooftop', label: 'Rooftop', color: 'accent' },
]);

const property = ref<ComboboxValue>(null);
const tags = ref<ComboboxValue>(['Downtown', 'Garden']);
const owner = ref<ComboboxValue>(null);

function addTag(value: string) {
  tagOptions.value = [...tagOptions.value, { value, label: value }];
}
</script>

<template>
  <Story title="Form/Combobox" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstText v-model="state.hint" title="Hint" />
        <HstText v-model="state.error" title="Error" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.required" title="Required" />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.loading" title="Loading" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Combobox
            v-model="property"
            :label="state.label || 'Property'"
            leading-icon="search"
            :options="properties"
            :placeholder="state.placeholder || undefined"
            :hint="state.hint || undefined"
            :error="state.error || undefined"
            :size="state.size || undefined"
            :disabled="state.disabled"
            :required="state.required"
            :clearable="state.clearable"
            :loading="state.loading"
          />
        </div>
      </template>
    </Variant>

    <Variant title="Tags (multiple + allowCreate)">
      <div style="max-width: 400px">
        <Combobox
          v-model="tags"
          label="Listing tags"
          placeholder="Add a tag…"
          hint="Press Enter to add, Backspace to remove the last tag."
          multiple
          allow-create
          :options="tagOptions"
          @create="addTag"
        />
      </div>
    </Variant>

    <Variant title="Open with matches">
      <div style="max-width: 400px; min-height: 280px">
        <Combobox
          label="Property"
          leading-icon="search"
          :options="properties"
          search="Lake"
          allow-create
          :open="true"
          :portal="false"
        />
      </div>
    </Variant>

    <Variant title="Empty and invalid">
      <div style="max-width: 400px; min-height: 200px">
        <Combobox
          v-model="owner"
          label="Owner"
          placeholder="Search people…"
          :options="[]"
          search="Lakw"
          error="Choose an owner from the list."
          :open="true"
          :portal="false"
        >
          <template #empty>No people match “Lakw”. Check the spelling.</template>
        </Combobox>
      </div>
    </Variant>
  </Story>
</template>

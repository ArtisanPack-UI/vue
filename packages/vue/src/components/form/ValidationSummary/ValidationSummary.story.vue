<script setup lang="ts">
import ValidationSummary from './ValidationSummary.vue';

const errors = [
  { field: 'postal', message: 'Postal code: Spanish postal codes have 5 digits.' },
  { field: 'photos', message: 'Photos: add at least 2 more photos.' },
  { field: 'terms', message: 'Agreements: accept the listing terms.' },
];
const warnings = {
  description: 'Description is shorter than 80 characters.',
  'floor-plan': 'No floor plan uploaded.',
};
</script>

<template>
  <Story title="Form/ValidationSummary" group="form">
    <Variant title="Errors">
      <ValidationSummary :errors="errors" title="Fix 3 fields before publishing" />
    </Variant>

    <Variant title="Warnings">
      <ValidationSummary :errors="warnings" color="warning" />
    </Variant>
  </Story>
</template>

<docs lang="md">
# ValidationSummary

Lists every error in a form after a failed submit, each linked to its field
(`.apui-validation-summary`). Errors are an alert that takes focus; warnings are a status.
`errors` takes `[{ field, message }]` or a map of field to message(s); a link focuses the
element with that id, else the control with that name. Pass a translated `title`.
</docs>

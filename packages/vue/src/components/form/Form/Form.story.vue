<script setup lang="ts">
import Form from './Form.vue';
import Input from '../Input/Input.vue';
import Textarea from '../Textarea/Textarea.vue';
import Button from '../Button/Button.vue';
import ValidationSummary from '../ValidationSummary/ValidationSummary.vue';

function onSubmit(event: Event): void {
  event.preventDefault();
}
</script>

<template>
  <Story title="Form/Form" group="form">
    <Variant title="Basic">
      <Form aria-label="Invite member" @submit="onSubmit">
        <Input label="Email" type="email" required />
        <Textarea label="Message" :rows="3" />
        <template #actions>
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit">Send invite</Button>
        </template>
      </Form>
    </Variant>

    <Variant title="Divided, with a summary">
      <Form aria-label="Listing" divided @submit="onSubmit">
        <ValidationSummary
          :errors="[{ field: 'postal-code', message: 'Spanish postal codes have 5 digits.' }]"
        />
        <Input id="postal-code" label="Postal code" error="Spanish postal codes have 5 digits." />
        <template #actions>
          <Button type="submit">Publish listing</Button>
        </template>
      </Form>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Form

A native form (`.apui-form`) that stacks its fields with the field gap and ends with the
`actions` slot, aligned to the end. `divided` puts an edge above the actions. Listen for the
native `submit` event.
</docs>

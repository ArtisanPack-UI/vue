<script setup lang="ts">
import Fieldset from './Fieldset.vue';
import Input from '../Input/Input.vue';
import Checkbox from '../Checkbox/Checkbox.vue';
</script>

<template>
  <Story title="Form/Fieldset" group="form">
    <Variant title="Panel">
      <Fieldset title="Contact" description="Who buyers and renters should reach.">
        <div data-scope="fieldset" data-part="row">
          <Input label="Full name" />
          <Input label="Email" type="email" leading-icon="mail" />
        </div>
        <Input label="Phone" type="tel" />
      </Fieldset>
    </Variant>

    <Variant title="Divided and plain">
      <div style="display: grid; gap: 16px">
        <Fieldset variant="divided" title="Billing address">
          <Checkbox label="Same as property address" />
        </Fieldset>
        <Fieldset
          variant="plain"
          title="Payout account"
          description="Locked while a payout is processing."
          disabled
        >
          <Input label="IBAN" model-value="ES91 •••• •••• 1332" />
        </Fieldset>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Fieldset

Groups related fields under a legend (`.apui-fieldset`): a native `<fieldset>`, so the group's
name is announced with each field. `variant` is `panel`, `divided` or `plain`; `disabled`
disables every control inside. Put fields side by side in
`<div data-scope="fieldset" data-part="row">`.
</docs>

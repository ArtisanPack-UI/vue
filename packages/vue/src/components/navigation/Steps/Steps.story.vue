<script setup lang="ts">
import { ref } from 'vue';
import Step from './Step.vue';
import Steps from './Steps.vue';

const checkout = ref(3);
</script>

<template>
  <Story title="Navigation/Steps" group="navigation">
    <Variant title="Horizontal">
      <Steps :model-value="3" label="Listing progress">
        <Step title="Basics" description="Title and type" />
        <Step title="Location" description="Address and map" />
        <Step title="Pricing" description="Price and rent" />
        <Step title="Photos" description="At least 6" />
        <Step title="Review" description="Publish" />
      </Steps>
    </Variant>

    <Variant title="Vertical with error">
      <div style="max-width: 420px">
        <Steps :model-value="3" orientation="vertical">
          <Step title="Account created" description="Nov 2 · Olivia Rhye" />
          <Step title="Identity verified" description="Nov 3" />
          <Step
            state="error"
            title="Payout account"
            description="IBAN rejected by the bank. Update it to continue."
          />
          <Step title="Go live" description="Listings become public" />
        </Steps>
      </div>
    </Variant>

    <Variant title="Clickable, from data">
      <Steps
        v-model="checkout"
        clickable
        label="Checkout progress"
        :steps="[
          { title: 'Cart' },
          { title: 'Shipping' },
          { title: 'Payment' },
          { title: 'Confirm' },
        ]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import Diff from './Diff.vue';

const before = `{
  price: 220000,
  rent: 1600,
  currency: "USD",
  available: "2027-01-01",
}`;

const after = `{
  price: 220000,
  rent: 1650,
  deposit: 3300,
  currency: "USD",
  available: "2027-01-15",
}`;
</script>

<template>
  <Story title="Display/Diff" group="display">
    <Variant title="Unified">
      <Diff :old-content="before" :new-content="after" file-name="listings/grove-greenfield.json" />
    </Variant>

    <Variant title="Split">
      <Diff
        :old-content="before"
        :new-content="after"
        file-name="Version 3 → Version 4"
        view="split"
      />
    </Variant>

    <Variant title="Without word marks">
      <Diff :old-content="before" :new-content="after" :word-level="false" :context="1" />
    </Variant>
  </Story>
</template>

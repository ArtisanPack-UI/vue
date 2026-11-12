<script setup lang="ts">
import { ref } from 'vue';
import Collapse from './Collapse.vue';

const advanced = ref(false);
</script>

<template>
  <Story title="Layout/Collapse" group="layout">
    <Variant title="Section">
      <Collapse v-model:open="advanced" label="Advanced settings">
        Custom URL and search visibility.
      </Collapse>
    </Variant>
    <Variant title="Read more">
      <Collapse variant="read-more">
        Twenty-four bright apartments around a shared garden courtyard, five minutes from the tram.
        Most units face south with private balconies. The building was renovated in 2024 with new
        windows, heat pumps and a rooftop terrace.
      </Collapse>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Accordion from './Accordion.vue';
import AccordionItem from './AccordionItem.vue';
import type { AccordionItemData } from './types';

const open = ref(['live']);
const faq: AccordionItemData[] = [
  {
    value: 'live',
    title: 'How long does a listing stay live?',
    content: 'Listings stay live until you archive them or mark them as sold.',
  },
  {
    value: 'owners',
    title: 'Can co-owners edit a listing?',
    content: 'Yes, from the Sharing tab.',
  },
  {
    value: 'files',
    title: 'Which file types can I upload?',
    content: 'Images and PDFs.',
    disabled: true,
  },
];
</script>

<template>
  <Story title="Layout/Accordion" group="layout">
    <Variant title="Default (composed)">
      <Accordion v-model="open">
        <AccordionItem value="live" title="How long does a listing stay live?">
          Listings stay live until you archive them or mark them as sold.
        </AccordionItem>
        <AccordionItem value="owners" title="Can co-owners edit a listing?">
          Yes, from the Sharing tab.
        </AccordionItem>
      </Accordion>
    </Variant>
    <Variant title="Separated, multiple (data)">
      <Accordion :items="faq" variant="separated" multiple />
    </Variant>
    <Variant title="Flush">
      <Accordion :items="faq" variant="flush" />
    </Variant>
  </Story>
</template>

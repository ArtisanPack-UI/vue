<script setup lang="ts">
import Accordion from './Accordion.vue';
import Collapse from '../Collapse/Collapse.vue';
</script>

<template>
  <Story title="Layout/Accordion" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstCheckbox v-model="state.multiple" title="Multiple Open" />
        <HstCheckbox v-model="state.join" title="Join (No Gap)" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 600px">
          <Accordion :multiple="state.multiple" :join="state.join">
            <Collapse title="What is ArtisanPack UI?">
              <p>
                ArtisanPack UI is a comprehensive Vue 3 component library styled with DaisyUI and
                Tailwind CSS.
              </p>
            </Collapse>
            <Collapse title="How do I install it?">
              <p>Install via npm: <code>npm install @artisanpack-ui/vue</code></p>
            </Collapse>
            <Collapse title="Is it accessible?">
              <p>
                Yes, all components follow WAI-ARIA guidelines with proper keyboard navigation and
                screen reader support.
              </p>
            </Collapse>
          </Accordion>
        </div>
      </template>
    </Variant>

    <Variant title="Joined">
      <div style="max-width: 600px">
        <Accordion :join="true">
          <Collapse title="Section 1"><p>Content for section 1.</p></Collapse>
          <Collapse title="Section 2"><p>Content for section 2.</p></Collapse>
          <Collapse title="Section 3"><p>Content for section 3.</p></Collapse>
        </Accordion>
      </div>
    </Variant>

    <Variant title="Multiple Open">
      <div style="max-width: 600px">
        <Accordion :multiple="true" :default-open-indices="[0, 1]">
          <Collapse title="Always Open"><p>This starts open.</p></Collapse>
          <Collapse title="Also Open"><p>This also starts open.</p></Collapse>
          <Collapse title="Closed"><p>This starts closed.</p></Collapse>
        </Accordion>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Accordion

A group of collapsible panels with single or multiple open mode.
</docs>

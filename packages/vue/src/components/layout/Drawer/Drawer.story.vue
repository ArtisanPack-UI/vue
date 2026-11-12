<script setup lang="ts">
import Drawer from './Drawer.vue';
import Button from '../../form/Button/Button.vue';
import Input from '../../form/Input/Input.vue';
</script>

<template>
  <Story title="Layout/Drawer" group="layout">
    <Variant title="Default">
      <template #controls="{ state }">
        <HstSelect v-model="state.side" title="Side" :options="['', 'end', 'start', 'bottom']" />
        <HstSelect v-model="state.size" title="Size" :options="['', 'sm', 'md', 'lg']" />
      </template>

      <template #default="{ state }">
        <div style="padding: 16px; min-height: 480px">
          <Drawer
            :open="true"
            :portal="false"
            :modal="false"
            :side="state.side || undefined"
            :size="state.size || undefined"
            title="Filters"
            description="218 properties match"
          >
            <Input label="Location" leading-icon="search" />
            <template #footer>
              <Button variant="ghost" color="neutral">Reset</Button>
              <Button>Show 218 results</Button>
            </template>
          </Drawer>
        </div>
      </template>
    </Variant>

    <Variant title="With trigger">
      <Drawer trigger="Filters" title="Filters" description="218 properties match">
        <Input label="Location" leading-icon="search" />
      </Drawer>
    </Variant>

    <Variant title="Bottom sheet">
      <Drawer side="bottom" trigger="Share" title="Share listing">
        <Button variant="outline" color="neutral" leading-icon="copy">Copy link</Button>
        <Button variant="outline" color="neutral" leading-icon="mail">Email</Button>
      </Drawer>
    </Variant>
  </Story>
</template>

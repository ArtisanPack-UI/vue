<script setup lang="ts">
import Popover from './Popover.vue';
import Button from '../../form/Button/Button.vue';
import Input from '../../form/Input/Input.vue';
</script>

<template>
  <Story title="Layout/Popover" group="layout">
    <Variant title="Default">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.placement"
          title="Placement"
          :options="['', 'top', 'bottom', 'start', 'end']"
        />
      </template>

      <template #default="{ state }">
        <div style="padding: 160px">
          <Popover trigger="Share" title="Share report" :placement="state.placement || undefined">
            <Input label="Link" readonly value="horizon.app/r/q4-income" />
            <template #actions>
              <Button size="sm" leading-icon="copy">Copy link</Button>
            </template>
          </Popover>
        </div>
      </template>
    </Variant>

    <Variant title="Own trigger">
      <div style="padding: 160px">
        <Popover placement="top" title="What counts as a visit?">
          <template #trigger>
            <Button
              variant="ghost"
              color="neutral"
              size="sm"
              icon-only
              leading-icon="info"
              aria-label="About visits"
            />
          </template>
          <p>A unique person who opened the listing for at least 5 seconds, counted once a day.</p>
        </Popover>
      </div>
    </Variant>
  </Story>
</template>

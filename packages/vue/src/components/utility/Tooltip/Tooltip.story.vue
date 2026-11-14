<script setup lang="ts">
import Tooltip from './Tooltip.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Utility/Tooltip" group="utility">
    <Variant title="Default">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.placement"
          title="Placement"
          :options="['', 'top', 'bottom', 'start', 'end']"
        />
      </template>

      <template #default="{ state }">
        <div style="padding: 80px">
          <Tooltip content="Edit" shortcut="E" :placement="state.placement || undefined">
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              icon-only
              leading-icon="pencil"
              aria-label="Edit"
            />
          </Tooltip>
        </div>
      </template>
    </Variant>

    <Variant title="Long text">
      <div style="padding: 80px">
        <Tooltip
          size="lg"
          placement="end"
          content="Conversion is completed deals divided by unique visits in the period."
        >
          <Button
            variant="ghost"
            color="neutral"
            size="sm"
            icon-only
            leading-icon="info"
            aria-label="About conversion"
          />
        </Tooltip>
      </div>
    </Variant>

    <Variant title="Forced open">
      <div style="padding: 80px">
        <Tooltip content="Edit" shortcut="E" :open="true" placement="bottom">
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            icon-only
            leading-icon="pencil"
            aria-label="Edit"
          />
        </Tooltip>
      </div>
    </Variant>
  </Story>
</template>

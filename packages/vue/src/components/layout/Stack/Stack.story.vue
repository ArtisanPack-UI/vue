<script setup lang="ts">
import Stack from './Stack.vue';
</script>

<template>
  <Story title="Layout/Stack" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.direction"
          title="Direction"
          :options="['vertical', 'horizontal']"
        />
        <HstSelect v-model="state.gap" title="Gap" :options="[0, 1, 2, 3, 4, 5, 6, 8]" />
        <HstSelect
          v-model="state.align"
          title="Align"
          :options="['', 'start', 'center', 'end', 'stretch', 'baseline']"
        />
        <HstSelect
          v-model="state.justify"
          title="Justify"
          :options="['', 'start', 'center', 'end', 'between', 'around', 'evenly']"
        />
        <HstCheckbox v-model="state.wrap" title="Wrap" />
      </template>

      <template #default="{ state }">
        <Stack
          :direction="state.direction || 'vertical'"
          :gap="state.gap ?? 4"
          :align="state.align || undefined"
          :justify="state.justify || undefined"
          :wrap="state.wrap"
        >
          <div
            v-for="i in 4"
            :key="i"
            style="background: #06b6d4; color: white; padding: 12px 24px; border-radius: 8px"
          >
            Item {{ i }}
          </div>
        </Stack>
      </template>
    </Variant>

    <Variant title="Horizontal">
      <Stack direction="horizontal" :gap="4" align="center">
        <div style="background: #f43f5e; color: white; padding: 8px 16px; border-radius: 8px">
          Left
        </div>
        <div style="background: #f43f5e; color: white; padding: 16px 24px; border-radius: 8px">
          Center
        </div>
        <div style="background: #f43f5e; color: white; padding: 8px 16px; border-radius: 8px">
          Right
        </div>
      </Stack>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Stack

A flex layout component with direction, gap, alignment, and wrap support.
</docs>

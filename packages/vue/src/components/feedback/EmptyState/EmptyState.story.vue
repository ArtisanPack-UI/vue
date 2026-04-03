<script setup lang="ts">
import EmptyState from './EmptyState.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Feedback/EmptyState" group="feedback">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.heading" title="Heading" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect v-model="state.headingAs" title="Heading Tag" :options="['h1', 'h2', 'h3', 'h4', 'h5', 'h6']" />
      </template>

      <template #default="{ state }">
        <EmptyState
          :heading="state.heading || 'No results found'"
          :description="state.description || 'Try adjusting your search or filters.'"
          :heading-as="state.headingAs || 'h3'"
        >
          <template #action>
            <Button color="primary">Reset Filters</Button>
          </template>
        </EmptyState>
      </template>
    </Variant>

    <Variant title="With Icon">
      <EmptyState heading="No posts yet" description="Create your first post to get started.">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 48px; height: 48px; color: #9ca3af">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </template>
        <template #action>
          <Button color="primary">Create Post</Button>
        </template>
      </EmptyState>
    </Variant>
  </Story>
</template>

<docs lang="md">
# EmptyState

A placeholder for empty content with heading, description, icon, and action slots.
</docs>

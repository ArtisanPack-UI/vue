<script setup lang="ts">
import EmptyState from './EmptyState.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Feedback/EmptyState" group="feedback">
    <Variant title="First use">
      <EmptyState
        title="No properties yet"
        description="Add your first property to start tracking visits, offers and revenue."
      >
        <template #actions>
          <Button leading-icon="plus">Add property</Button>
        </template>
      </EmptyState>
    </Variant>
    <Variant title="No results">
      <EmptyState
        variant="no-results"
        title="No results for “Lakw”"
        description="Check the spelling, or clear filters."
      >
        <template #actions>
          <Button variant="outline" color="neutral">Clear filters</Button>
        </template>
      </EmptyState>
    </Variant>
    <Variant title="Cleared, small">
      <EmptyState
        variant="cleared"
        size="sm"
        :heading-level="4"
        title="You’re all caught up"
        description="New offers will appear here."
      />
    </Variant>
  </Story>
</template>

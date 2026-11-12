<script setup lang="ts">
import Avatar from '../../display/Avatar/Avatar.vue';
import Badge from '../../display/Badge/Badge.vue';
import List from './List.vue';
import ListItem from './ListItem.vue';
</script>

<template>
  <Story title="Layout/ListItem" group="layout">
    <Variant title="People">
      <List variant="bordered" style="max-width: 420px">
        <ListItem title="Olivia Rhye" description="olivia@company.com">
          <template #leading><Avatar name="Olivia Rhye" /></template>
          <template #trailing><Badge color="primary">Admin</Badge></template>
        </ListItem>
        <ListItem title="Phoenix Baker" description="phoenix@company.com" href="#" selected>
          <template #leading><Avatar name="Phoenix Baker" /></template>
          <template #trailing><Badge>Editor</Badge></template>
        </ListItem>
        <ListItem title="Demi Wilkinson" description="Invitation pending" disabled>
          <template #leading><Avatar name="Demi Wilkinson" /></template>
        </ListItem>
      </List>
    </Variant>

    <Variant title="Notifications">
      <List variant="divided" style="max-width: 420px">
        <ListItem
          interactive
          leading-icon="mail"
          title="Offer received"
          description="Lakeview Lofts · $248,000"
          trailing="2m"
        />
        <ListItem
          interactive
          leading-icon="calendar"
          title="Viewing booked"
          description="Thu, Nov 12 · 11:00"
          trailing="1h"
        />
      </List>
    </Variant>
  </Story>
</template>

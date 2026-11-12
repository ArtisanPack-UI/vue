<script setup lang="ts">
import Timeline from './Timeline.vue';
import TimelineItem from './TimelineItem.vue';
</script>

<template>
  <Story title="Display/Timeline" group="display">
    <Variant title="Activity feed">
      <div style="max-width: 460px">
        <Timeline label="Activity">
          <TimelineItem
            icon="circle-check"
            color="success"
            time="2h ago"
            datetime="2026-11-12T08:00"
            description="Phoenix Baker accepted $248,000."
          >
            <strong>Offer accepted</strong> on Lakeview Lofts
          </TimelineItem>
          <TimelineItem
            icon="message-square"
            time="5h ago"
            card="Can we move the viewing to Thursday at 11:00? The tenant is out until then."
          >
            <strong>Olivia Rhye</strong> commented
          </TimelineItem>
          <TimelineItem icon="house" color="primary" time="Dec 13" title="Listing published" />
        </Timeline>
      </div>
    </Variant>

    <Variant title="Dots, from data">
      <Timeline
        style="max-width: 360px"
        variant="dot"
        label="Shipping history"
        :items="[
          { title: 'Delivered', time: 'Nov 7, 14:02', color: 'success' },
          { title: 'Out for delivery', time: 'Nov 7, 08:15', color: 'primary' },
          { title: 'Arrived at Barcelona hub', time: 'Nov 6, 22:40' },
          { title: 'Shipped from Madrid', time: 'Nov 6, 09:10' },
        ]"
      />
    </Variant>
  </Story>
</template>

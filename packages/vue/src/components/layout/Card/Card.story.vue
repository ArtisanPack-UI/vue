<script setup lang="ts">
import Card from './Card.vue';
import Button from '../../form/Button/Button.vue';

const media =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%2394a3b8'/%3E%3C/svg%3E";
</script>

<template>
  <Story title="Layout/Card" group="layout">
    <Variant title="Default">
      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect
          v-model="state.surface"
          title="Surface"
          :options="['', 'default', 'raised', 'sunken', 'glass']"
        />
        <HstCheckbox v-model="state.interactive" title="Interactive" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Card
            :title="state.title || 'Quarterly report'"
            :description="state.description || 'Updated 2 hours ago'"
            :surface="state.surface || undefined"
            :interactive="state.interactive"
          >
            Revenue grew 12% this quarter.
            <template #footer>3 comments</template>
          </Card>
        </div>
      </template>
    </Variant>

    <Variant title="Surfaces">
      <div style="display: grid; gap: 16px; max-width: 400px">
        <Card title="Raised" surface="raised">A raised surface.</Card>
        <Card title="Sunken" surface="sunken">A sunken surface.</Card>
      </div>
    </Variant>

    <Variant title="With Media">
      <div style="max-width: 400px">
        <Card :media="media" title="Quarterly report" description="Updated 2 hours ago">
          Revenue grew 12% this quarter.
          <template #actions>
            <Button size="sm" variant="ghost">Share</Button>
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="Glass">
      <div
        style="
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          max-width: 448px;
        "
      >
        <Card title="Glass" surface="glass">Content on a glass surface.</Card>
      </div>
    </Variant>

    <Variant title="As Link">
      <div style="max-width: 400px">
        <Card href="https://example.com" title="Read the report" description="PDF, 2 MB">
          The whole card is the link's hit area; the actions stay separately clickable.
          <template #actions>
            <Button size="sm" variant="outline">Share</Button>
          </template>
        </Card>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Card

The default container (`.apui-card`): a surface with an edge, plus optional media, header,
body and footer parts. Title, description, actions, footer and media take a prop or a slot.

## Usage

```vue
<Card title="Quarterly report" description="Updated 2 hours ago" href="/reports/q3">
  Revenue grew 12% this quarter.
  <template #actions><Button size="sm" variant="ghost">Share</Button></template>
  <template #footer>3 comments</template>
</Card>
```
</docs>

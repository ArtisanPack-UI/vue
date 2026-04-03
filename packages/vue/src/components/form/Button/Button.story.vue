<script setup lang="ts">
import Button from './Button.vue';
</script>

<template>
  <Story title="Form/Button" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="[
            '',
            'primary',
            'secondary',
            'accent',
            'neutral',
            'info',
            'success',
            'warning',
            'error',
            'ghost',
            'outline',
          ]"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="['', 'xs', 'sm', 'md', 'lg']"
        />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.responsive" title="Responsive" />
        <HstText v-model="state.tooltip" title="Tooltip" />
        <HstText v-model="state.badge" title="Badge" />
      </template>

      <template #default="{ state }">
        <Button
          :label="state.label || undefined"
          :color="state.color || undefined"
          :size="state.size || undefined"
          :loading="state.loading"
          :disabled="state.disabled"
          :responsive="state.responsive"
          :tooltip="state.tooltip || undefined"
          :badge="state.badge || undefined"
        >
          {{ state.label ? '' : 'Click Me' }}
        </Button>
      </template>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="accent">Accent</Button>
        <Button color="neutral">Neutral</Button>
        <Button color="info">Info</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="error">Error</Button>
        <Button color="ghost">Ghost</Button>
        <Button color="outline">Outline</Button>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Button size="xs" color="primary">Extra Small</Button>
        <Button size="sm" color="primary">Small</Button>
        <Button size="md" color="primary">Medium</Button>
        <Button size="lg" color="primary">Large</Button>
      </div>
    </Variant>

    <Variant title="Loading">
      <div style="display: flex; gap: 8px">
        <Button color="primary" :loading="true">Saving...</Button>
        <Button color="secondary" :loading="true">Loading</Button>
      </div>
    </Variant>

    <Variant title="With Badge">
      <div style="display: flex; gap: 8px">
        <Button color="primary" badge="99+" badge-color="secondary">Inbox</Button>
        <Button color="neutral" badge="New" badge-color="accent">Updates</Button>
      </div>
    </Variant>

    <Variant title="With Tooltip">
      <div style="display: flex; gap: 8px">
        <Button color="primary" tooltip="Save your changes">Save</Button>
        <Button color="error" tooltip="This action cannot be undone" tooltip-position="bottom"
          >Delete</Button
        >
      </div>
    </Variant>

    <Variant title="As Link">
      <div style="display: flex; gap: 8px">
        <Button color="primary" link="https://example.com">Internal Link</Button>
        <Button color="accent" link="https://example.com" :external="true"
          >External Link</Button
        >
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="display: flex; gap: 8px">
        <Button color="primary" :disabled="true">Disabled</Button>
        <Button color="secondary" :disabled="true">Disabled</Button>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Button

A versatile button component supporting colors, sizes, loading states, tooltips, badges, and link behavior.

## Usage

```vue
<Button color="primary" size="md">Click Me</Button>
<Button color="error" :loading="true">Saving...</Button>
<Button color="info" tooltip="More info" badge="3">Notifications</Button>
```
</docs>

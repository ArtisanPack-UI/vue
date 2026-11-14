<script setup lang="ts">
import Button from './Button.vue';

const variants = ['solid', 'soft', 'outline', 'ghost', 'link'] as const;
const colors = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
] as const;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
</script>

<template>
  <Story title="Form/Button" group="form">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect v-model="state.variant" title="Variant" :options="['', ...variants]" />
        <HstSelect v-model="state.color" title="Color" :options="['', ...colors]" />
        <HstSelect v-model="state.size" title="Size" :options="['', ...sizes]" />
        <HstText v-model="state.leadingIcon" title="Leading icon" />
        <HstText v-model="state.trailingIcon" title="Trailing icon" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>

      <template #default="{ state }">
        <Button
          :variant="state.variant || undefined"
          :color="state.color || undefined"
          :size="state.size || undefined"
          :leading-icon="state.leadingIcon || undefined"
          :trailing-icon="state.trailingIcon || undefined"
          :loading="state.loading"
          :disabled="state.disabled"
        >
          {{ state.label || 'Click Me' }}
        </Button>
      </template>
    </Variant>

    <Variant title="Variants">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Button v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </Button>
      </div>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Button v-for="color in colors" :key="color" :color="color">{{ color }}</Button>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Button v-for="size in sizes" :key="size" :size="size">{{ size }}</Button>
      </div>
    </Variant>

    <Variant title="Loading">
      <div style="display: flex; gap: 8px">
        <Button :loading="true">Saving</Button>
        <Button variant="outline" :loading="true">Loading</Button>
      </div>
    </Variant>

    <Variant title="Icons">
      <div style="display: flex; gap: 8px">
        <Button leading-icon="plus">New item</Button>
        <Button variant="soft" trailing-icon="arrow-right">Next</Button>
        <Button :icon-only="true" leading-icon="trash" color="error" aria-label="Delete" />
      </div>
    </Variant>

    <Variant title="As Link">
      <div style="display: flex; gap: 8px">
        <Button href="https://example.com">Link</Button>
        <Button href="https://example.com" :disabled="true">Disabled link</Button>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="display: flex; gap: 8px">
        <Button :disabled="true">Disabled</Button>
        <Button variant="outline" :disabled="true">Disabled</Button>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Button

Triggers an action. The design-system Button (`.apui-button`): variants, colors, sizes, icons
by name (or the `icon` / `iconEnd` slots), a loading state, and anchor rendering with `href`.

## Usage

```vue
<Button>Save</Button>
<Button variant="outline" color="error" leading-icon="trash">Delete</Button>
<Button :loading="true">Saving</Button>
<Button href="/docs" trailing-icon="arrow-right">Read the docs</Button>
```
</docs>

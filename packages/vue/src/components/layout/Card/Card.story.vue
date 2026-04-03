<script setup lang="ts">
import Card from './Card.vue';
import Button from '../../form/Button/Button.vue';
</script>

<template>
  <Story title="Layout/Card" group="layout">
    <Variant title="Playground">
      <template #controls="{ state }">
        <HstSelect
          v-model="state.figurePosition"
          title="Figure Position"
          :options="['', 'top', 'bottom', 'left', 'right']"
        />
        <HstCheckbox v-model="state.noShadow" title="No Shadow" />
        <HstCheckbox v-model="state.bordered" title="Bordered" />
        <HstCheckbox v-model="state.compact" title="Compact" />
        <HstCheckbox v-model="state.glass" title="Glass" />
      </template>

      <template #default="{ state }">
        <div style="max-width: 400px">
          <Card
            :figure-position="state.figurePosition || undefined"
            :no-shadow="state.noShadow"
            :bordered="state.bordered"
            :compact="state.compact"
            :glass="state.glass"
          >
            <template #header>
              <h3 style="font-size: 1.125rem; font-weight: bold">Card Title</h3>
            </template>
            <p>This is the card content. You can put any content here.</p>
            <template #footer>
              <Button color="primary" size="sm">Action</Button>
            </template>
          </Card>
        </div>
      </template>
    </Variant>

    <Variant title="Bordered">
      <div style="max-width: 400px">
        <Card :bordered="true">
          <template #header>
            <h3 style="font-size: 1.125rem; font-weight: bold">Bordered Card</h3>
          </template>
          <p>A card with a border instead of a shadow.</p>
        </Card>
      </div>
    </Variant>

    <Variant title="Compact">
      <div style="max-width: 400px">
        <Card :compact="true">
          <template #header>
            <h3 style="font-size: 1rem; font-weight: bold">Compact Card</h3>
          </template>
          <p>Reduced padding for dense layouts.</p>
        </Card>
      </div>
    </Variant>

    <Variant title="Glass Effect">
      <div style="max-width: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 8px">
        <Card :glass="true">
          <template #header>
            <h3 style="font-size: 1.125rem; font-weight: bold; color: white">Glass Card</h3>
          </template>
          <p style="color: white">A card with a glass/blur effect.</p>
        </Card>
      </div>
    </Variant>

    <Variant title="As Link">
      <div style="max-width: 400px">
        <Card link="https://example.com">
          <template #header>
            <h3 style="font-size: 1.125rem; font-weight: bold">Clickable Card</h3>
          </template>
          <p>This entire card is a link.</p>
        </Card>
      </div>
    </Variant>

    <Variant title="Composition Example">
      <div style="max-width: 400px">
        <Card>
          <template #header>
            <h3 style="font-size: 1.125rem; font-weight: bold">User Profile</h3>
          </template>
          <p>John Doe — Software Engineer</p>
          <p style="font-size: 0.875rem; color: gray">Member since 2024</p>
          <template #footer>
            <div style="display: flex; gap: 8px">
              <Button color="primary" size="sm">Edit</Button>
              <Button color="ghost" size="sm">View</Button>
            </div>
          </template>
        </Card>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# Card

A flexible card component with header/footer slots, figure positions, and style variants.
</docs>

<script setup lang="ts">
/** @module ai/FeatureToggles */
import { onMounted, reactive, ref } from 'vue';
import Alert from '../../feedback/Alert/Alert.vue';
import EmptyState from '../../feedback/EmptyState/EmptyState.vue';
import Loading from '../../feedback/Loading/Loading.vue';
import Toggle from '../../form/Toggle/Toggle.vue';
import Card from '../../layout/Card/Card.vue';
import Heading from '../../layout/Heading/Heading.vue';
import Stack from '../../layout/Stack/Stack.vue';
import Text from '../../layout/Text/Text.vue';
import type { AiApiClient, AiFeature } from '../types';

interface Props {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Optional heading rendered above the list. */
  heading?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  toggle: [feature: Pick<AiFeature, 'key' | 'package' | 'enabled'>];
}>();

const features = ref<AiFeature[] | null>(null);
const error = ref<string | null>(null);
const pending = reactive<Record<string, boolean>>({});

onMounted(async () => {
  try {
    const response = await props.client.getFeatures();
    features.value = response.features;
  } catch (err) {
    error.value = (err as Error).message;
  }
});

async function handleToggle(feature: AiFeature): Promise<void> {
  const target = !feature.enabled;
  pending[feature.key] = true;
  // Optimistic flip
  if (features.value) {
    features.value = features.value.map((f) =>
      f.key === feature.key ? { ...f, enabled: target } : f,
    );
  }

  try {
    const response = await props.client.toggleFeature(feature.key, target);
    error.value = null;
    emit('toggle', response.feature);
  } catch (err) {
    // Roll back on failure
    if (features.value) {
      features.value = features.value.map((f) =>
        f.key === feature.key ? { ...f, enabled: feature.enabled } : f,
      );
    }
    error.value = (err as Error).message;
  } finally {
    delete pending[feature.key];
  }
}
</script>

<template>
  <Stack gap="3" data-testid="ai-feature-toggles">
    <Heading v-if="heading" :level="2">
      {{ heading }}
    </Heading>

    <Alert v-if="error && !features" color="error" :description="error" />

    <Loading v-else-if="!features" size="sm"> Loading features… </Loading>

    <EmptyState v-else-if="features.length === 0" size="sm" title="No AI features registered." />

    <template v-else>
      <Alert v-if="error" color="error" :description="error" />
      <Stack gap="2" role="list">
        <Card v-for="feature in features" :key="feature.key" role="listitem">
          <Toggle
            color="primary"
            :label="feature.label"
            :description="feature.description || undefined"
            :checked="feature.enabled"
            :disabled="pending[feature.key] === true"
            @update:checked="handleToggle(feature)"
          />
          <template #footer>
            <Text as="span" size="xs" tone="muted">
              {{ feature.package }} · {{ feature.key }}
            </Text>
          </template>
        </Card>
      </Stack>
    </template>
  </Stack>
</template>

<script setup lang="ts">
/** @module ai/FeatureToggles */
import { onScopeDispose, ref, watch } from 'vue';
import Alert from '../../feedback/Alert/Alert.vue';
import EmptyState from '../../feedback/EmptyState/EmptyState.vue';
import Loading from '../../feedback/Loading/Loading.vue';
import Toggle from '../../form/Toggle/Toggle.vue';
import Card from '../../layout/Card/Card.vue';
import Heading from '../../layout/Heading/Heading.vue';
import Stack from '../../layout/Stack/Stack.vue';
import Text from '../../layout/Text/Text.vue';
import type { AiApiClient, AiFeature } from '../types';
import { errorMessage } from '../errorMessage';

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
const pending = ref<Record<string, boolean>>({});
// Bumped whenever `client` changes or the scope is disposed, so a request
// started against an earlier client can never write into the current state.
let generation = 0;

async function loadFeatures(): Promise<void> {
  const current = ++generation;
  features.value = null;
  error.value = null;
  pending.value = {};
  try {
    const response = await props.client.getFeatures();
    if (current === generation) features.value = response.features;
  } catch (err) {
    if (current === generation) error.value = errorMessage(err);
  }
}

watch(() => props.client, loadFeatures, { immediate: true });

onScopeDispose(() => {
  generation++;
});

function setEnabled(key: string, enabled: boolean): void {
  if (features.value) {
    features.value = features.value.map((f) => (f.key === key ? { ...f, enabled } : f));
  }
}

async function handleToggle(feature: AiFeature): Promise<void> {
  const current = generation;
  const target = !feature.enabled;
  pending.value = { ...pending.value, [feature.key]: true };
  // Optimistic flip
  setEnabled(feature.key, target);

  let response: Awaited<ReturnType<AiApiClient['toggleFeature']>>;
  try {
    response = await props.client.toggleFeature(feature.key, target);
  } catch (err) {
    if (current === generation) {
      // Roll back on failure
      setEnabled(feature.key, feature.enabled);
      error.value = errorMessage(err);
    }
    return;
  } finally {
    if (current === generation) {
      const next = { ...pending.value };
      delete next[feature.key];
      pending.value = next;
    }
  }

  if (current !== generation) return;
  error.value = null;
  // Outside the request's try: the server has saved the change, so a
  // throwing listener must not roll the switch back or show as a failure.
  try {
    emit('toggle', response.feature);
  } catch (listenerError) {
    console.error('FeatureToggles: toggle listener threw', listenerError);
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

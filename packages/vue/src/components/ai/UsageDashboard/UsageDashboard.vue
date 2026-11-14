<script setup lang="ts">
/** @module ai/UsageDashboard */
import { computed, onScopeDispose, ref, watch } from 'vue';
import Table from '../../data/Table/Table.vue';
import type { TableColumn } from '../../data/Table/types';
import Stat from '../../display/Stat/Stat.vue';
import Alert from '../../feedback/Alert/Alert.vue';
import Loading from '../../feedback/Loading/Loading.vue';
import Heading from '../../layout/Heading/Heading.vue';
import Stack from '../../layout/Stack/Stack.vue';
import Text from '../../layout/Text/Text.vue';
import type { AiApiClient, AiUsageResponse } from '../types';
import { errorMessage } from '../errorMessage';
import { USAGE_DASHBOARD_LABELS, type UsageDashboardLabels } from '../labels';

interface Props {
  /** API client wrapping the artisanpack-ui/ai JSON endpoints. */
  client: AiApiClient;
  /** Optional `from` date (YYYY-MM-DD) passed as a query param. */
  from?: string;
  /** Optional `to` date (YYYY-MM-DD) passed as a query param. */
  to?: string;
  /**
   * Poll interval in milliseconds for live updates. Defaults to `0` (no polling).
   */
  refreshInterval?: number;
  /** Optional heading rendered above the dashboard. */
  heading?: string;
  /** Built-in text (stat labels, table titles and headers…), merged over the English defaults; translate it. */
  labels?: Partial<UsageDashboardLabels>;
}

const props = withDefaults(defineProps<Props>(), {
  from: undefined,
  to: undefined,
  refreshInterval: 0,
  heading: undefined,
  labels: undefined,
});

const text = computed<UsageDashboardLabels>(() => ({ ...USAGE_DASHBOARD_LABELS, ...props.labels }));

const usage = ref<AiUsageResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
// Each polling run gets its own token: a change to the client, range or
// interval starts a new run and retires the previous run's responses.
let run = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

const formatNumber = (value: number): string => new Intl.NumberFormat().format(value);
const formatCost = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

const featureColumns = computed<TableColumn[]>(() => [
  { key: 'feature_key', label: text.value.feature },
  { key: 'requests', label: text.value.requests, numeric: true },
  { key: 'input_tokens', label: text.value.input, numeric: true },
  { key: 'output_tokens', label: text.value.output, numeric: true },
  { key: 'cost', label: text.value.cost, numeric: true },
]);

const dailyColumns = computed<TableColumn[]>(() => [
  { key: 'period', label: text.value.day },
  { key: 'requests', label: text.value.requests, numeric: true },
  { key: 'total_tokens', label: text.value.tokens, numeric: true },
  { key: 'cost', label: text.value.cost, numeric: true },
]);

/** The live status, with `:seconds` replaced by the interval in seconds. */
const liveText = computed(() =>
  text.value.live.replaceAll(':seconds', String(Math.round(props.refreshInterval / 1000))),
);

function stopPolling(): void {
  run++;
  clearTimeout(timer);
  timer = undefined;
}

function startPolling(): void {
  stopPolling();
  const current = run;

  const poll = async (): Promise<void> => {
    try {
      const response = await props.client.getUsage({ from: props.from, to: props.to });
      if (current !== run) return;
      usage.value = response;
      error.value = null;
    } catch (err) {
      if (current !== run) return;
      error.value = errorMessage(err, text.value.genericError);
    } finally {
      if (current === run) {
        loading.value = false;
        // Schedule the next poll only once this one has settled, so a slow
        // response is never superseded by the poll after it.
        if (props.refreshInterval > 0) timer = setTimeout(poll, props.refreshInterval);
      }
    }
  };

  void poll();
}

// A new client or date range makes the current figures wrong, so drop them
// rather than show the previous range's totals under a failed reload.
watch(
  () => [props.client, props.from, props.to],
  () => {
    usage.value = null;
    error.value = null;
    loading.value = true;
    startPolling();
  },
  { immediate: true },
);

watch(() => props.refreshInterval, startPolling);

onScopeDispose(stopPolling);
</script>

<template>
  <Loading v-if="loading && !usage" size="sm">{{ text.loading }}</Loading>

  <Alert v-else-if="error && !usage" color="error" :description="error" />

  <Stack v-else-if="usage" gap="6" data-testid="ai-usage-dashboard">
    <Heading v-if="heading" :level="2">
      {{ heading }}
    </Heading>

    <Alert v-if="error" color="warning" :title="text.refreshError" :description="error" />

    <Stack orientation="horizontal" gap="4" wrap>
      <Stat :label="text.requests" :value="formatNumber(usage.totals.requests)" />
      <Stat :label="text.inputTokens" :value="formatNumber(usage.totals.input_tokens)" />
      <Stat :label="text.outputTokens" :value="formatNumber(usage.totals.output_tokens)" />
      <Stat :label="text.cost" :value="formatCost(usage.totals.cost)" />
    </Stack>

    <Table
      :title="text.byFeature"
      :headers="featureColumns"
      :rows="usage.by_feature"
      key-by="feature_key"
      density="compact"
      :empty-text="text.noFeatureUsage"
    >
      <template #cell-requests="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-input_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-output_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-cost="{ value }">{{ formatCost(value as number) }}</template>
    </Table>

    <Table
      :title="text.daily"
      :headers="dailyColumns"
      :rows="usage.daily"
      key-by="period"
      density="compact"
      :empty-text="text.noDailyUsage"
    >
      <template #cell-requests="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-total_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-cost="{ value }">{{ formatCost(value as number) }}</template>
    </Table>

    <Text v-if="refreshInterval > 0" size="xs" tone="muted" role="status" aria-live="polite">
      {{ liveText }}
    </Text>
  </Stack>
</template>

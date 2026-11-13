<script setup lang="ts">
/** @module ai/UsageDashboard */
import { onScopeDispose, ref, watch } from 'vue';
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
}

const props = withDefaults(defineProps<Props>(), {
  from: undefined,
  to: undefined,
  refreshInterval: 0,
  heading: undefined,
});

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

const featureColumns: TableColumn[] = [
  { key: 'feature_key', label: 'Feature' },
  { key: 'requests', label: 'Requests', numeric: true },
  { key: 'input_tokens', label: 'Input', numeric: true },
  { key: 'output_tokens', label: 'Output', numeric: true },
  { key: 'cost', label: 'Cost', numeric: true },
];

const dailyColumns: TableColumn[] = [
  { key: 'period', label: 'Day' },
  { key: 'requests', label: 'Requests', numeric: true },
  { key: 'total_tokens', label: 'Tokens', numeric: true },
  { key: 'cost', label: 'Cost', numeric: true },
];

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
      error.value = errorMessage(err);
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
  <Loading v-if="loading && !usage" size="sm"> Loading usage… </Loading>

  <Alert v-else-if="error && !usage" color="error" :description="error" />

  <Stack v-else-if="usage" gap="6" data-testid="ai-usage-dashboard">
    <Heading v-if="heading" :level="2">
      {{ heading }}
    </Heading>

    <Alert
      v-if="error"
      color="warning"
      title="Couldn't refresh usage. Showing the last figures loaded."
      :description="error"
    />

    <Stack orientation="horizontal" gap="4" wrap>
      <Stat label="Requests" :value="formatNumber(usage.totals.requests)" />
      <Stat label="Input tokens" :value="formatNumber(usage.totals.input_tokens)" />
      <Stat label="Output tokens" :value="formatNumber(usage.totals.output_tokens)" />
      <Stat label="Cost" :value="formatCost(usage.totals.cost)" />
    </Stack>

    <Table
      title="By feature"
      :headers="featureColumns"
      :rows="usage.by_feature"
      key-by="feature_key"
      density="compact"
      empty-text="No feature usage in this range."
    >
      <template #cell-requests="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-input_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-output_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-cost="{ value }">{{ formatCost(value as number) }}</template>
    </Table>

    <Table
      title="Daily"
      :headers="dailyColumns"
      :rows="usage.daily"
      key-by="period"
      density="compact"
      empty-text="No daily usage in this range."
    >
      <template #cell-requests="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-total_tokens="{ value }">{{ formatNumber(value as number) }}</template>
      <template #cell-cost="{ value }">{{ formatCost(value as number) }}</template>
    </Table>

    <Text v-if="refreshInterval > 0" size="xs" tone="muted" role="status" aria-live="polite">
      Live · refreshing every {{ Math.round(refreshInterval / 1000) }}s
    </Text>
  </Stack>
</template>

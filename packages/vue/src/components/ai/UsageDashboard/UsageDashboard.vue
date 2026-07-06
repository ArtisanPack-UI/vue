<script setup lang="ts">
/** @module ai/UsageDashboard */
import { onMounted, onScopeDispose, ref, watch } from 'vue';
import type { AiApiClient, AiUsageResponse } from '../types';

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
let intervalId: ReturnType<typeof setInterval> | null = null;
let requestSeq = 0;

const formatNumber = (value: number): string => new Intl.NumberFormat().format(value);
const formatCost = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

async function load(): Promise<void> {
  const seq = ++requestSeq;
  try {
    const response = await props.client.getUsage({ from: props.from, to: props.to });
    // Discard responses that lost the race to a newer request — otherwise
    // a slow-poll response can clobber a fresher one under high latency.
    if (seq !== requestSeq) return;
    usage.value = response;
    error.value = null;
  } catch (err) {
    if (seq !== requestSeq) return;
    error.value = (err as Error).message;
  } finally {
    if (seq === requestSeq) {
      loading.value = false;
    }
  }
}

onMounted(() => {
  load();
});

// Reload when the date range changes so callers driving a date picker see
// fresh data on every prop update, not just at mount / poll tick.
watch(
  () => [props.from, props.to],
  () => {
    loading.value = true;
    load();
  },
);

watch(
  () => props.refreshInterval,
  (interval) => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (interval > 0) {
      intervalId = setInterval(load, interval);
    }
  },
  { immediate: true },
);

onScopeDispose(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<template>
  <div v-if="loading && !usage" class="flex items-center gap-2" role="status" aria-live="polite">
    <span class="loading loading-spinner loading-sm" aria-hidden="true" />
    <span>Loading usage…</span>
  </div>

  <div v-else-if="error && !usage" role="alert" class="alert alert-error">
    <span>{{ error }}</span>
  </div>

  <div v-else-if="usage" class="flex flex-col gap-6" data-testid="ai-usage-dashboard">
    <h2 v-if="heading" class="text-lg font-semibold">
      {{ heading }}
    </h2>

    <div class="stats stats-vertical sm:stats-horizontal shadow">
      <div class="stat">
        <div class="stat-title">Requests</div>
        <div class="stat-value">
          {{ formatNumber(usage.totals.requests) }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">Input tokens</div>
        <div class="stat-value">
          {{ formatNumber(usage.totals.input_tokens) }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">Output tokens</div>
        <div class="stat-value">
          {{ formatNumber(usage.totals.output_tokens) }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-title">Cost</div>
        <div class="stat-value">
          {{ formatCost(usage.totals.cost) }}
        </div>
      </div>
    </div>

    <section aria-labelledby="ai-usage-by-feature">
      <h3 id="ai-usage-by-feature" class="mb-2 font-medium">By feature</h3>
      <p v-if="usage.by_feature.length === 0" class="text-sm text-base-content/70">
        No feature usage in this range.
      </p>
      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Feature</th>
              <th class="text-right">Requests</th>
              <th class="text-right">Input</th>
              <th class="text-right">Output</th>
              <th class="text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in usage.by_feature" :key="row.feature_key">
              <td>{{ row.feature_key }}</td>
              <td class="text-right">
                {{ formatNumber(row.requests) }}
              </td>
              <td class="text-right">
                {{ formatNumber(row.input_tokens) }}
              </td>
              <td class="text-right">
                {{ formatNumber(row.output_tokens) }}
              </td>
              <td class="text-right">
                {{ formatCost(row.cost) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="ai-usage-daily">
      <h3 id="ai-usage-daily" class="mb-2 font-medium">Daily</h3>
      <p v-if="usage.daily.length === 0" class="text-sm text-base-content/70">
        No daily usage in this range.
      </p>
      <div v-else class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Day</th>
              <th class="text-right">Requests</th>
              <th class="text-right">Tokens</th>
              <th class="text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in usage.daily" :key="row.period">
              <td>{{ row.period }}</td>
              <td class="text-right">
                {{ formatNumber(row.requests) }}
              </td>
              <td class="text-right">
                {{ formatNumber(row.total_tokens) }}
              </td>
              <td class="text-right">
                {{ formatCost(row.cost) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p
      v-if="props.refreshInterval > 0"
      class="text-xs text-base-content/50"
      role="status"
      aria-live="polite"
    >
      Live · refreshing every {{ Math.round(props.refreshInterval / 1000) }}s
    </p>
  </div>
</template>

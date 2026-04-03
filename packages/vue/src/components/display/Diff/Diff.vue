<script setup lang="ts">
/** @module Diff */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { DiffProps } from './types';

const props = withDefaults(defineProps<DiffProps>(), {
  beforeLabel: 'Before',
  afterLabel: 'After',
  mode: 'side-by-side',
  lineNumbers: true,
});

const beforeLines = computed(() => props.before.split('\n'));
const afterLines = computed(() => props.after.split('\n'));

const maxLines = computed(() => Math.max(beforeLines.value.length, afterLines.value.length));

interface DiffLine {
  lineNumber: number;
  before: string;
  after: string;
  status: 'unchanged' | 'added' | 'removed' | 'modified';
}

const diffLines = computed<DiffLine[]>(() => {
  const lines: DiffLine[] = [];
  for (let i = 0; i < maxLines.value; i++) {
    const b = beforeLines.value[i] ?? '';
    const a = afterLines.value[i] ?? '';

    let status: DiffLine['status'] = 'unchanged';
    if (i >= beforeLines.value.length) {
      status = 'added';
    } else if (i >= afterLines.value.length) {
      status = 'removed';
    } else if (b !== a) {
      status = 'modified';
    }

    lines.push({ lineNumber: i + 1, before: b, after: a, status });
  }
  return lines;
});

function statusClasses(status: DiffLine['status'], side: 'before' | 'after') {
  if (status === 'added' && side === 'after') return 'bg-success/20';
  if (status === 'removed' && side === 'before') return 'bg-error/20';
  if (status === 'modified') return side === 'before' ? 'bg-error/10' : 'bg-success/10';
  return '';
}
</script>

<template>
  <div
    :class="cn('overflow-x-auto font-mono text-sm', props.className)"
    role="region"
    aria-label="Diff viewer"
  >
    <!-- Side-by-side mode -->
    <table v-if="mode === 'side-by-side'" class="w-full border-collapse">
      <thead>
        <tr class="text-left">
          <th v-if="lineNumbers" class="px-2 py-1 text-base-content/50 w-8">#</th>
          <th class="px-3 py-1 w-1/2 border-r border-base-300 font-semibold">
            {{ beforeLabel }}
          </th>
          <th v-if="lineNumbers" class="px-2 py-1 text-base-content/50 w-8">#</th>
          <th class="px-3 py-1 w-1/2 font-semibold">
            {{ afterLabel }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="line in diffLines" :key="line.lineNumber" class="border-t border-base-200">
          <td v-if="lineNumbers" class="px-2 py-0.5 text-base-content/30 select-none text-right">
            {{ line.status !== 'added' ? line.lineNumber : '' }}
          </td>
          <td
            :class="
              cn(
                'px-3 py-0.5 whitespace-pre border-r border-base-300',
                statusClasses(line.status, 'before'),
              )
            "
          >
            {{ line.status !== 'added' ? line.before : '' }}
          </td>
          <td v-if="lineNumbers" class="px-2 py-0.5 text-base-content/30 select-none text-right">
            {{ line.status !== 'removed' ? line.lineNumber : '' }}
          </td>
          <td :class="cn('px-3 py-0.5 whitespace-pre', statusClasses(line.status, 'after'))">
            {{ line.status !== 'removed' ? line.after : '' }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Inline mode -->
    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="text-left">
          <th v-if="lineNumbers" class="px-2 py-1 text-base-content/50 w-8">#</th>
          <th class="px-3 py-1 font-semibold">{{ beforeLabel }} → {{ afterLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="line in diffLines" :key="line.lineNumber">
          <tr
            v-if="line.status === 'removed' || line.status === 'modified'"
            class="border-t border-base-200"
          >
            <td v-if="lineNumbers" class="px-2 py-0.5 text-base-content/30 select-none text-right">
              {{ line.lineNumber }}
            </td>
            <td class="px-3 py-0.5 whitespace-pre bg-error/20">- {{ line.before }}</td>
          </tr>
          <tr
            v-if="line.status === 'added' || line.status === 'modified'"
            class="border-t border-base-200"
          >
            <td v-if="lineNumbers" class="px-2 py-0.5 text-base-content/30 select-none text-right">
              {{ line.lineNumber }}
            </td>
            <td class="px-3 py-0.5 whitespace-pre bg-success/20">+ {{ line.after }}</td>
          </tr>
          <tr v-if="line.status === 'unchanged'" class="border-t border-base-200">
            <td v-if="lineNumbers" class="px-2 py-0.5 text-base-content/30 select-none text-right">
              {{ line.lineNumber }}
            </td>
            <td class="px-3 py-0.5 whitespace-pre">
              {{ line.before }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

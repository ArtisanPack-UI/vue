<script setup lang="ts">
/**
 * @module Spotlight
 *
 * A command palette: search across pages, records and actions. Renders the
 * design-system Spotlight markup contract (`.apui-spotlight`, #57) on the
 * shared dialog and combobox machines (`useSpotlight`): ⌘K (Ctrl+K
 * elsewhere) toggles it, the arrow keys move, Enter opens and Escape closes.
 * Replaces SpotlightSearch.
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useSlots } from 'vue';
import { highlightLabel, type SpotlightEntry, useSpotlight } from '@artisanpack-ui/behavior/vue';
import Button from '../../form/Button/Button.vue';
import { DsIcon, part, safeHref } from '../../_shared/design-system';
import type { SpotlightProps, SpotlightResult } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SpotlightProps>(), {
  open: false,
  groups: () => [],
  search: undefined,
  remote: false,
  loading: false,
  shortcut: 'mod+k',
  recent: false,
  label: 'Search',
  placeholder: 'Search…',
  emptyLabel: 'No results.',
  loadingLabel: 'Searching…',
  recentLabel: 'Recent',
  closeLabel: 'Close',
  navigateLabel: 'Navigate',
  selectLabel: 'Open',
  trigger: undefined,
  footer: undefined,
  modal: true,
  portal: true,
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  select: [item: SpotlightResult & { value: string }];
  'search-change': [search: string];
}>();

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

/** Whether the parent passes a prop, which makes that state controlled. */
function isBound(name: 'open' | 'search'): boolean {
  const raw = instance?.vnode.props;
  return !!raw && name in raw;
}

/** The open state when unbound. */
const localOpen = ref(props.open);

const machine = useSpotlight(() => ({
  id: typeof attrs.id === 'string' ? attrs.id : undefined,
  groups: props.groups,
  open: isBound('open') ? props.open : localOpen.value,
  search: isBound('search') ? (props.search ?? '') : undefined,
  remote: props.remote,
  loading: props.loading,
  modal: props.modal,
  label: props.label,
  shortcut: props.shortcut,
  recent: props.recent,
  recentLabel: props.recentLabel,
  translations: { noResults: props.emptyLabel, loading: props.loadingLabel },
  onOpenChange: (open: boolean) => {
    if (!isBound('open')) localOpen.value = open;
    emit('update:open', open);
  },
  onSearchChange: (search: string) => emit('search-change', search),
  onSelect: (item) => emit('select', item),
}));

/**
 * The machine's API, re-wrapped in this package's `computed`: the
 * composable's ref is typed by the design system's copy of Vue, which the
 * template type-check wouldn't unwrap.
 */
const api = computed(() => machine.value);

function filled(value: string | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

/** A part's own class: the matching `classes` entry, when set. */
function classOf(name: keyof NonNullable<SpotlightProps['classes']>): string | undefined {
  return props.classes?.[name];
}

/** Zag's props for a part, plus its extra class and extras. */
function withClass(
  zagProps: unknown,
  className: string | undefined,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return mergeProps(
    zagProps as Record<string, unknown>,
    extra,
    className ? { class: className } : {},
  );
}

/** The panel: the dialog's content part, carrying the root class and every attribute (D-019). */
function contentAttrs(): Record<string, unknown> {
  const { id: _id, ...rest } = attrs;
  return mergeProps(rest, api.value.getContentProps() as Record<string, unknown>, {
    class: ['apui-spotlight', props.classes?.root, props.classes?.content],
  });
}

/** A group's props; without a label it isn't labelled by one. */
function groupAttrs(id: string, label: string | undefined): Record<string, unknown> {
  return withClass(api.value.getItemGroupProps({ id }), classOf('itemGroup'), {
    'aria-labelledby': label
      ? (api.value.getItemGroupProps({ id }) as Record<string, unknown>)['aria-labelledby']
      : undefined,
  });
}

/** An item's props: the machine's option, its link and color. */
function itemAttrs(item: SpotlightEntry): Record<string, unknown> {
  return withClass(api.value.getItemProps({ item }), classOf('item'), {
    // Only relative, http(s), mailto, tel and sms links; anything else renders a plain option.
    href: safeHref(item.href),
    'data-color': item.color,
  });
}

/** An item's display shortcut as keys. */
function itemKeys(shortcut: SpotlightEntry['shortcut']): string[] {
  if (Array.isArray(shortcut)) return shortcut.filter(Boolean);
  return shortcut ? shortcut.split(/\s+|\+(?!$)/).filter(Boolean) : [];
}

const keysAttrs = () =>
  part('spotlight', 'shortcut', classOf('shortcut'), { 'aria-hidden': 'true' });
</script>

<template>
  <Button
    v-if="!!slots.trigger || filled(trigger)"
    variant="outline"
    color="neutral"
    v-bind="
      withClass(api.getTriggerProps(), classOf('trigger'), {
        'aria-keyshortcuts': api.ariaKeyShortcuts,
      })
    "
  >
    <slot name="trigger">{{ trigger }}</slot>
    <span v-if="api.shortcutKeys.length" v-bind="keysAttrs()">
      <kbd v-for="(key, index) in api.shortcutKeys" :key="`${key}-${index}`">{{ key }}</kbd>
    </span>
  </Button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="withClass(api.getBackdropProps(), classOf('backdrop'))" />
    <div v-bind="withClass(api.getPositionerProps(), classOf('positioner'))">
      <div v-bind="contentAttrs()">
        <div v-bind="withClass(api.getSearchProps(), classOf('search'))">
          <span v-bind="part('spotlight', 'icon', classOf('icon'), { 'aria-hidden': 'true' })">
            <DsIcon name="search" />
          </span>
          <input
            v-bind="
              withClass(api.getQueryProps(), classOf('query'), {
                'aria-label': label,
                placeholder,
                'aria-keyshortcuts': api.ariaKeyShortcuts,
              })
            "
          />
          <button
            type="button"
            v-bind="
              withClass(api.getCloseTriggerProps(), classOf('closeTrigger'), {
                'aria-label': `Esc, ${closeLabel}`,
                'aria-keyshortcuts': 'Escape',
              })
            "
          >
            Esc
          </button>
        </div>
        <div v-bind="withClass(api.getResultsProps(), classOf('results'), { 'aria-label': label })">
          <div
            v-for="group in api.groups"
            :key="group.id"
            v-bind="groupAttrs(group.id, group.label)"
          >
            <div
              v-if="group.label"
              v-bind="
                withClass(
                  api.getItemGroupLabelProps({ htmlFor: group.id }),
                  classOf('itemGroupLabel'),
                )
              "
            >
              {{ group.label }}
            </div>
            <component
              :is="safeHref(item.href) ? 'a' : 'div'"
              v-for="item in group.items"
              :key="item.value"
              v-bind="itemAttrs(item)"
            >
              <span
                v-if="item.icon"
                v-bind="part('spotlight', 'tile', classOf('tile'), { 'aria-hidden': 'true' })"
              >
                <DsIcon :name="item.icon" />
              </span>
              <span v-bind="withClass(api.getItemTextProps({ item }), classOf('itemText'))"
                ><template
                  v-for="(segment, index) in highlightLabel(item.label, api.query)"
                  :key="index"
                  ><mark v-if="segment.match">{{ segment.text }}</mark
                  ><template v-else>{{ segment.text }}</template></template
                ><span
                  v-if="item.description"
                  v-bind="part('spotlight', 'item-description', classOf('itemDescription'))"
                  >{{ item.description }}</span
                ></span
              >
              <span v-if="itemKeys(item.shortcut).length" v-bind="keysAttrs()">
                <kbd v-for="(key, index) in itemKeys(item.shortcut)" :key="`${key}-${index}`">{{
                  key
                }}</kbd>
              </span>
              <span
                v-bind="
                  part('spotlight', 'item-indicator', classOf('itemIndicator'), {
                    'aria-hidden': 'true',
                  })
                "
              >
                <DsIcon name="corner-down-left" />
              </span>
            </component>
          </div>
          <div v-bind="withClass(api.getEmptyProps(), classOf('empty'))">
            <slot name="empty">{{ emptyLabel }}</slot>
          </div>
          <div v-bind="withClass(api.getLoadingProps(), classOf('loading'))">
            {{ loadingLabel }}
          </div>
        </div>
        <div v-bind="part('spotlight', 'footer', classOf('footer'))">
          <slot name="footer">
            <template v-if="filled(footer)">{{ footer }}</template>
            <template v-else>
              <span
                ><span v-bind="keysAttrs()"><kbd>↑</kbd><kbd>↓</kbd></span
                >{{ navigateLabel }}</span
              >
              <span
                ><span v-bind="keysAttrs()"><kbd>↵</kbd></span
                >{{ selectLabel }}</span
              >
            </template>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

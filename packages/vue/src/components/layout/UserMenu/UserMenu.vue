<script setup lang="ts">
/**
 * @module UserMenu
 *
 * The account menu: identity, workspace switcher, theme, your items and Log
 * out, last. Composed from Avatar and DropdownMenu on the same menu machine
 * (`useDropdownMenu`): the panel is `.apui-dropdown-menu.apui-user-menu`, the
 * trigger, header and theme control are scoped `user-menu`, and the items
 * keep the dropdown-menu scope (#58, D-019).
 */
import { computed, getCurrentInstance, mergeProps, provide, ref, useAttrs } from 'vue';
import { useDropdownMenu } from '@artisanpack-ui/behavior/vue';
import { DsIcon, part } from '../../_shared/design-system';
import Avatar from '../../display/Avatar/Avatar.vue';
import { avatarColor, avatarInitials } from '../../display/Avatar/identity';
import DropdownMenuEntries from '../DropdownMenu/DropdownMenuEntries';
import DropdownMenuGroup from '../DropdownMenu/DropdownMenuGroup.vue';
import DropdownMenuItem from '../DropdownMenu/DropdownMenuItem.vue';
import DropdownMenuSeparator from '../DropdownMenu/DropdownMenuSeparator.vue';
import { DROPDOWN_MENU_KEY, type DropdownMenuItemRegistration } from '../DropdownMenu/keys';
import type { DropdownMenuPart } from '../DropdownMenu/types';
import type { UserMenuPart, UserMenuProps, UserMenuTheme } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<UserMenuProps>(), {
  workspaces: () => [],
  workspace: undefined,
  hideTheme: false,
  theme: 'system',
  items: undefined,
  compact: false,
  open: false,
  align: 'start',
  surface: 'overlay',
  portal: true,
  workspaceLabel: 'Workspace',
  themeLabel: 'Theme',
  themeLabels: () => ({}),
  logoutLabel: 'Log out',
  classes: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  select: [value: string];
  'workspace-change': [id: string];
  'theme-change': [theme: UserMenuTheme];
}>();

const THEME_ICONS: Record<UserMenuTheme, string> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};
const THEMES = Object.keys(THEME_ICONS) as UserMenuTheme[];

const attrs = useAttrs();
const instance = getCurrentInstance();

/** Whether the parent passes `open`; then the menu shows only what the prop says. */
function isBound(): boolean {
  const raw = instance?.vnode.props;
  return !!raw && 'open' in raw;
}

const localOpen = ref(props.open);
const shownOpen = () => (isBound() ? props.open : localOpen.value);
const registry = new Map<string, DropdownMenuItemRegistration>();

const machine = useDropdownMenu(() => ({
  open: shownOpen(),
  align: props.align,
  onOpenChange: ({ open }) => {
    if (!isBound()) localOpen.value = open;
    emit('update:open', open);
  },
  onSelect: ({ value }) => {
    const item = registry.get(value);
    if (item && item.type !== 'item') return;
    item?.onSelect();
    emit('select', value);
  },
}));
const menu = computed(() => machine.value);

const classOf = (name: UserMenuPart): string | undefined => props.classes?.[name];

provide(DROPDOWN_MENU_KEY, {
  api: () => menu.value,
  classOf: (name: DropdownMenuPart) => classOf(name),
  register(value, registration) {
    registry.set(value, registration);
    return () => {
      if (registry.get(value) === registration) registry.delete(value);
    };
  },
  checkedChange(value) {
    if (value.startsWith('workspace:')) emit('workspace-change', value.slice('workspace:'.length));
    else if (value.startsWith('theme:'))
      emit('theme-change', value.slice('theme:'.length) as UserMenuTheme);
  },
});

const name = computed(() => (props.user?.name ?? '').trim());
const avatar = computed(() => ({
  initials: avatarInitials(name.value),
  color: avatarColor(name.value),
  src: props.user?.avatar || undefined,
  status: props.user?.status,
  class: classOf('avatar'),
  'data-scope': 'user-menu',
  'data-part': 'avatar',
}));
const workspaceOptions = computed(() =>
  props.workspaces.filter((option) => option && option.id !== undefined),
);
const checkedTheme = computed<UserMenuTheme>(() =>
  props.theme in THEME_ICONS ? props.theme : 'system',
);
const themeName = (option: UserMenuTheme) =>
  props.themeLabels?.[option] ?? { light: 'Light', dark: 'Dark', system: 'System' }[option];

/** The trigger: Zag's trigger props, scoped user-menu. */
function triggerAttrs(): Record<string, unknown> {
  return mergeProps(menu.value.getTriggerProps() as Record<string, unknown>, {
    type: 'button',
    class: classOf('trigger'),
    'data-scope': 'user-menu',
    'data-part': 'trigger',
    'data-avatar-only': props.compact ? '' : undefined,
    'aria-label': props.compact ? name.value : undefined,
  });
}

/** The panel: Zag's content part, carrying both root classes and every attribute. */
function contentAttrs(): Record<string, unknown> {
  return mergeProps(attrs, menu.value.getContentProps() as Record<string, unknown>, {
    class: ['apui-dropdown-menu', 'apui-user-menu', props.classes?.root],
    'data-align': props.align,
    'data-surface': props.surface,
  });
}

function positionerAttrs(): Record<string, unknown> {
  const own = menu.value.getPositionerProps() as Record<string, unknown>;
  const className = classOf('positioner');
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <button v-bind="triggerAttrs()">
    <slot name="trigger"
      ><Avatar v-bind="avatar" size="sm" /><template v-if="!compact"
        ><span v-bind="part('user-menu', 'identity', classOf('identity'))"
          ><span v-bind="part('user-menu', 'name', classOf('name'))">{{ name }}</span
          ><span v-if="user?.role" v-bind="part('user-menu', 'role', classOf('role'))">{{
            user.role
          }}</span></span
        ><span
          v-bind="part('user-menu', 'indicator', classOf('indicator'), { 'aria-hidden': 'true' })"
          ><DsIcon name="chevrons-up-down" /></span></template
    ></slot>
  </button>
  <Teleport to="body" :disabled="!portal">
    <div v-bind="positionerAttrs()">
      <div v-bind="contentAttrs()">
        <div v-bind="part('user-menu', 'header', classOf('header'))">
          <Avatar v-bind="avatar" /><span
            v-bind="part('user-menu', 'identity', classOf('identity'))"
            ><span v-bind="part('user-menu', 'name', classOf('name'))">{{ name }}</span
            ><span v-if="user?.email" v-bind="part('user-menu', 'email', classOf('email'))">{{
              user.email
            }}</span></span
          >
        </div>
        <DropdownMenuSeparator />
        <template v-if="workspaceOptions.length > 1">
          <DropdownMenuGroup :label="workspaceLabel">
            <DropdownMenuItem
              v-for="option in workspaceOptions"
              :key="option.id"
              type="radio"
              :value="`workspace:${option.id}`"
              :checked="option.id === workspace"
              >{{ option.name }}</DropdownMenuItem
            >
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </template>
        <DropdownMenuEntries v-if="items" :entries="items" />
        <slot />
        <div v-if="!hideTheme" v-bind="part('user-menu', 'theme', classOf('theme'))">
          <DropdownMenuGroup :label="themeLabel">
            <div v-bind="part('user-menu', 'theme-options', classOf('themeOptions'))">
              <DropdownMenuItem
                v-for="option in THEMES"
                :key="option"
                type="radio"
                :value="`theme:${option}`"
                :icon="THEME_ICONS[option]"
                :checked="option === checkedTheme"
                >{{ themeName(option) }}</DropdownMenuItem
              >
            </div>
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem value="logout" icon="log-out">{{ logoutLabel }}</DropdownMenuItem>
      </div>
    </div>
  </Teleport>
</template>

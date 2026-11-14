/**
 * @module layout
 *
 * Layout components for the ArtisanPack UI Vue component library.
 * Provides structural containers, grid systems, overlays, and interactive
 * layout primitives on the ArtisanPack UI design system, styled by
 * `@artisanpack-ui/css`.
 *
 * @example
 * ```vue
 * import { Card, Dialog, DropdownMenu, Tabs, Grid, Stack } from '@artisanpack-ui/vue/layout';
 * ```
 */

// Layout components
export { default as Accordion } from './Accordion/Accordion.vue';
export { default as AccordionItem } from './Accordion/AccordionItem.vue';
export type {
  AccordionItemData,
  AccordionItemProps,
  AccordionPart,
  AccordionProps,
  AccordionVariant,
} from './Accordion/types';

export { default as AppShell } from './AppShell/AppShell.vue';
export type { AppShellPart, AppShellProps } from './AppShell/types';

export { default as Card } from './Card/Card.vue';
export type { CardPart, CardProps, CardSurface } from './Card/types';

export { default as Collapse } from './Collapse/Collapse.vue';
export type { CollapsePart, CollapseProps, CollapseVariant } from './Collapse/types';

export { default as Dialog } from './Dialog/Dialog.vue';
export type {
  DialogColor,
  DialogEmits,
  DialogPart,
  DialogProps,
  DialogRole,
  DialogSize,
  DialogSurface,
} from './Dialog/types';

export { default as Divider } from './Divider/Divider.vue';
export type {
  DividerAlign,
  DividerOrientation,
  DividerPart,
  DividerProps,
  DividerStrength,
} from './Divider/types';

export { default as Drawer } from './Drawer/Drawer.vue';
export type {
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerSurface,
  DrawerPart,
} from './Drawer/types';

// Deprecated: replaced by DropdownMenu (#50).
export { default as Dropdown } from './Dropdown/Dropdown.vue';
export type { DropdownProps, DropdownItemProps } from './Dropdown/types';

export { default as DropdownItem } from './Dropdown/DropdownItem.vue';

export { default as DropdownMenu } from './DropdownMenu/DropdownMenu.vue';
export { default as DropdownMenuGroup } from './DropdownMenu/DropdownMenuGroup.vue';
export { default as DropdownMenuItem } from './DropdownMenu/DropdownMenuItem.vue';
export { default as DropdownMenuSeparator } from './DropdownMenu/DropdownMenuSeparator.vue';
export type {
  DropdownMenuActionEntry,
  DropdownMenuAlign,
  DropdownMenuCheckedChange,
  DropdownMenuEntry,
  DropdownMenuGroupEntry,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuItemType,
  DropdownMenuOptionEntry,
  DropdownMenuPart,
  DropdownMenuProps,
  DropdownMenuSeparatorEntry,
  DropdownMenuSurface,
} from './DropdownMenu/types';

export { default as Grid } from './Grid/Grid.vue';
export type { GridAlign, GridGap, GridJustify, GridProps } from './Grid/types';

// Deprecated: replaced by Dialog (#49).
export { default as Modal } from './Modal/Modal.vue';
export type { ModalProps } from './Modal/types';

export { default as Popover } from './Popover/Popover.vue';
export type { PopoverProps, PopoverPlacement, PopoverPart } from './Popover/types';

export { default as Stack } from './Stack/Stack.vue';
export type {
  StackAlign,
  StackGap,
  StackJustify,
  StackOrientation,
  StackProps,
} from './Stack/types';

export { default as PageHeader } from './PageHeader/PageHeader.vue';
export type { PageHeaderPart, PageHeaderProps } from './PageHeader/types';

export { default as Tabs } from './Tabs/Tabs.vue';
export { default as Tab } from './Tabs/Tab.vue';
export type {
  TabsProps,
  TabProps,
  TabData,
  TabItem,
  TabsVariant,
  TabsSize,
  TabsOrientation,
  TabsActivationMode,
  TabsPart,
} from './Tabs/types';

export { default as Heading } from './Heading/Heading.vue';
export type { HeadingProps, HeadingStep, HeadingPart } from './Heading/types';

export { default as List } from './ListItem/List.vue';
export { default as ListItem } from './ListItem/ListItem.vue';
export type { ListProps, ListItemProps, ListVariant, ListItemPart } from './ListItem/types';

export { default as Text } from './Text/Text.vue';
export type { TextProps, TextElement, TextSize, TextTone, TextWeight } from './Text/types';

export { default as UserMenu } from './UserMenu/UserMenu.vue';
export type {
  UserMenuProps,
  UserMenuUser,
  UserMenuWorkspace,
  UserMenuTheme,
  UserMenuPart,
} from './UserMenu/types';

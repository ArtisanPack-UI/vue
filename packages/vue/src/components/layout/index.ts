/**
 * @module layout
 *
 * Layout components for the ArtisanPack UI Vue component library.
 * Provides structural containers, grid systems, overlays, and interactive
 * layout primitives built on DaisyUI with consistent styling and accessibility.
 *
 * @example
 * ```vue
 * import { Card, Modal, Tabs, Grid, Stack } from '@artisanpack-ui/vue/layout';
 * ```
 */

// Layout components
export { default as Accordion } from './Accordion/Accordion.vue';
export type { AccordionProps } from './Accordion/types';
export { ACCORDION_KEY } from './Accordion/keys';
export type { AccordionContext } from './Accordion/keys';

export { default as Card } from './Card/Card.vue';
export type { CardProps } from './Card/types';

export { default as Collapse } from './Collapse/Collapse.vue';
export type { CollapseProps } from './Collapse/types';

export { default as Divider } from './Divider/Divider.vue';
export type { DividerProps } from './Divider/types';

export { default as Drawer } from './Drawer/Drawer.vue';
export type { DrawerProps } from './Drawer/types';

export { default as Dropdown } from './Dropdown/Dropdown.vue';
export type { DropdownProps, DropdownItemProps } from './Dropdown/types';

export { default as DropdownItem } from './Dropdown/DropdownItem.vue';

export { default as Grid } from './Grid/Grid.vue';
export type { GridProps, ColCount, GapSize } from './Grid/types';

export { default as Modal } from './Modal/Modal.vue';
export type { ModalProps } from './Modal/types';

export { default as Popover } from './Popover/Popover.vue';
export type { PopoverProps } from './Popover/types';

export { default as Stack } from './Stack/Stack.vue';
export type { StackProps } from './Stack/types';

export { default as Tabs } from './Tabs/Tabs.vue';
export type { TabsProps, TabItem } from './Tabs/types';

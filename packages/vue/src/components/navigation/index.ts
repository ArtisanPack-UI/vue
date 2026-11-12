/**
 * @module navigation
 *
 * Navigation components for the ArtisanPack UI Vue component library.
 * Provides menus, breadcrumbs, pagination, step indicators, navbars,
 * sidebars, and command palette search built on DaisyUI with consistent
 * styling and accessibility.
 *
 * @example
 * ```vue
 * import { Menu, Breadcrumbs, Pagination, Navbar } from '@artisanpack-ui/vue/navigation';
 * ```
 */

// Navigation components
export { default as Menu } from './Menu/Menu.vue';
export { MenuItem } from './Menu/menu-item';
export { default as MenuSub } from './Menu/MenuSub.vue';
export { default as MenuTitle } from './Menu/MenuTitle.vue';
export { default as MenuSeparator } from './Menu/MenuSeparator.vue';
export { MENU_LINK_KEY } from './Menu/keys';
export type {
  MenuProps,
  MenuItemProps,
  MenuSubProps,
  MenuItemData,
  MenuLinkData,
  MenuSubData,
  MenuTitleData,
  MenuSeparatorData,
  MenuPart,
} from './Menu/types';

export { default as Breadcrumbs } from './Breadcrumbs/Breadcrumbs.vue';
export { default as BreadcrumbsItem } from './Breadcrumbs/BreadcrumbsItem.vue';
export type {
  BreadcrumbsProps,
  BreadcrumbsItemProps,
  BreadcrumbItem,
  BreadcrumbsPart,
} from './Breadcrumbs/types';

export { default as Link } from './Link/Link.vue';
export type { LinkProps, LinkTone, LinkPart } from './Link/types';

export { default as Pagination } from './Pagination/Pagination.vue';
export { paginationRange } from './Pagination/range';
export type { PaginationProps, PaginationPart } from './Pagination/types';

export { default as Steps } from './Steps/Steps.vue';
export { default as Step } from './Steps/Step.vue';
export type {
  StepsProps,
  StepProps,
  StepItem,
  StepState,
  StepsOrientation,
  StepsPart,
} from './Steps/types';

export { default as Navbar } from './Navbar/Navbar.vue';
export { default as NavbarItem } from './Navbar/NavbarItem.vue';
export type {
  NavbarProps,
  NavbarItemProps,
  NavbarLinkData,
  NavbarLayout,
  NavbarSurface,
  NavbarPart,
} from './Navbar/types';

// Deprecated: replaced by AppShell (#58).
export { default as Sidebar } from './Sidebar/Sidebar.vue';
export type { SidebarProps } from './Sidebar/types';

export { default as Spotlight } from './Spotlight/Spotlight.vue';
export type {
  SpotlightProps,
  SpotlightPart,
  SpotlightGroup,
  SpotlightResult,
} from './Spotlight/types';

// SpotlightItem stays the deprecated component's item; Spotlight's is SpotlightResult.
/** @deprecated Use `Spotlight` (#57). `SpotlightSearch` is removed in a later major release. */
export { default as SpotlightSearch } from './SpotlightSearch/SpotlightSearch.vue';
export type { SpotlightSearchProps, SpotlightItem } from './SpotlightSearch/types';

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
export type { MenuProps, MenuItem } from './Menu/types';

export { default as Breadcrumbs } from './Breadcrumbs/Breadcrumbs.vue';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs/types';

export { default as Pagination } from './Pagination/Pagination.vue';
export type { PaginationProps } from './Pagination/types';

export { default as Steps } from './Steps/Steps.vue';
export type { StepsProps, StepItem } from './Steps/types';

export { default as Navbar } from './Navbar/Navbar.vue';
export type { NavbarProps } from './Navbar/types';

export { default as Sidebar } from './Sidebar/Sidebar.vue';
export type { SidebarProps } from './Sidebar/types';

export { default as SpotlightSearch } from './SpotlightSearch/SpotlightSearch.vue';
export type { SpotlightSearchProps, SpotlightItem } from './SpotlightSearch/types';

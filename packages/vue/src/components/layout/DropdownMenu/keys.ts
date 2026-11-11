import type { InjectionKey } from 'vue';
import type { DropdownMenuApi } from '@artisanpack-ui/behavior/vue';
import type { DropdownMenuItemType, DropdownMenuPart } from './types';

/** What an item registers with its menu, so the menu can route Zag's callbacks to it. */
export interface DropdownMenuItemRegistration {
  type: DropdownMenuItemType;
  /** Called when the menu reports this action item chosen. */
  onSelect: () => void;
}

/**
 * The context a DropdownMenu provides to its items, groups and separators.
 *
 * @internal
 */
export interface DropdownMenuContext {
  /** The menu machine's current API. */
  api: () => DropdownMenuApi;
  /** The menu's `classes`, for the parts its children render. */
  classOf: (name: DropdownMenuPart) => string | undefined;
  /** Registers an item by value. Returns the function that unregisters it. */
  register: (value: string, registration: DropdownMenuItemRegistration) => () => void;
  /** Reports a checkbox or radio item's new checked state to the menu. */
  checkedChange: (value: string, checked: boolean) => void;
}

/** @internal */
export const DROPDOWN_MENU_KEY: InjectionKey<DropdownMenuContext> = Symbol('apui-dropdown-menu');

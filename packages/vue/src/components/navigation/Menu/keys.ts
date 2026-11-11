import type { Component, InjectionKey } from 'vue';
import type { MenuPart } from './types';

/**
 * The context a Menu provides to its children.
 *
 * @internal
 */
export interface MenuContext {
  collapsible: () => boolean;
  classOf: (name: MenuPart) => string | undefined;
}

/** @internal */
export const MENU_KEY: InjectionKey<MenuContext> = Symbol('apui-menu');

/**
 * A router's link component (Inertia's `Link`, Vue Router's `RouterLink`)
 * for the Menu items below it. An enabled item with an `href` renders it in
 * place of the `<a>`, with the same attributes and parts. Provide it with
 * `provide(MENU_LINK_KEY, Link)` in a wrapper component.
 */
export const MENU_LINK_KEY: InjectionKey<Component> = Symbol('apui-menu-link');

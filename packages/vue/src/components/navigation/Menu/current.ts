/**
 * Finds the current page among a sub-menu's vnodes, so a sub-menu holding
 * it renders open.
 *
 * @internal
 */
import { Fragment, type VNode } from 'vue';
import MenuItem from './MenuItem.vue';

/** Whether vnodes hold a `MenuItem` marked current, at any depth. */
export function holdsCurrent(nodes: unknown): boolean {
  if (!Array.isArray(nodes)) return false;
  return nodes.some((node: VNode) => {
    if (!node || typeof node !== 'object') return false;
    const props = (node.props ?? {}) as Record<string, unknown>;
    if (node.type === MenuItem && (props.current === '' || props.current === true)) return true;
    if (node.type === Fragment) return holdsCurrent(node.children);
    const children = node.children as { default?: () => unknown } | null;
    if (children && typeof children === 'object' && typeof children.default === 'function') {
      return holdsCurrent(children.default());
    }
    return false;
  });
}

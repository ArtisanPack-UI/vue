/**
 * Tooltip and Popover take the author's own control as their trigger
 * (D-019): the trigger part's props go on the slot's element, cloned, rather
 * than on a wrapper. The element keeps its own id (Zag then finds the trigger
 * through its `data-ownedby` fallback), its handlers run alongside the
 * machine's, its classes are kept, and `aria-describedby` ids are joined.
 */
import { cloneVNode, Comment, Fragment, Text, type VNode } from 'vue';

/** The slot's only element, or `undefined` for text, several elements or nothing. */
export function triggerElement(nodes: VNode[] | undefined): VNode | undefined {
  const found: VNode[] = [];
  const visit = (list: unknown[]) => {
    for (const node of list) {
      if (Array.isArray(node)) {
        visit(node);
        continue;
      }
      const vnode = node as VNode;
      if (!vnode || vnode.type === Comment) continue;
      if (vnode.type === Fragment) {
        visit((vnode.children as unknown[]) ?? []);
        continue;
      }
      if (vnode.type === Text) {
        if (String(vnode.children ?? '').trim() !== '') found.push(vnode);
        continue;
      }
      found.push(vnode);
    }
  };
  visit(nodes ?? []);
  const [first] = found;
  return found.length === 1 && first && first.type !== Text ? first : undefined;
}

/** `vnode` with the trigger part's `props` merged in. */
export function cloneTrigger(vnode: VNode, props: Record<string, unknown>): VNode {
  const own = (vnode.props ?? {}) as Record<string, unknown>;
  const extra: Record<string, unknown> = { ...props };
  if (typeof own.id === 'string' && own.id !== '') extra.id = own.id;
  const described = [own['aria-describedby'], props['aria-describedby']].filter(
    (value) => typeof value === 'string' && value !== '',
  );
  extra['aria-describedby'] = described.length ? described.join(' ') : undefined;
  return cloneVNode(vnode, extra, true);
}

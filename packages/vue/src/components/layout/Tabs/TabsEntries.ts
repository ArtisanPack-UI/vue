/**
 * Collects a Tabs' tabs: the `tabs` data as `Tab` vnodes, then the `Tab`
 * children of the default slot (fragments and `v-for` flattened), with the
 * props each trigger needs.
 *
 * @internal
 */
import { Comment, Fragment, h, type VNode } from 'vue';
import Tab from './Tab.vue';
import type { TabData } from './types';

/** A tab as Tabs renders it: the trigger's props and the vnode that renders the panel. */
export interface CollectedTab {
  value: string;
  label?: string;
  icon?: string;
  count?: string | number;
  disabled: boolean;
  node: VNode;
}

/** Boolean props as a template passes them: a bare `disabled` is `''`. */
const truthy = (value: unknown) => value === '' || value === true || value === 'true';

function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment) return [];
    if (node.type === Fragment && Array.isArray(node.children)) {
      return flatten(node.children as VNode[]);
    }
    return [node];
  });
}

export function collectTabs(data: TabData[] | undefined, slot: VNode[]): CollectedTab[] {
  const fromData: CollectedTab[] = (data ?? []).map(({ content, ...tab }) => ({
    ...tab,
    disabled: Boolean(tab.disabled),
    node: h(Tab, { key: `tab-${tab.value}`, ...tab }, () => content ?? ''),
  }));
  const fromSlot = flatten(slot)
    .filter((node) => node.type === Tab)
    .map((node) => {
      const props = (node.props ?? {}) as Record<string, unknown>;
      return {
        value: String(props.value ?? ''),
        label: props.label === undefined ? undefined : String(props.label),
        icon: props.icon === undefined ? undefined : String(props.icon),
        count: props.count as string | number | undefined,
        disabled: truthy(props.disabled),
        node,
      };
    });
  return [...fromData, ...fromSlot];
}

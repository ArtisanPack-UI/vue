/**
 * Renders a Steps' data and Step children, numbering each Step by its
 * position (a `step` set on a child wins).
 *
 * @internal
 */
import {
  cloneVNode,
  defineComponent,
  Fragment,
  h,
  isVNode,
  type PropType,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import Step from './Step.vue';
import type { StepItem } from './types';

function flatten(children: VNodeArrayChildren): VNode[] {
  return children.flatMap((child) => {
    if (!isVNode(child)) return Array.isArray(child) ? flatten(child) : [];
    if (child.type === Fragment) return flatten((child.children as VNodeArrayChildren) ?? []);
    return [child];
  });
}

export default defineComponent({
  name: 'StepsChildren',
  props: {
    steps: { type: Array as PropType<StepItem[]>, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      const data = (props.steps ?? []).map((step, index) =>
        h(Step, { key: `apui-step-${index}`, ...step, step: index + 1 }),
      );
      let number = data.length;
      const composed = flatten(slots.default?.() ?? []).map((vnode) => {
        if (vnode.type !== Step) return vnode;
        number += 1;
        return vnode.props?.step !== undefined ? vnode : cloneVNode(vnode, { step: number });
      });
      return [...data, ...composed];
    };
  },
});

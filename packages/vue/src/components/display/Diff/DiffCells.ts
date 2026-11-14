/**
 * One side of a Diff line: its line number, sign and code cells, with
 * changed words in `ins` or `del`. A render function, so the code cell holds
 * exactly the line's text: `white-space: pre-wrap` shows any template
 * whitespace.
 *
 * @internal
 */
import type { DiffSegment } from '@artisanpack-ui/behavior';
import { defineComponent, h, type PropType } from 'vue';
import { part } from '../../_shared/design-system';
import { DIFF_SIGNS, type DiffPart } from './types';

export default defineComponent({
  name: 'DiffCells',
  props: {
    number: { type: Number as PropType<number | null>, default: null },
    type: { type: String, required: true },
    segments: { type: Array as PropType<DiffSegment[]>, required: true },
    classes: { type: Object as PropType<Partial<Record<DiffPart, string>>>, default: undefined },
  },
  setup(props) {
    return () => {
      const extra = { 'data-type': props.type };
      const tag = props.type === 'del' ? 'del' : 'ins';
      const code = props.segments.map((segment) =>
        segment.changed && (props.type === 'add' || props.type === 'del')
          ? h(tag, part('diff', tag, props.classes?.[tag]), segment.text)
          : segment.text,
      );
      return [
        h('td', part('diff', 'lineNumber', props.classes?.lineNumber, extra), props.number ?? ''),
        h('td', part('diff', 'sign', props.classes?.sign, extra), DIFF_SIGNS[props.type] ?? ''),
        h('td', part('diff', 'code', props.classes?.code, extra), code),
      ];
    };
  },
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import Diff from '../../components/display/Diff/Diff.vue';

const OLD =
  '{\n  price: 220000,\n  rent: 1600,\n  currency: "USD",\n  available: "2027-01-01",\n}\n';
const NEW =
  '{\n  price: 220000,\n  rent: 1650,\n  deposit: 3300,\n  currency: "USD",\n  available: "2027-01-15",\n}\n';

describe('Diff', () => {
  it('renders the header with hidden counts in words', () => {
    const { container } = render(Diff, {
      props: { oldContent: OLD, newContent: NEW, fileName: 'listings/grove.json' },
    });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-diff');
    expect(root.getAttribute('data-view')).toBe('unified');
    expect(
      root.querySelector('[data-part="header"] > [data-part="icon"][aria-hidden="true"] > svg'),
    ).not.toBeNull();
    expect(root.querySelector('[data-part="file"]')!.textContent).toBe('listings/grove.json');
    const counts = root.querySelector('[data-part="counts"]')!;
    expect(counts.querySelector('.apui-sr-only')!.textContent).toBe('3 additions, 2 deletions');
    expect(counts.querySelector('[data-type="add"][aria-hidden="true"]')!.textContent).toBe('+3');
    expect(counts.querySelector('[data-type="del"][aria-hidden="true"]')!.textContent).toBe('−2');
  });

  it('renders unified rows with both line numbers, a sign and word marks', () => {
    const { container } = render(Diff, { props: { oldContent: OLD, newContent: NEW } });
    const rows = container.querySelectorAll('table[data-part="table"] > tbody > tr');
    expect(rows[0]!.getAttribute('data-part')).toBe('hunk');
    expect(rows[0]!.textContent).toBe('@@ -1,6 +1,7 @@');
    expect(rows[0]!.querySelector('td')!.getAttribute('colspan')).toBe('4');
    const cells = container
      .querySelectorAll('tr[data-part="line"][data-type="del"]')[0]!
      .querySelectorAll('td');
    expect([...cells].map((cell) => cell.textContent)).toEqual(['3', '', '−', '  rent: 1600,']);
    expect(cells[3]!.getAttribute('data-type')).toBe('del');
    expect(cells[3]!.querySelector('del[data-part="del"]')!.textContent).toBe('1600');
    expect(container.querySelector('ins[data-part="ins"]')!.textContent).toBe('1650');
  });

  it('pairs the old side with the new in split view', () => {
    const { container } = render(Diff, {
      props: { oldContent: OLD, newContent: NEW, view: 'split' },
    });
    expect(container.firstElementChild!.getAttribute('data-view')).toBe('split');
    expect(container.querySelector('tr[data-part="hunk"] > td')!.getAttribute('colspan')).toBe('6');
    const row = container.querySelectorAll('tr[data-part="line"]')[3]!;
    expect(
      [...row.querySelectorAll('td')].map(
        (cell) => `${cell.getAttribute('data-part')}:${cell.getAttribute('data-type')}`,
      ),
    ).toEqual([
      'lineNumber:empty',
      'sign:empty',
      'code:empty',
      'lineNumber:add',
      'sign:add',
      'code:add',
    ]);
  });

  it('wordLevel, context, the empty label and the actions slot', () => {
    expect(
      render(Diff, {
        props: { oldContent: OLD, newContent: NEW, wordLevel: false },
      }).container.querySelectorAll('ins, del'),
    ).toHaveLength(0);
    expect(
      render(Diff, {
        props: { oldContent: OLD, newContent: NEW, context: 0 },
      }).container.querySelectorAll('tr[data-part="hunk"]'),
    ).toHaveLength(2);
    const same = render(Diff, {
      props: { oldContent: 'a', newContent: 'a', emptyLabel: 'Sin cambios' },
    }).container;
    expect(same.querySelector('tr[data-part="hunk"]')!.textContent).toBe('Sin cambios');
    const withActions = render(Diff, {
      props: { oldContent: 'a', newContent: 'b' },
      slots: { actions: () => h('button', { type: 'button' }, 'Copy') },
    }).container;
    expect(
      withActions.querySelector('[data-part="header"] > [data-part="actions"] > button'),
    ).not.toBeNull();
  });
});

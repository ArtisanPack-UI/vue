import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';
import { Step, Steps } from '../../components/navigation';

const states = (container: Element) =>
  [...container.querySelectorAll('li[data-part="step"]')].map((li) =>
    li.getAttribute('data-state'),
  );

describe('Steps', () => {
  it('composes an ordered list from Step children', () => {
    const { container } = render(Steps, {
      props: { modelValue: 2, label: 'Listing progress' },
      slots: {
        default: () => [
          h(Step, { title: 'Basics', description: 'Title and type' }),
          h(Step, { title: 'Location' }),
          h(Step, { title: 'Pricing' }),
        ],
      },
    });
    const list = screen.getByRole('list', { name: 'Listing progress' });
    expect(list.className).toBe('apui-steps');
    expect(list.getAttribute('data-orientation')).toBe('horizontal');
    expect(states(container)).toEqual(['complete', 'current', 'upcoming']);
    expect(container.querySelector('[aria-current="step"]')!.textContent).toContain('Location');
    expect(
      [...container.querySelector('li')!.children].map((el) => el.getAttribute('data-part')),
    ).toEqual(['marker', 'title', 'connector', 'description']);
  });

  it('numbers children rendered with v-for', () => {
    const Host = defineComponent({
      components: { Steps, Step },
      setup: () => ({ titles: ['A', 'B', 'C'] }),
      template: `<Steps :model-value="3"><Step v-for="title in titles" :key="title" :title="title" /></Steps>`,
    });
    const { container } = render(Host);
    expect(states(container)).toEqual(['complete', 'complete', 'current']);
  });

  it('marks complete and error steps with icons and hidden text', () => {
    const { container } = render(Steps, {
      props: { modelValue: 3 },
      slots: {
        default: () => [
          h(Step, { title: 'A' }),
          h(Step, { title: 'B', state: 'error' }),
          h(Step, { title: 'C' }),
          h(Step, { title: 'D' }),
        ],
      },
    });
    const markers = container.querySelectorAll('[data-part="marker"]');
    expect(states(container)).toEqual(['complete', 'error', 'current', 'upcoming']);
    expect(markers[0]!.querySelector('svg')).not.toBeNull();
    expect(markers[0]!.textContent).toBe('Completed');
    expect(markers[1]!.textContent).toBe('Error');
    expect(markers[2]!.textContent).toBe('3');
    expect(container.querySelectorAll('[data-part="connector"][aria-hidden="true"]')).toHaveLength(
      4,
    );
  });

  it('renders steps data as the same children', () => {
    const { container } = render(Steps, {
      props: {
        modelValue: 2,
        orientation: 'vertical',
        steps: [{ title: 'Cart', description: 'Two items' }, { title: 'Shipping' }],
      },
    });
    expect(container.querySelector('ol')!.getAttribute('data-orientation')).toBe('vertical');
    expect(states(container)).toEqual(['complete', 'current']);
    expect(container.querySelector('[data-part="description"]')!.textContent).toBe('Two items');
  });

  it('binds v-model and turns completed steps into buttons when clickable', async () => {
    const Host = defineComponent({
      components: { Steps },
      setup: () => ({ step: ref(3) }),
      template: `<Steps v-model="step" clickable :steps="[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }]" />`,
    });
    const { container } = render(Host);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    await fireEvent.click(screen.getByRole('button', { name: /Shipping/ }));
    expect(states(container)).toEqual(['complete', 'current', 'upcoming']);
  });

  it('takes translated state labels and per-part classes', () => {
    const { container } = render(Steps, {
      props: {
        modelValue: 2,
        completeLabel: 'Erledigt',
        classes: { root: 'r', step: 's', title: 't' },
        steps: [{ title: 'A' }, { title: 'B' }],
      },
    });
    expect(container.querySelector('[data-part="marker"]')!.textContent).toBe('Erledigt');
    expect(container.querySelector('ol')!.className).toBe('apui-steps r');
    expect(container.querySelector('li')!.className).toBe('s');
    expect(container.querySelector('[data-part="title"]')!.className).toBe('t');
  });
});

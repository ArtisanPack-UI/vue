import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, reactive, ref } from 'vue';

const mockPageProps = reactive({
  auth: { user: null },
  flash: {},
  errors: {} as Record<string, string>,
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: mockPageProps }),
}));

import InertiaSelect from '../../../components/form/InertiaSelect.vue';

const PLANS = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Pro' },
];

const control = (container: Element) =>
  container.querySelector('[data-scope="select"][data-part="control"]') as HTMLSelectElement;

describe('InertiaSelect', () => {
  it('round-trips numeric option values through its model', async () => {
    mockPageProps.errors = {};
    const model = ref<string | number | undefined>(1);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(InertiaSelect, {
            name: 'plan_id',
            label: 'Plan',
            options: PLANS,
            modelValue: model.value,
            'onUpdate:modelValue': (value: string | number | undefined) => (model.value = value),
          }),
      }),
    );
    expect(control(container).value).toBe('1');
    await fireEvent.update(control(container), '2');
    expect(model.value).toBe(2);
    expect(typeof model.value).toBe('number');
    await nextTick();
    expect(control(container).value).toBe('2');
    expect(control(container).name).toBe('plan_id');
  });

  it('falls back to Inertia page errors', () => {
    mockPageProps.errors = { plan_id: 'Choose a plan.' };
    const { container } = render(InertiaSelect, {
      props: { name: 'plan_id', label: 'Plan', options: PLANS },
    });
    expect(container.querySelector('[data-part="error"]')!.textContent).toBe('Choose a plan.');
    expect(control(container).getAttribute('aria-invalid')).toBe('true');
  });
});

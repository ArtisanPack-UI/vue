import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, provide, reactive, ref } from 'vue';

const mockPageProps = reactive({
  auth: { user: null },
  flash: {},
  errors: {} as Record<string, string>,
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: mockPageProps }),
}));

import InertiaRadioGroup from '../../../components/form/InertiaRadioGroup.vue';
import { INERTIA_FORM_KEY } from '../../../components/form/keys';

const PLANS = [
  { value: 1, label: 'Basic' },
  { value: 2, label: 'Pro' },
];

const radios = (container: Element) =>
  [
    ...container.querySelectorAll('[data-scope="radio-group"][data-part="control"]'),
  ] as HTMLInputElement[];

describe('InertiaRadioGroup', () => {
  it('names every radio and round-trips the value through its model', async () => {
    mockPageProps.errors = {};
    const model = ref<string | number | undefined>(1);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(InertiaRadioGroup, {
            name: 'plan_id',
            label: 'Plan',
            options: PLANS,
            modelValue: model.value,
            'onUpdate:modelValue': (value: string | number | undefined) => (model.value = value),
          }),
      }),
    );
    expect(radios(container).map((radio) => radio.name)).toEqual(['plan_id', 'plan_id']);
    expect(radios(container)[0]!.checked).toBe(true);
    await fireEvent.click(radios(container)[1]!);
    expect(model.value).toBe(2);
  });

  it('falls back to Inertia page errors', () => {
    mockPageProps.errors = { plan_id: 'Choose a plan.' };
    const { container } = render(InertiaRadioGroup, {
      // label and options fall through to RadioGroup as attributes.
      props: { name: 'plan_id', label: 'Plan', options: PLANS } as never,
    });
    expect(
      container.querySelector('[data-scope="radio-group"][data-part="error"]')!.textContent,
    ).toBe('Choose a plan.');
    expect(radios(container)[0]!.getAttribute('aria-invalid')).toBe('true');
  });

  it('prefers the surrounding form context, and an explicit error over both', () => {
    mockPageProps.errors = { plan_id: 'Page error.' };
    const Host = (error?: string) =>
      defineComponent({
        setup() {
          provide(INERTIA_FORM_KEY, { getError: () => 'Form error.' } as never);
          return () => h(InertiaRadioGroup, { name: 'plan_id', options: PLANS, error });
        },
      });
    const fromForm = render(Host());
    expect(fromForm.container.querySelector('[data-part="error"]')!.textContent).toBe(
      'Form error.',
    );
    const explicit = render(Host('Explicit.'));
    expect(explicit.container.querySelector('[data-part="error"]')!.textContent).toBe('Explicit.');
  });
});

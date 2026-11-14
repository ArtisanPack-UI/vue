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

import InertiaCheckbox from '../../../components/form/InertiaCheckbox.vue';

const control = (container: Element) =>
  container.querySelector('[data-scope="checkbox"][data-part="control"]') as HTMLInputElement;

describe('InertiaCheckbox', () => {
  it('updates its model when toggled, and follows the model', async () => {
    mockPageProps.errors = {};
    const model = ref(false);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(InertiaCheckbox, {
            name: 'terms',
            label: 'Accept terms',
            modelValue: model.value,
            'onUpdate:modelValue': (value: boolean) => (model.value = value),
          }),
      }),
    );
    expect(control(container).name).toBe('terms');
    await fireEvent.click(control(container));
    expect(model.value).toBe(true);
    model.value = false;
    await nextTick();
    expect(control(container).checked).toBe(false);
    expect(container.querySelector('.apui-checkbox')!.getAttribute('data-state')).toBe('unchecked');
  });

  it('starts checked from its model', () => {
    const { container } = render(InertiaCheckbox, {
      props: { name: 'terms', label: 'Accept terms', modelValue: true },
    });
    expect(control(container).checked).toBe(true);
  });

  it('falls back to Inertia page errors', () => {
    mockPageProps.errors = { terms: 'You must accept the terms.' };
    const { container } = render(InertiaCheckbox, {
      props: { name: 'terms', label: 'Accept terms' },
    });
    expect(container.querySelector('[data-part="error"]')!.textContent).toBe(
      'You must accept the terms.',
    );
    expect(control(container).getAttribute('aria-invalid')).toBe('true');
  });

  it('prefers an explicit error over page errors', () => {
    mockPageProps.errors = { terms: 'Server error' };
    const { container } = render(InertiaCheckbox, {
      props: { name: 'terms', label: 'Accept terms', error: 'Explicit error' },
    });
    expect(container.querySelector('[data-part="error"]')!.textContent).toBe('Explicit error');
  });
});

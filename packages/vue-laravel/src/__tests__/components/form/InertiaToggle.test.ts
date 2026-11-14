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

import InertiaToggle from '../../../components/form/InertiaToggle.vue';

const control = (container: Element) =>
  container.querySelector('[data-scope="toggle"][data-part="control"]') as HTMLInputElement;

describe('InertiaToggle', () => {
  it('updates its model when toggled, and follows the model', async () => {
    mockPageProps.errors = {};
    const model = ref(false);
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(InertiaToggle, {
            name: 'digest',
            label: 'Weekly digest',
            modelValue: model.value,
            'onUpdate:modelValue': (value: boolean) => (model.value = value),
          }),
      }),
    );
    expect(control(container).name).toBe('digest');
    await fireEvent.click(control(container));
    expect(model.value).toBe(true);
    model.value = false;
    await nextTick();
    expect(control(container).checked).toBe(false);
    expect(container.querySelector('.apui-toggle')!.getAttribute('data-state')).toBe('unchecked');
  });

  it('starts checked from its model', () => {
    const { container } = render(InertiaToggle, {
      props: { name: 'digest', label: 'Weekly digest', modelValue: true },
    });
    expect(control(container).checked).toBe(true);
  });

  it('falls back to Inertia page errors', () => {
    mockPageProps.errors = { digest: 'Turn on the digest.' };
    const { container } = render(InertiaToggle, {
      props: { name: 'digest', label: 'Weekly digest' },
    });
    expect(container.querySelector('[data-part="error"]')!.textContent).toBe('Turn on the digest.');
    expect(control(container).getAttribute('aria-invalid')).toBe('true');
  });

  it('prefers an explicit error over page errors', () => {
    mockPageProps.errors = { digest: 'Server error' };
    const { container } = render(InertiaToggle, {
      props: { name: 'digest', label: 'Weekly digest', error: 'Explicit error' },
    });
    expect(container.querySelector('[data-part="error"]')!.textContent).toBe('Explicit error');
  });
});

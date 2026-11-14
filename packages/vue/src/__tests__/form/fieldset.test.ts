import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Fieldset } from '../../components/form';

describe('Fieldset', () => {
  it('renders a native fieldset with the legend parts', () => {
    const { container } = render(Fieldset, {
      props: { title: 'Contact', description: 'Who to reach.' },
      slots: { default: '<input aria-label="Name" />' },
    });
    const root = container.querySelector('fieldset.apui-fieldset')!;
    expect(root.getAttribute('data-variant')).toBe('panel');
    const legend = root.querySelector('legend[data-scope="fieldset"][data-part="legend"]')!;
    expect(legend.querySelector('[data-part="title"]')!.textContent).toBe('Contact');
    expect(legend.querySelector('[data-part="description"]')!.textContent).toBe('Who to reach.');
    expect(root.querySelector('input')).not.toBeNull();
  });

  it('omits the legend without a title or description', () => {
    const { container } = render(Fieldset, { slots: { default: 'Fields' } });
    expect(container.querySelector('legend')).toBeNull();
  });

  it('disables every control inside', () => {
    const { container } = render(Fieldset, {
      props: { title: 'Payout', disabled: true, variant: 'plain' },
      slots: { default: '<input aria-label="IBAN" />' },
    });
    const root = container.querySelector('fieldset')!;
    expect(root.disabled).toBe(true);
    expect(root.hasAttribute('data-disabled')).toBe(true);
    expect(root.getAttribute('data-variant')).toBe('plain');
    expect((root.querySelector('input') as HTMLInputElement).matches(':disabled')).toBe(true);
  });

  it('takes title and description slots', () => {
    const { container } = render(Fieldset, {
      slots: { title: '<em>Rich</em>', description: 'Desc' },
    });
    expect(container.querySelector('[data-part="title"] em')).not.toBeNull();
  });
});

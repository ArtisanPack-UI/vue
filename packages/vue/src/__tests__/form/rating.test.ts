import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { Rating } from '../../components/form';

describe('Rating', () => {
  it('is one image with a text alternative when read-only', () => {
    const { container } = render(Rating, {
      props: { readonly: true, modelValue: 4.2, count: 17 },
    });
    expect(screen.getByRole('img', { name: '4.2 out of 5' })).toBeTruthy();
    expect(container.querySelectorAll('[data-part="star"][data-filled]')).toHaveLength(4);
    expect(container.querySelector('[data-part="value"]')!.textContent).toBe('4.2');
    expect(container.querySelector('[data-part="count"]')!.textContent).toBe('(17 reviews)');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('rounds to the nearest half star', () => {
    const { container } = render(Rating, { props: { readonly: true, modelValue: 3.4 } });
    expect(container.querySelectorAll('[data-part="star"][data-filled]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-part="star"][data-half]')).toHaveLength(1);
  });

  it('is a radiogroup of named native radios as an input', async () => {
    const { emitted } = render(Rating, { props: { label: 'Rate the viewing', modelValue: 2 } });
    expect(screen.getByRole('radiogroup', { name: 'Rate the viewing' })).toBeTruthy();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios).toHaveLength(5);
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
    expect((screen.getByRole('radio', { name: '2 out of 5' }) as HTMLInputElement).checked).toBe(
      true,
    );
    await fireEvent.click(screen.getByRole('radio', { name: '4 out of 5' }));
    expect(emitted()['update:modelValue']).toEqual([[4]]);
  });

  it('fills the label templates', () => {
    const { container } = render(Rating, {
      props: { max: 10, count: 3, valueLabel: 'Note :value sur :max', countLabel: ':count avis' },
    });
    expect(screen.getAllByRole('radio')).toHaveLength(10);
    expect(screen.getByRole('radio', { name: 'Note 2 sur 10' })).toBeTruthy();
    expect(container.querySelector('[data-part="count"]')!.textContent).toBe('3 avis');
  });

  it('uses the singular count for one review', () => {
    const { container } = render(Rating, { props: { readonly: true, modelValue: 5, count: 1 } });
    expect(container.querySelector('[data-part="count"]')!.textContent).toBe('(1 review)');
  });
});

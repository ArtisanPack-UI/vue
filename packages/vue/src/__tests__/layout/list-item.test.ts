import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { List, ListItem } from '../../components/layout';

describe('ListItem', () => {
  it('renders a div row on its own and li rows in a List', () => {
    const { container } = render(
      defineComponent({
        render: () => [
          h(ListItem, { title: 'Alone', description: 'olivia@company.com' }),
          h(List, { variant: 'bordered' }, () => [
            h(ListItem, { title: 'A' }),
            h(ListItem, { title: 'B' }),
          ]),
        ],
      }),
    );
    expect(container.querySelector('div.apui-list-item')?.textContent).toContain('Alone');
    expect(
      container.querySelectorAll('ul.apui-list[data-variant="bordered"] > li.apui-list-item'),
    ).toHaveLength(2);
    expect(container.querySelector('[data-part="description"]')?.textContent).toBe(
      'olivia@company.com',
    );
  });

  it('makes the title a link covering the row, with aria-current when selected', () => {
    const { container } = render(ListItem, {
      props: { title: 'Olivia', href: '/members/1', selected: true },
    });
    const link = screen.getByRole('link', { name: 'Olivia' });
    expect(link.getAttribute('href')).toBe('/members/1');
    expect(link.getAttribute('aria-current')).toBe('true');
    const root = container.querySelector('.apui-list-item')!;
    expect(root.getAttribute('data-interactive')).toBe('');
    expect(root.getAttribute('data-selected')).toBe('');
  });

  it('makes the title a button for interactive rows, and the row hears the click', async () => {
    const clicks: string[] = [];
    render(ListItem, {
      props: { title: 'Offer', interactive: true },
      attrs: { onClick: () => clicks.push('row') },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Offer' }));
    expect(clicks).toEqual(['row']);
  });

  it('disables the control of a disabled row and drops unsafe hrefs', () => {
    render(ListItem, { props: { title: 'A', interactive: true, disabled: true } });
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    const link = render(ListItem, { props: { title: 'B', href: '/b', disabled: true } });
    const anchor = link.container.querySelector('a')!;
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    const unsafe = render(ListItem, { props: { title: 'C', href: 'javascript:alert(1)' } });
    expect(unsafe.container.querySelector('a')).toBeNull();
  });

  it('renders leading and trailing content, and slots override them', () => {
    const { container } = render(ListItem, {
      props: { title: 'A', leadingIcon: 'mail', trailing: '2m' },
    });
    expect(container.querySelector('[data-part="leading"] svg')).not.toBeNull();
    expect(container.querySelector('[data-part="trailing"]')?.textContent).toBe('2m');
    const slotted = render(ListItem, {
      props: { title: 'A' },
      slots: { leading: '<i>L</i>', trailing: '<b>T</b>' },
    });
    expect(slotted.container.querySelector('[data-part="leading"] i')).not.toBeNull();
    expect(slotted.container.querySelector('[data-part="trailing"] b')).not.toBeNull();
  });
});

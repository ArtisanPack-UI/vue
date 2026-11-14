import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent } from 'vue';
import { Breadcrumbs, BreadcrumbsItem, type BreadcrumbItem } from '../../components/navigation';

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '/', icon: 'house', hideLabel: true },
  { label: 'Properties', href: '/properties' },
  { label: 'Lakeview Lofts', href: '/properties/1' },
  { label: 'Analytics', href: '/properties/1/analytics' },
  { label: 'Visitor', href: '/ignored' },
];

describe('Breadcrumbs', () => {
  it('renders a named nav landmark with an ordered list', () => {
    const { container } = render(Breadcrumbs, { props: { items: trail, maxItems: 0 } });
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' }).className).toBe(
      'apui-breadcrumbs',
    );
    expect(container.querySelectorAll('ol[data-part="list"] > li[data-part="item"]')).toHaveLength(
      5,
    );
    expect(container.querySelector('[data-part="overflow"]')).toBeNull();
  });

  it('makes the last item the current page, never a link', () => {
    const { container } = render(Breadcrumbs, { props: { items: trail, maxItems: 0 } });
    const current = container.querySelector('[data-part="current"]')!;
    expect(current.tagName).toBe('SPAN');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.textContent).toBe('Visitor');
    expect(container.querySelector('a[href="/ignored"]')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('hides and mirrors the separators, after the first level only', () => {
    const { container } = render(Breadcrumbs, { props: { items: trail, maxItems: 0 } });
    const separators = container.querySelectorAll('[data-part="separator"]');
    expect(separators).toHaveLength(4);
    expect(container.querySelector('li:first-child [data-part="separator"]')).toBeNull();
    separators.forEach((separator) => {
      expect(separator.getAttribute('aria-hidden')).toBe('true');
      expect(separator.getAttribute('data-mirror')).toBe('');
    });
  });

  it('keeps a hidden label for screen readers', () => {
    render(Breadcrumbs, { props: { items: trail, maxItems: 0 } });
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home.querySelector('svg')).not.toBeNull();
    expect(home.querySelector('.apui-sr-only')!.textContent).toBe('Home');
  });

  it('collapses the middle and reveals it, moving focus', async () => {
    const { container } = render(Breadcrumbs, {
      props: { items: trail },
      container: document.body.appendChild(document.createElement('div')),
    });
    const overflow = screen.getByRole('button', { name: 'Show 2 more levels' });
    expect(overflow.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelectorAll('li[hidden]')).toHaveLength(2);

    await fireEvent.click(overflow);
    expect(container.querySelectorAll('li[hidden]')).toHaveLength(1);
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Properties' }));
  });

  it('takes translated labels', () => {
    render(Breadcrumbs, {
      props: { items: trail, label: "Fil d'Ariane", overflowLabel: 'Afficher {count}' },
    });
    expect(screen.getByRole('navigation', { name: "Fil d'Ariane" })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Afficher 2' })).toBeTruthy();
  });

  it('renders router links through the link slot', () => {
    render(Breadcrumbs, {
      props: { items: [{ label: 'Home', href: '/' }, { label: 'Here' }] },
      slots: {
        link: `<template #link="{ item, href, attrs }"><a v-bind="attrs" :href="'/routed' + href" data-router="">{{ item.label }}</a></template>`,
      },
    });
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.getAttribute('href')).toBe('/routed/');
    expect(link.getAttribute('data-part')).toBe('link');
  });

  it('composes BreadcrumbsItem children after items, v-for included', async () => {
    const clicks: string[] = [];
    const Host = defineComponent({
      components: { Breadcrumbs, BreadcrumbsItem },
      setup: () => ({ levels: ['Lakeview Lofts'], onClick: () => clicks.push('click') }),
      template: `<Breadcrumbs :items="[{ label: 'Home', href: '/' }]">
        <BreadcrumbsItem label="Properties" href="/properties" @click="onClick" />
        <BreadcrumbsItem v-for="level in levels" :key="level" href="/1"><strong>{{ level }}</strong></BreadcrumbsItem>
        <BreadcrumbsItem label="Visitor" href="/ignored" />
      </Breadcrumbs>`,
    });
    const { container } = render(Host);
    expect([...container.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Home',
      'Properties',
      'Lakeview Lofts',
      'Visitor',
    ]);
    expect(container.querySelectorAll('[data-part="separator"]')).toHaveLength(3);
    expect(container.querySelector('[data-part="current"]')!.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(container.querySelector('a[href="/1"] strong')).not.toBeNull();
    expect(container.querySelector('a[href="/ignored"]')).toBeNull();
    await fireEvent.click(screen.getByRole('link', { name: 'Properties' }));
    expect(clicks).toEqual(['click']);
  });

  it('renders nothing for a BreadcrumbsItem on its own', () => {
    const { container } = render(BreadcrumbsItem, { props: { label: 'Alone' } });
    expect(container.textContent).toBe('');
  });
});

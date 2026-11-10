import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Card } from '../../components/layout';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="card"][data-part="${name}"]`);

const rootOf = (container: Element) => container.querySelector('.apui-card')!;

describe('Card', () => {
  it('renders a div surface with the default data attributes', () => {
    const { container } = render(Card, { slots: { default: 'Body' } });
    const root = rootOf(container);
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('data-surface')).toBe('default');
    expect(root.hasAttribute('data-interactive')).toBe(false);
    expect(partOf(container, 'body')!.textContent).toBe('Body');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual(['body']);
  });

  it('emits the surface', () => {
    const { container } = render(Card, { props: { surface: 'glass' } });
    expect(rootOf(container).getAttribute('data-surface')).toBe('glass');
  });

  it('omits the body without default content', () => {
    const { container } = render(Card, { props: { title: 'Title' } });
    expect(partOf(container, 'body')).toBeNull();
  });

  it('renders the header with title and description in a plain wrapper', () => {
    const { container } = render(Card, {
      props: { title: 'Quarterly report', description: 'Updated 2 hours ago' },
    });
    const header = partOf(container, 'header')!;
    const wrapper = header.firstElementChild!;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.hasAttribute('data-part')).toBe(false);
    const title = partOf(container, 'title')!;
    expect(title.tagName).toBe('H3');
    expect(title.textContent).toBe('Quarterly report');
    expect(partOf(container, 'description')!.tagName).toBe('P');
    expect(partOf(container, 'actions')).toBeNull();
  });

  it('renders actions in the header without the title wrapper', () => {
    const { container } = render(Card, { slots: { actions: '<button>Share</button>' } });
    const header = partOf(container, 'header')!;
    expect(header.children).toHaveLength(1);
    expect(header.firstElementChild!.getAttribute('data-part')).toBe('actions');
    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy();
  });

  it('omits the header without title, description or actions', () => {
    const { container } = render(Card, { slots: { default: 'Body', footer: 'Footer' } });
    expect(partOf(container, 'header')).toBeNull();
    expect(partOf(container, 'footer')!.textContent).toBe('Footer');
  });

  it('links the title with href and marks the card interactive', () => {
    const { container } = render(Card, { props: { title: 'Report', href: '/reports/1' } });
    expect(rootOf(container).getAttribute('data-interactive')).toBe('');
    const link = screen.getByRole('link', { name: 'Report' });
    expect(link.getAttribute('href')).toBe('/reports/1');
    expect(link.parentElement).toBe(partOf(container, 'title'));
  });

  it('marks the card interactive without a link', () => {
    const { container } = render(Card, { props: { interactive: true, title: 'Report' } });
    expect(rootOf(container).getAttribute('data-interactive')).toBe('');
    expect(container.querySelector('a')).toBeNull();
  });

  it('renders media as a decorative image by default', () => {
    const { container } = render(Card, { props: { media: '/cover.png', title: 'T' } });
    const media = partOf(container, 'media')!;
    expect(media.tagName).toBe('IMG');
    expect(media.getAttribute('src')).toBe('/cover.png');
    expect(media.getAttribute('alt')).toBe('');
    expect(rootOf(container).firstElementChild).toBe(media);
  });

  it('uses mediaAlt for the image', () => {
    const { container } = render(Card, { props: { media: '/cover.png', mediaAlt: 'Chart' } });
    expect(partOf(container, 'media')!.getAttribute('alt')).toBe('Chart');
  });

  it('replaces the image with the media slot in a div', () => {
    const { container } = render(Card, {
      props: { media: '/cover.png' },
      slots: { media: '<video></video>' },
    });
    const media = partOf(container, 'media')!;
    expect(media.tagName).toBe('DIV');
    expect(media.querySelector('video')).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('lets slots override title, description, actions and footer', () => {
    const { container } = render(Card, {
      props: { title: 'Prop', description: 'Prop', actions: 'Prop', footer: 'Prop', href: '/x' },
      slots: {
        title: '<em>Rich title</em>',
        description: '<strong>Rich</strong>',
        actions: '<button>Share</button>',
        footer: '<span>3 comments</span>',
      },
    });
    const link = partOf(container, 'title')!.querySelector('a')!;
    expect(link.innerHTML).toBe('<em>Rich title</em>');
    expect(partOf(container, 'description')!.innerHTML).toBe('<strong>Rich</strong>');
    expect(partOf(container, 'actions')!.innerHTML).toBe('<button>Share</button>');
    expect(partOf(container, 'footer')!.innerHTML).toBe('<span>3 comments</span>');
  });

  it('renders the parts in contract order', () => {
    const { container } = render(Card, {
      props: { media: '/m.png', title: 'T', description: 'D', actions: 'A', footer: 'F' },
      slots: { default: 'Body' },
    });
    expect([...rootOf(container).children].map((el) => el.getAttribute('data-part'))).toEqual([
      'media',
      'header',
      'body',
      'footer',
    ]);
  });

  it('routes class and attributes to the root and classes to each part', () => {
    const { container } = render(Card, {
      props: { title: 'T', classes: { root: 'r', header: 'h', title: 't', body: 'b' } },
      attrs: { class: 'extra', id: 'card', 'aria-label': 'Report' },
      slots: { default: 'Body' },
    });
    const root = rootOf(container);
    expect(root.className).toBe('apui-card r extra');
    expect(root.id).toBe('card');
    expect(root.getAttribute('aria-label')).toBe('Report');
    expect(partOf(container, 'header')!.className).toBe('h');
    expect(partOf(container, 'title')!.className).toBe('t');
    expect(partOf(container, 'body')!.className).toBe('b');
  });

  it('ignores href without a title, warns, and stays non-interactive', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(Card, {
      props: { href: '/reports/1', description: 'No title' },
      slots: { default: 'Body' },
    });
    expect(container.querySelector('a')).toBeNull();
    expect(rootOf(container).hasAttribute('data-interactive')).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('href without a title'));
    warn.mockRestore();
  });

  it('honors href with a title slot', () => {
    const { container } = render(Card, {
      props: { href: '/reports/1' },
      slots: { title: 'Report' },
    });
    expect(screen.getByRole('link', { name: 'Report' }).getAttribute('href')).toBe('/reports/1');
    expect(rootOf(container).getAttribute('data-interactive')).toBe('');
  });

  it.each(['javascript:alert(1)', ' VBScript:x', 'data:text/html,x'])(
    'ignores the unsafe href %j',
    (href) => {
      const { container } = render(Card, { props: { href, title: 'Report' } });
      expect(container.querySelector('a')).toBeNull();
      expect(rootOf(container).hasAttribute('data-interactive')).toBe(false);
      expect(partOf(container, 'title')!.textContent).toBe('Report');
    },
  );

  it('rejects javascript: and vbscript: media but allows data: images', () => {
    const { container, unmount } = render(Card, {
      props: { media: 'javascript:alert(1)', title: 'T' },
    });
    expect(partOf(container, 'media')).toBeNull();
    unmount();
    const second = render(Card, { props: { media: ' vbscript:x', title: 'T' } });
    expect(partOf(second.container, 'media')).toBeNull();
    second.unmount();
    const third = render(Card, { props: { media: 'data:image/png;base64,AAAA', title: 'T' } });
    expect(partOf(third.container, 'media')!.getAttribute('src')).toBe(
      'data:image/png;base64,AAAA',
    );
  });
});

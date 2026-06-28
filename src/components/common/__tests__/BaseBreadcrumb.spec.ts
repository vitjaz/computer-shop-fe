import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseBreadcrumb from '../BaseBreadcrumb.vue'

const stubs = {
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}

describe('BaseBreadcrumb', () => {
  it('renders a nav with aria-label and the .crumb container', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: { items: [{ label: 'Текущая' }] },
      global: { stubs },
    })

    expect(wrapper.find('nav[aria-label="Breadcrumb"]').exists()).toBe(true)
    expect(wrapper.find('.crumb').exists()).toBe(true)
  })

  it('renders a link for items with `to` (except the last)', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'Главная', to: '/' },
          { label: 'Каталог', to: '/catalog' },
          { label: 'Товар' },
        ],
      },
      global: { stubs },
    })

    const links = wrapper.findAll('.crumb a')
    expect(links).toHaveLength(2)
    expect(links[0]!.attributes('href')).toBe('/')
    expect(links[1]!.attributes('href')).toBe('/catalog')
  })

  it('renders a span (not a link) for an item without `to`', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'Каталог', to: '/catalog' },
          { label: 'Категория' },
          { label: 'Товар' },
        ],
      },
      global: { stubs },
    })

    expect(wrapper.findAll('.crumb a')).toHaveLength(1)
  })

  it('marks the last item with aria-current="page" and renders it as a span', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'Главная', to: '/' },
          { label: 'Товар' },
        ],
      },
      global: { stubs },
    })

    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.element.tagName).toBe('SPAN')
    expect(current.text()).toBe('Товар')
    expect(current.attributes('href')).toBeUndefined()
  })

  it('forces the last item to a span even when it has a `to`', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'A', to: '/a' },
          { label: 'B', to: '/b' },
        ],
      },
      global: { stubs },
    })

    expect(wrapper.findAll('.crumb a')).toHaveLength(1)
    expect(wrapper.find('[aria-current="page"]').exists()).toBe(true)
  })

  it('renders separators between items (count = items.length - 1)', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'A', to: '/a' },
          { label: 'B', to: '/b' },
          { label: 'C', to: '/c' },
          { label: 'D' },
        ],
      },
      global: { stubs },
    })

    expect(wrapper.findAll('.crumb .sep')).toHaveLength(3)
  })

  it('renders no separators for a single-item trail', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: { items: [{ label: 'Только текущая' }] },
      global: { stubs },
    })

    expect(wrapper.findAll('.crumb .sep')).toHaveLength(0)
  })

  it('uses the › glyph as the default separator', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'A', to: '/a' },
          { label: 'B' },
        ],
      },
      global: { stubs },
    })

    expect(wrapper.findAll('.sep')[0]!.text()).toBe('›')
  })

  it('overrides the separator via the separator slot', () => {
    const wrapper = mount(BaseBreadcrumb, {
      props: {
        items: [
          { label: 'A', to: '/a' },
          { label: 'B' },
        ],
      },
      slots: { separator: '<span data-test="sep">/</span>' },
      global: { stubs },
    })

    expect(wrapper.find('[data-test="sep"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="sep"]').text()).toBe('/')
  })
})

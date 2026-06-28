import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BasePagination from '../BasePagination.vue'

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BasePagination', () => {
  it('renders a nav.pager with aria-label', () => {
    wrapper = mount(BasePagination, { props: { page: 1, total: 24, perPage: 12 } })

    const nav = wrapper.find('nav.pager')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toContain('страниц')
  })

  it('renders all page numbers when total fits in the visible slots', () => {
    wrapper = mount(BasePagination, { props: { page: 1, total: 24, perPage: 12 } })

    const buttons = wrapper.findAll('.pager-pages button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.text()).toBe('1')
    expect(buttons[1]!.text()).toBe('2')
    expect(wrapper.find('.dots').exists()).toBe(false)
  })

  it('renders ellipsis on both sides when current is in the middle', () => {
    wrapper = mount(BasePagination, { props: { page: 5, total: 120, perPage: 12 } })

    const dots = wrapper.findAll('.dots')
    expect(dots).toHaveLength(2)
    const labels = wrapper.findAll('.pager-pages button').map((b) => b.text())
    expect(labels).toEqual(['1', '4', '5', '6', '10'])
  })

  it('renders ellipsis only on the right when current is near the start', () => {
    wrapper = mount(BasePagination, { props: { page: 1, total: 120, perPage: 12 } })

    const dots = wrapper.findAll('.dots')
    expect(dots).toHaveLength(1)
    const labels = wrapper.findAll('.pager-pages button').map((b) => b.text())
    expect(labels[0]).toBe('1')
    expect(labels[labels.length - 1]).toBe('10')
  })

  it('renders ellipsis only on the left when current is near the end', () => {
    wrapper = mount(BasePagination, { props: { page: 10, total: 120, perPage: 12 } })

    const dots = wrapper.findAll('.dots')
    expect(dots).toHaveLength(1)
    const labels = wrapper.findAll('.pager-pages button').map((b) => b.text())
    expect(labels[0]).toBe('1')
    expect(labels[labels.length - 1]).toBe('10')
  })

  it('marks the current page with .active, aria-current=page, and disabled', () => {
    wrapper = mount(BasePagination, { props: { page: 3, total: 120, perPage: 12 } })

    const buttons = wrapper.findAll('.pager-pages button')
    const active = buttons.find((b) => b.text() === '3')
    expect(active!.classes()).toContain('active')
    expect(active!.attributes('aria-current')).toBe('page')
    expect(active!.attributes('disabled')).toBeDefined()
  })

  it('emits change with the page number when a non-active page is clicked', async () => {
    wrapper = mount(BasePagination, { props: { page: 3, total: 120, perPage: 12 } })

    const target = wrapper.findAll('.pager-pages button').find((b) => b.text() === '4')!
    await target.trigger('click')

    expect(wrapper.emitted('change')).toEqual([[4]])
  })

  it('does not emit change when the current page is clicked', async () => {
    wrapper = mount(BasePagination, { props: { page: 3, total: 120, perPage: 12 } })

    const current = wrapper.findAll('.pager-pages button').find((b) => b.text() === '3')!
    await current.trigger('click')

    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('clamps an out-of-range page prop to the last page without crashing', () => {
    wrapper = mount(BasePagination, { props: { page: 99, total: 24, perPage: 12 } })

    const buttons = wrapper.findAll('.pager-pages button')
    expect(buttons[1]!.text()).toBe('2')
    expect(buttons[1]!.classes()).toContain('active')
  })

  it('clamps a sub-one page prop to page 1', () => {
    wrapper = mount(BasePagination, { props: { page: -3, total: 24, perPage: 12 } })

    const buttons = wrapper.findAll('.pager-pages button')
    expect(buttons[0]!.classes()).toContain('active')
  })

  it('renders the pager-info range text "start–end из total"', () => {
    wrapper = mount(BasePagination, { props: { page: 2, total: 95, perPage: 12 } })

    expect(wrapper.find('.pager-info').text()).toContain('13–24')
    expect(wrapper.find('.pager-info').text()).toContain('95')
  })

  it('renders no pages and no range when total is zero', () => {
    wrapper = mount(BasePagination, { props: { page: 1, total: 0, perPage: 12 } })

    expect(wrapper.find('.pager-pages').exists()).toBe(false)
    expect(wrapper.find('.pager-info').exists()).toBe(false)
  })
})

import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseTabs from '../BaseTabs.vue'

const items = [
  { id: 'desc', label: 'Описание', count: 0 },
  { id: 'specs', label: 'Характеристики', count: 12 },
  { id: 'reviews', label: 'Отзывы' },
]

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseTabs', () => {
  it('renders the .tabs container with role=tablist and a .tab per item', () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    const list = wrapper.find('.tabs')
    expect(list.exists()).toBe(true)
    expect(list.attributes('role')).toBe('tablist')
    expect(list.findAll('.tab')).toHaveLength(3)
    expect(list.findAll('.tab')[0]!.element.tagName).toBe('BUTTON')
  })

  it('applies .active and aria-selected=true only to the active tab', () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'specs', items } })

    const tabs = wrapper.findAll('.tab')
    expect(tabs[1]!.classes()).toContain('active')
    expect(tabs[1]!.attributes('aria-selected')).toBe('true')
    expect(tabs[0]!.classes()).not.toContain('active')
    expect(tabs[0]!.attributes('aria-selected')).toBe('false')
  })

  it('marks the active tab as the only tab-stop (tabindex 0 vs -1)', () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'reviews', items } })

    const tabs = wrapper.findAll('.tab')
    expect(tabs[2]!.attributes('tabindex')).toBe('0')
    expect(tabs[0]!.attributes('tabindex')).toBe('-1')
    expect(tabs[1]!.attributes('tabindex')).toBe('-1')
  })

  it('wires aria-controls on the tab to the panel id and aria-labelledby back', () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    const tab = wrapper.findAll('.tab')[0]!
    const panel = wrapper.find('[role="tabpanel"]')
    expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
  })

  it('renders the .count span only when count is provided', () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    const tabs = wrapper.findAll('.tab')
    expect(tabs[0]!.find('.count').exists()).toBe(true)
    expect(tabs[1]!.find('.count').text()).toBe('12')
    expect(tabs[2]!.find('.count').exists()).toBe(false)
  })

  it('emits update:modelValue when a tab is clicked', async () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    await wrapper.findAll('.tab')[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['reviews']])
  })

  it('does not emit when the active tab is clicked', async () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    await wrapper.findAll('.tab')[0]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('moves active tab forward with ArrowRight and emits', async () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'desc', items } })

    await wrapper.find('.tabs').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['specs']])
  })

  it('moves active tab backward with ArrowLeft and emits', async () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'specs', items } })

    await wrapper.find('.tabs').trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['desc']])
  })

  it('wraps around from last to first on ArrowRight', async () => {
    wrapper = mount(BaseTabs, { props: { modelValue: 'reviews', items } })

    await wrapper.find('.tabs').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['desc']])
  })

  it('renders the named panel slot matching the active item id', () => {
    wrapper = mount(BaseTabs, {
      props: { modelValue: 'specs', items },
      slots: {
        'panel-specs': '<p data-test="spec-panel">Specs content</p>',
        'panel-desc': '<p data-test="desc-panel">Desc content</p>',
      },
    })

    expect(wrapper.find('[data-test="spec-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="desc-panel"]').exists()).toBe(false)
  })

  it('switches rendered panel when modelValue changes', async () => {
    wrapper = mount(BaseTabs, {
      props: { modelValue: 'desc', items },
      slots: {
        'panel-specs': '<p data-test="spec-panel">Specs content</p>',
        'panel-desc': '<p data-test="desc-panel">Desc content</p>',
      },
    })

    expect(wrapper.find('[data-test="desc-panel"]').exists()).toBe(true)
    await wrapper.setProps({ modelValue: 'specs' })
    expect(wrapper.find('[data-test="spec-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="desc-panel"]').exists()).toBe(false)
  })
})

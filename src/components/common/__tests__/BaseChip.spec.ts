import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseChip from '../BaseChip.vue'

describe('BaseChip', () => {
  it('renders .chip as a toggle button by default', () => {
    const wrapper = mount(BaseChip)

    expect(wrapper.classes()).toContain('chip')
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('toggles aria-pressed with the pressed prop in toggle mode', () => {
    expect(
      mount(BaseChip, { props: { pressed: true } }).attributes('aria-pressed'),
    ).toBe('true')
    expect(mount(BaseChip).attributes('aria-pressed')).toBe('false')
  })

  it('emits toggle when the chip body is clicked', async () => {
    const wrapper = mount(BaseChip)

    await wrapper.trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('adds .accent for the accent variant and omits it by default', () => {
    expect(mount(BaseChip, { props: { variant: 'accent' } }).classes()).toContain('accent')
    expect(mount(BaseChip).classes()).not.toContain('accent')
  })

  it('renders the slot label', () => {
    const wrapper = mount(BaseChip, { slots: { default: 'AMD' } })

    expect(wrapper.text()).toContain('AMD')
  })

  it('renders the close button only when removable', () => {
    const removable = mount(BaseChip, { props: { removable: true } })
    expect(removable.find('.chip button').exists()).toBe(true)

    const toggle = mount(BaseChip)
    expect(toggle.find('.chip button').exists()).toBe(false)
  })

  it('renders the chip body as a span (not a button) when removable', () => {
    const wrapper = mount(BaseChip, { props: { removable: true } })

    expect(wrapper.find('.chip').element.tagName).toBe('SPAN')
  })

  it('uses the × glyph (U+00D7) inside the close button', () => {
    const wrapper = mount(BaseChip, { props: { removable: true } })

    expect(wrapper.find('.chip button').text()).toBe('×')
  })

  it('labels the close button for screen readers', () => {
    const wrapper = mount(BaseChip, { props: { removable: true } })

    expect(wrapper.find('.chip button').attributes('aria-label')).toBe('Убрать')
  })

  it('emits remove and not toggle when the close button is clicked', async () => {
    const wrapper = mount(BaseChip, { props: { removable: true } })

    await wrapper.find('.chip button').trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('toggle')).toBeUndefined()
  })

  it('combines the accent variant with removable', () => {
    const wrapper = mount(BaseChip, { props: { removable: true, variant: 'accent' } })

    expect(wrapper.find('.chip').classes()).toContain('accent')
    expect(wrapper.find('.chip').classes()).toContain('chip')
  })
})

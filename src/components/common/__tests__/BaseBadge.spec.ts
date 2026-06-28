import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseBadge from '../BaseBadge.vue'

describe('BaseBadge', () => {
  it('applies only .pill for the default accent variant', () => {
    const wrapper = mount(BaseBadge)

    expect(wrapper.classes()).toContain('pill')
    expect(wrapper.classes()).not.toContain('pill-success')
    expect(wrapper.classes()).not.toContain('pill-neutral')
  })

  it('adds .pill-success (alongside .pill) for the success variant', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'success' } })

    expect(wrapper.classes()).toContain('pill')
    expect(wrapper.classes()).toContain('pill-success')
  })

  it('adds .pill-neutral (alongside .pill) for the neutral variant', () => {
    const wrapper = mount(BaseBadge, { props: { variant: 'neutral' } })

    expect(wrapper.classes()).toContain('pill')
    expect(wrapper.classes()).toContain('pill-neutral')
  })

  it('renders the slot label text', () => {
    const wrapper = mount(BaseBadge, { slots: { default: 'В наличии' } })

    expect(wrapper.text()).toBe('В наличии')
  })

  it('renders a span as the root element', () => {
    const wrapper = mount(BaseBadge)

    expect(wrapper.element.tagName).toBe('SPAN')
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseTag from '../BaseTag.vue'

describe('BaseTag', () => {
  it('renders .tag on a span', () => {
    const wrapper = mount(BaseTag)

    expect(wrapper.classes()).toContain('tag')
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('renders the slot content', () => {
    const wrapper = mount(BaseTag, { slots: { default: 'DDR5' } })

    expect(wrapper.text()).toBe('DDR5')
  })

  it('forwards fallthrough attributes onto the root element', () => {
    const wrapper = mount(BaseTag, { attrs: { id: 'spec-1' } })

    expect(wrapper.attributes('id')).toBe('spec-1')
  })
})

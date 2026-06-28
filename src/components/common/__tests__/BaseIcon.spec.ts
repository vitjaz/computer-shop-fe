import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseIcon from '../BaseIcon.vue'

describe('BaseIcon', () => {
  it('renders the matching SVG for a known icon name', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'cart' } })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.html()).toContain('viewBox="0 0 24 24"')
  })

  it('renders the default slot fallback when the name is unknown', () => {
    const wrapper = mount(BaseIcon, {
      props: { name: 'not-a-real-icon' },
      slots: { default: '<span class="fallback">—</span>' },
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.fallback').exists()).toBe(true)
  })

  it('renders nothing when the name is unknown and no slot is provided', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'not-a-real-icon' } })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('renders each icon in the extracted set', () => {
    const names = [
      'cart',
      'search',
      'heart',
      'compare',
      'star',
      'chevron-down',
      'close',
      'check',
      'arrow-left',
      'arrow-right',
    ]

    for (const name of names) {
      const wrapper = mount(BaseIcon, { props: { name } })
      expect(wrapper.find('svg').exists(), `icon "${name}" should render`).toBe(true)
    }
  })
})

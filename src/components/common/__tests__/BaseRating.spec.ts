import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseRating from '../BaseRating.vue'

describe('BaseRating', () => {
  it('renders .rating with a .stars container', () => {
    const wrapper = mount(BaseRating, { props: { value: 4 } })

    expect(wrapper.find('.rating').exists()).toBe(true)
    expect(wrapper.find('.rating .stars').exists()).toBe(true)
  })

  it('renders `max` star icons (default 5)', () => {
    const wrapper = mount(BaseRating, { props: { value: 3 } })

    expect(wrapper.findAll('.rating .stars svg')).toHaveLength(5)
  })

  it('marks the correct number of stars as filled vs empty', () => {
    const wrapper = mount(BaseRating, { props: { value: 3, max: 5 } })

    const stars = wrapper.findAll('.rating .stars .base-icon')
    const filled = stars.filter((s) => !s.classes().includes('empty'))
    const empty = stars.filter((s) => s.classes().includes('empty'))

    expect(filled).toHaveLength(3)
    expect(empty).toHaveLength(2)
  })

  it('floors fractional values to filled stars (4.5 -> 4 filled, 1 empty)', () => {
    const wrapper = mount(BaseRating, { props: { value: 4.5, max: 5 } })

    const stars = wrapper.findAll('.rating .stars .base-icon')
    const filled = stars.filter((s) => !s.classes().includes('empty'))

    expect(filled).toHaveLength(4)
  })

  it('respects a custom max', () => {
    const wrapper = mount(BaseRating, { props: { value: 5, max: 10 } })

    expect(wrapper.findAll('.rating .stars svg')).toHaveLength(10)
    expect(wrapper.findAll('.rating .stars .empty')).toHaveLength(5)
  })

  it('renders the count when provided', () => {
    const wrapper = mount(BaseRating, { props: { value: 4, count: 354 } })

    expect(wrapper.find('.count').exists()).toBe(true)
    expect(wrapper.find('.count').text()).toContain('354')
  })

  it('omits the count element when count is not provided', () => {
    const wrapper = mount(BaseRating, { props: { value: 4 } })

    expect(wrapper.find('.count').exists()).toBe(false)
  })

  it('clamps values above max to all filled', () => {
    const wrapper = mount(BaseRating, { props: { value: 99, max: 5 } })

    expect(wrapper.findAll('.rating .stars .empty')).toHaveLength(0)
  })

  it('clamps negative values to all empty', () => {
    const wrapper = mount(BaseRating, { props: { value: -3, max: 5 } })

    expect(wrapper.findAll('.rating .stars .empty')).toHaveLength(5)
  })

  it('uses a BaseIcon star for every position (svg inside .base-icon)', () => {
    const wrapper = mount(BaseRating, { props: { value: 2, max: 3 } })

    expect(wrapper.findAll('.base-icon')).toHaveLength(3)
    expect(wrapper.findAll('.rating .stars svg')).toHaveLength(3)
  })

  it('exposes an aria-label describing the value', () => {
    const wrapper = mount(BaseRating, { props: { value: 4, max: 5 } })

    expect(wrapper.find('.rating').attributes('aria-label')).toBe('Рейтинг 4 из 5')
  })
})

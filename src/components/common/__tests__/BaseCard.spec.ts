import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseCard from '../BaseCard.vue'

describe('BaseCard', () => {
  it('applies .card by default and renders a div', () => {
    const wrapper = mount(BaseCard)

    expect(wrapper.classes()).toContain('card')
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('adds .card-flat when flat', () => {
    const wrapper = mount(BaseCard, { props: { flat: true } })

    expect(wrapper.classes()).toContain('card-flat')
  })

  it('adds .card-hover when hover', () => {
    const wrapper = mount(BaseCard, { props: { hover: true } })

    expect(wrapper.classes()).toContain('card-hover')
  })

  it('omits modifier classes when neither flat nor hover', () => {
    const wrapper = mount(BaseCard)

    expect(wrapper.classes()).not.toContain('card-flat')
    expect(wrapper.classes()).not.toContain('card-hover')
  })

  it('combines flat and hover modifiers together', () => {
    const wrapper = mount(BaseCard, { props: { flat: true, hover: true } })

    expect(wrapper.classes()).toContain('card-flat')
    expect(wrapper.classes()).toContain('card-hover')
  })

  it('renders the chosen tag via the as prop while keeping .card', () => {
    const wrapper = mount(BaseCard, { props: { as: 'article' } })

    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.classes()).toContain('card')
  })

  it('renders the default slot content', () => {
    const wrapper = mount(BaseCard, { slots: { default: 'Контент карточки' } })

    expect(wrapper.text()).toContain('Контент карточки')
  })

  it('forwards fallthrough attributes onto the root element', () => {
    const wrapper = mount(BaseCard, { attrs: { id: 'panel', 'data-test': 'panel' } })

    expect(wrapper.attributes('id')).toBe('panel')
    expect(wrapper.attributes('data-test')).toBe('panel')
  })
})

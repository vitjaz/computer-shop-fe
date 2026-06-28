import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseEmptyState from '../BaseEmptyState.vue'

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseEmptyState', () => {
  it('renders .empty-state with the title', () => {
    wrapper = mount(BaseEmptyState, {
      props: { title: 'Ничего не найдено' },
    })

    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-title').text()).toBe('Ничего не найдено')
  })

  it('renders the description when provided', () => {
    wrapper = mount(BaseEmptyState, {
      props: { title: 'Пусто', description: 'Измените фильтры поиска.' },
    })

    expect(wrapper.find('.empty-description').exists()).toBe(true)
    expect(wrapper.find('.empty-description').text()).toBe('Измените фильтры поиска.')
  })

  it('omits the description block when not provided', () => {
    wrapper = mount(BaseEmptyState, { props: { title: 'Пусто' } })

    expect(wrapper.find('.empty-description').exists()).toBe(false)
  })

  it('renders BaseIcon inside .empty-icon when the icon prop is provided', () => {
    wrapper = mount(BaseEmptyState, {
      props: { title: 'Пусто', icon: 'search' },
    })

    const iconWrap = wrapper.find('.empty-icon')
    expect(iconWrap.exists()).toBe(true)
    expect(iconWrap.find('svg').exists()).toBe(true)
  })

  it('omits .empty-icon when neither icon prop nor icon slot is provided', () => {
    wrapper = mount(BaseEmptyState, { props: { title: 'Пусто' } })

    expect(wrapper.find('.empty-icon').exists()).toBe(false)
  })

  it('renders the icon slot override in .empty-icon when provided', () => {
    wrapper = mount(BaseEmptyState, {
      props: { title: 'Пусто' },
      slots: { icon: '<span data-test="custom-icon">∅</span>' },
    })

    expect(wrapper.find('.empty-icon').exists()).toBe(true)
    expect(wrapper.find('[data-test="custom-icon"]').exists()).toBe(true)
    expect(wrapper.find('.empty-icon svg').exists()).toBe(false)
  })

  it('renders the action slot inside .empty-action when provided', () => {
    wrapper = mount(BaseEmptyState, {
      props: { title: 'Пусто' },
      slots: { action: '<button data-test="act">Очистить</button>' },
    })

    const action = wrapper.find('.empty-action')
    expect(action.exists()).toBe(true)
    expect(action.find('[data-test="act"]').exists()).toBe(true)
  })

  it('omits .empty-action when the action slot is not provided', () => {
    wrapper = mount(BaseEmptyState, { props: { title: 'Пусто' } })

    expect(wrapper.find('.empty-action').exists()).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseIconButton from '../BaseIconButton.vue'

describe('BaseIconButton', () => {
  it('uses the required label prop as aria-label and composes .iconbtn', () => {
    const wrapper = mount(BaseIconButton, { props: { label: 'Корзина' } })

    expect(wrapper.classes()).toContain('iconbtn')
    expect(wrapper.attributes('aria-label')).toBe('Корзина')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('toggles aria-pressed with the pressed prop', () => {
    expect(
      mount(BaseIconButton, { props: { label: 'Избранное', pressed: true } }).attributes(
        'aria-pressed',
      ),
    ).toBe('true')
    expect(
      mount(BaseIconButton, { props: { label: 'Избранное' } }).attributes('aria-pressed'),
    ).toBe('false')
  })

  it('reflects the disabled prop', () => {
    const wrapper = mount(BaseIconButton, { props: { label: 'Сравнение', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('reflects the type attribute', () => {
    const wrapper = mount(BaseIconButton, { props: { label: 'x', type: 'submit' } })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders the icon slot', () => {
    const wrapper = mount(BaseIconButton, {
      props: { label: 'Поиск' },
      slots: { icon: '<svg data-test="icon" />' },
    })

    expect(wrapper.find('[data-test="icon"]').exists()).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseToast from '../BaseToast.vue'

describe('BaseToast', () => {
  it('renders .toast with the default info variant class', () => {
    const wrapper = mount(BaseToast, { props: { message: 'привет' } })

    expect(wrapper.classes()).toContain('toast')
    expect(wrapper.classes()).toContain('toast--info')
  })

  it('applies the matching toast--<variant> class for every variant', () => {
    const variants = ['info', 'success', 'error'] as const

    for (const variant of variants) {
      const wrapper = mount(BaseToast, { props: { message: 'm', variant } })
      expect(wrapper.classes()).toContain(`toast--${variant}`)
    }
  })

  it('has role=status so AT announce it politely', () => {
    const wrapper = mount(BaseToast, { props: { message: 'm' } })

    expect(wrapper.attributes('role')).toBe('status')
  })

  it('renders the message inside .toast-body', () => {
    const wrapper = mount(BaseToast, { props: { message: 'Купон применён' } })

    expect(wrapper.find('.toast-body').text()).toBe('Купон применён')
  })

  it('renders a close button with aria-label="Закрыть" and the × glyph', () => {
    const wrapper = mount(BaseToast, { props: { message: 'm' } })

    const close = wrapper.find('.toast-close')
    expect(close.exists()).toBe(true)
    expect(close.attributes('aria-label')).toBe('Закрыть')
    expect(close.text()).toContain('×')
  })

  it('emits dismiss with the id when the close button is clicked', async () => {
    const wrapper = mount(BaseToast, { props: { message: 'm', id: 7 } })

    await wrapper.find('.toast-close').trigger('click')

    expect(wrapper.emitted('dismiss')).toEqual([[7]])
  })

  it('emits dismiss with undefined when no id prop is provided', async () => {
    const wrapper = mount(BaseToast, { props: { message: 'm' } })

    await wrapper.find('.toast-close').trigger('click')

    expect(wrapper.emitted('dismiss')).toEqual([[undefined]])
  })

  it('keeps body before close button in document order', () => {
    const wrapper = mount(BaseToast, { props: { message: 'тело' } })

    const html = wrapper.html()
    expect(html.indexOf('тело')).toBeLessThan(html.indexOf('toast-close'))
  })
})

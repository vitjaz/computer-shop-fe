import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseAlert from '../BaseAlert.vue'

describe('BaseAlert', () => {
  it('renders .alert with the default info variant class', () => {
    const wrapper = mount(BaseAlert)

    expect(wrapper.classes()).toContain('alert')
    expect(wrapper.classes()).toContain('alert-info')
  })

  it('applies the matching alert-<variant> class for every variant', () => {
    const variants = ['info', 'success', 'warning', 'danger'] as const

    for (const variant of variants) {
      const wrapper = mount(BaseAlert, { props: { variant } })
      expect(wrapper.classes()).toContain(`alert-${variant}`)
    }
  })

  it('renders the message body in .alert-body via the default slot', () => {
    const wrapper = mount(BaseAlert, { slots: { default: 'Купон применён' } })

    expect(wrapper.find('.alert-body').text()).toBe('Купон применён')
  })

  it('renders .alert-title when the title prop is set', () => {
    const wrapper = mount(BaseAlert, {
      props: { title: 'Готово' },
      slots: { default: 'body' },
    })

    const title = wrapper.find('.alert-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Готово')
  })

  it('omits .alert-title when no title prop is given', () => {
    const wrapper = mount(BaseAlert, { slots: { default: 'body' } })

    expect(wrapper.find('.alert-title').exists()).toBe(false)
  })

  it('renders the icon slot inside .alert-icon', () => {
    const wrapper = mount(BaseAlert, {
      slots: { icon: '<svg data-test="icon" />' },
    })

    expect(wrapper.find('.alert-icon [data-test="icon"]').exists()).toBe(true)
  })

  it('always renders the .alert-icon wrapper (empty when slot omitted)', () => {
    const wrapper = mount(BaseAlert)

    expect(wrapper.find('.alert-icon').exists()).toBe(true)
    expect(wrapper.find('.alert-icon').element.children.length).toBe(0)
  })

  it('renders .alert-action only when the action slot is provided', () => {
    const withAction = mount(BaseAlert, {
      slots: { action: '<button data-test="dismiss">Скрыть</button>' },
    })
    expect(withAction.find('.alert-action').exists()).toBe(true)
    expect(withAction.find('.alert-action [data-test="dismiss"]').exists()).toBe(true)

    const withoutAction = mount(BaseAlert)
    expect(withoutAction.find('.alert-action').exists()).toBe(false)
  })

  it('keeps icon, body and action in document order', () => {
    const wrapper = mount(BaseAlert, {
      props: { title: 'T' },
      slots: {
        icon: '<i data-test="icon">i</i>',
        default: '<span data-test="msg">m</span>',
        action: '<button data-test="act">a</button>',
      },
    })

    const html = wrapper.html()
    expect(html.indexOf('data-test="icon"')).toBeLessThan(html.indexOf('data-test="msg"'))
    expect(html.indexOf('data-test="msg"')).toBeLessThan(html.indexOf('data-test="act"'))
  })

  it('does not crash when no slots are provided', () => {
    expect(() => mount(BaseAlert, { props: { variant: 'success' } })).not.toThrow()
  })
})

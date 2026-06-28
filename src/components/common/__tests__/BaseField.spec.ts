import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseField from '../BaseField.vue'

describe('BaseField', () => {
  it('renders a .field wrapper and the default slot inside it', () => {
    const wrapper = mount(BaseField, {
      slots: { default: '<input class="control" />' },
    })

    const field = wrapper.find('.field')
    expect(field.exists()).toBe(true)
    expect(field.find('.control').exists()).toBe(true)
  })

  it('renders a label bound to htmlFor when both are provided', () => {
    const wrapper = mount(BaseField, {
      props: { label: 'Email', htmlFor: 'email' },
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.attributes('for')).toBe('email')
    expect(label.text()).toBe('Email')
  })

  it('does not render a label when the prop is absent', () => {
    const wrapper = mount(BaseField)

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('appends a required marker when required is true', () => {
    const wrapper = mount(BaseField, {
      props: { label: 'Name', required: true },
    })

    expect(wrapper.find('label').text()).toContain('*')
  })

  it('omits the required marker when required is false', () => {
    const wrapper = mount(BaseField, { props: { label: 'Name' } })

    expect(wrapper.find('label').text()).not.toContain('*')
  })

  it('renders help text in .field-help', () => {
    const wrapper = mount(BaseField, { props: { help: 'Hint here' } })

    const help = wrapper.find('.field-help')
    expect(help.exists()).toBe(true)
    expect(help.text()).toBe('Hint here')
  })

  it('renders the error, replaces help, flags the field, and colors it as danger', () => {
    const wrapper = mount(BaseField, {
      props: { help: 'Hint here', error: 'Something broke' },
    })

    expect(wrapper.find('.field').classes()).toContain('has-error')
    const help = wrapper.find('.field-help')
    expect(help.exists()).toBe(true)
    expect(help.classes()).toContain('field-error')
    expect(help.text()).toBe('Something broke')
  })

  it('renders no help/error line when neither is provided', () => {
    const wrapper = mount(BaseField)

    expect(wrapper.find('.field-help').exists()).toBe(false)
  })
})

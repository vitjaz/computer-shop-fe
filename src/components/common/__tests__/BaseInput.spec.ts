import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })

    await wrapper.find('input').setValue('hello')

    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])
  })

  it('reflects the modelValue prop on the input', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'prefilled' } })

    expect(wrapper.find('input').element.value).toBe('prefilled')
  })

  it('updates the displayed value when the prop changes', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'a' } })

    await wrapper.setProps({ modelValue: 'b' })
    expect(wrapper.find('input').element.value).toBe('b')
  })

  it('defaults type to text and reflects a custom type', () => {
    const plain = mount(BaseInput, { props: { modelValue: '' } })
    expect(plain.find('input').attributes('type')).toBe('text')

    const numeric = mount(BaseInput, { props: { modelValue: '', type: 'number' } })
    expect(numeric.find('input').attributes('type')).toBe('number')
  })

  it('reflects placeholder, id and disabled', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        placeholder: 'Type…',
        id: 'email',
        disabled: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Type…')
    expect(input.attributes('id')).toBe('email')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('sets aria-invalid only when invalid is true', () => {
    const valid = mount(BaseInput, { props: { modelValue: '' } })
    expect(valid.find('input').attributes('aria-invalid')).toBeUndefined()

    const invalid = mount(BaseInput, { props: { modelValue: '', invalid: true } })
    expect(invalid.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('renders a bare input with the input class when no affix slots are used', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })

    expect(wrapper.find('input').classes()).toContain('input')
    expect(wrapper.find('.input-affix').exists()).toBe(false)
  })

  it('flanks the input with prefix and suffix slots inside the affix wrapper', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' },
      slots: { prefix: '<span class="pre">P</span>', suffix: '<span class="suf">S</span>' },
    })

    const affix = wrapper.find('.input-affix')
    expect(affix.exists()).toBe(true)
    const html = affix.html()
    expect(html.indexOf('class="pre"')).toBeLessThan(html.indexOf('class="input"'))
    expect(html.indexOf('class="input"')).toBeLessThan(html.indexOf('class="suf"'))
  })

  it('forwards fallthrough attributes onto the input', () => {
    const wrapper = mount(BaseInput, {
      props: { modelValue: '' },
      attrs: { name: 'username', inputmode: 'numeric' },
    })

    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('username')
    expect(input.attributes('inputmode')).toBe('numeric')
  })
})

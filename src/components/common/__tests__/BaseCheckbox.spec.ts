import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseCheckbox from '../BaseCheckbox.vue'

describe('BaseCheckbox', () => {
  it('renders the input immediately followed by the .box span for the sibling selector', () => {
    const wrapper = mount(BaseCheckbox, { props: { modelValue: false } })

    const input = wrapper.find('input[type="checkbox"]')
    expect(input.exists()).toBe(true)
    expect(input.element.nextElementSibling?.classList.contains('box')).toBe(true)
  })

  it('emits true when toggled from a false modelValue', async () => {
    const wrapper = mount(BaseCheckbox, { props: { modelValue: false } })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('emits false when toggled from a true modelValue', async () => {
    const wrapper = mount(BaseCheckbox, { props: { modelValue: true } })

    await wrapper.find('input').setValue(false)

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('reflects the modelValue prop on the input checked state', () => {
    const off = mount(BaseCheckbox, { props: { modelValue: false } })
    expect(off.find('input').element.checked).toBe(false)

    const on = mount(BaseCheckbox, { props: { modelValue: true } })
    expect(on.find('input').element.checked).toBe(true)
  })

  it('adds the disabled class and the disabled attribute when disabled', () => {
    const wrapper = mount(BaseCheckbox, {
      props: { modelValue: false, disabled: true },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('renders the .count span only when count is provided', () => {
    const withCount = mount(BaseCheckbox, {
      props: { modelValue: false, count: 12 },
    })
    expect(withCount.find('.count').exists()).toBe(true)
    expect(withCount.find('.count').text()).toBe('12')

    const withoutCount = mount(BaseCheckbox, { props: { modelValue: false } })
    expect(withoutCount.find('.count').exists()).toBe(false)
  })

  it('renders the label text and wires the id onto the input', () => {
    const wrapper = mount(BaseCheckbox, {
      props: { modelValue: false, label: 'В наличии', id: 'in-stock' },
    })

    expect(wrapper.text()).toContain('В наличии')
    expect(wrapper.find('input').attributes('id')).toBe('in-stock')
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(BaseCheckbox, {
      props: { modelValue: false, disabled: true },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

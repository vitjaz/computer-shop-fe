import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseQty from '../BaseQty.vue'

describe('BaseQty', () => {
  it('emits update:modelValue and change with the decremented value', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 5 } })

    const [dec] = wrapper.findAll('button')
    await dec!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
    expect(wrapper.emitted('change')).toEqual([[4]])
  })

  it('emits update:modelValue and change with the incremented value', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 5 } })

    const buttons = wrapper.findAll('button')
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[6]])
    expect(wrapper.emitted('change')).toEqual([[6]])
  })

  it('reflects the modelValue prop on the input', () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 7 } })

    expect(wrapper.find('input').element.value).toBe('7')
  })

  it('uses the custom step when incrementing and decrementing', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 10, step: 5 } })

    const [dec, inc] = wrapper.findAll('button')
    await dec!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])

    await inc!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[5], [15]])
  })

  it('disables the decrement button at the min', () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 1, min: 1 } })

    expect(wrapper.findAll('button')[0]!.attributes('disabled')).toBeDefined()
  })

  it('clamps to the min when a step would overshoot below it', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 3, min: 1, step: 5 } })

    const [dec] = wrapper.findAll('button')
    expect(dec!.attributes('disabled')).toBeUndefined()
    await dec!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('disables the increment button at the max', () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 3, max: 3 } })

    expect(wrapper.findAll('button')[1]!.attributes('disabled')).toBeDefined()
  })

  it('clamps to the max when a step would overshoot above it', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 7, max: 10, step: 5 } })

    const buttons = wrapper.findAll('button')
    expect(buttons[1]!.attributes('disabled')).toBeUndefined()
    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
  })

  it('emits a clamped value when a number above the max is typed', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 1, max: 5 } })

    await wrapper.find('input').setValue('99')

    expect(wrapper.emitted('update:modelValue')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5]])
  })

  it('does not crash or emit on empty or non-numeric input', async () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 2 } })

    await wrapper.find('input').setValue('')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('input').setValue('abc')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies the qty-sm and qty-lg classes for the size prop', () => {
    const sm = mount(BaseQty, { props: { modelValue: 1, size: 'sm' } })
    expect(sm.find('.qty').classes()).toContain('qty-sm')

    const lg = mount(BaseQty, { props: { modelValue: 1, size: 'lg' } })
    expect(lg.find('.qty').classes()).toContain('qty-lg')
  })

  it('omits size classes by default', () => {
    const wrapper = mount(BaseQty, { props: { modelValue: 1 } })

    const classes = wrapper.find('.qty').classes()
    expect(classes).not.toContain('qty-sm')
    expect(classes).not.toContain('qty-lg')
  })
})

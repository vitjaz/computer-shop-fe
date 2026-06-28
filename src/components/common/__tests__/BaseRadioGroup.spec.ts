import { describe, it, expect, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { mount } from '@vue/test-utils'

import BaseRadioGroup from '../BaseRadioGroup.vue'

const baseCss = readFileSync(
  resolve(process.cwd(), 'src/assets/styles/base.css'),
  'utf8',
)

const options = [
  { value: 'courier', label: 'Курьер', price: '390 ₽' },
  { value: 'pickup', label: 'Самовывоз', price: 'Бесплатно' },
  { value: 'post', label: 'Почта', disabled: true },
]

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseRadioGroup', () => {
  it('renders .radio-list with role=radiogroup and a .radio per option', () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'courier', options } })

    const list = wrapper.find('.radio-list')
    expect(list.exists()).toBe(true)
    expect(list.attributes('role')).toBe('radiogroup')
    expect(list.findAll('.radio')).toHaveLength(3)
  })

  it('checks the input matching modelValue and toggles .active on its label', () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'pickup', options } })

    const labels = wrapper.findAll('.radio')
    const inputs = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
    expect(inputs[1]!.element.checked).toBe(true)
    expect(labels[1]!.classes()).toContain('active')
    expect(inputs[0]!.element.checked).toBe(false)
    expect(labels[0]!.classes()).not.toContain('active')
  })

  it('emits update:modelValue when a non-active option is clicked', async () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'courier', options } })

    await wrapper.findAll('input[type="radio"]')[1]!.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toEqual([['pickup']])
  })

  it('renders the .price-tag span only when price is provided', () => {
    wrapper = mount(BaseRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { value: 'a', label: 'A', price: '100 ₽' },
          { value: 'b', label: 'B' },
        ],
      },
    })

    const labels = wrapper.findAll('.radio')
    expect(labels[0]!.find('.price-tag').exists()).toBe(true)
    expect(labels[0]!.find('.price-tag').text()).toBe('100 ₽')
    expect(labels[1]!.find('.price-tag').exists()).toBe(false)
  })

  it('does not allow selecting a disabled option', async () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'courier', options } })

    const disabled = wrapper.findAll('input[type="radio"]')[2]!
    expect(disabled.attributes('disabled')).toBeDefined()

    await disabled.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits the next option on ArrowDown and the previous on ArrowUp', async () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'courier', options } })

    await wrapper.find('.radio-list').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['pickup']])

    await wrapper.setProps({ modelValue: 'pickup' })
    await wrapper.find('.radio-list').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['pickup'], ['courier']])
  })

  it('moves selection with ArrowRight/ArrowLeft as well', async () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'pickup', options } })

    await wrapper.find('.radio-list').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['courier']])
  })

  it('skips a disabled option when navigating with arrows', async () => {
    wrapper = mount(BaseRadioGroup, {
      props: {
        modelValue: 'pickup',
        options: [
          { value: 'courier', label: 'Курьер' },
          { value: 'pickup', label: 'Самовывоз' },
          { value: 'post', label: 'Почта', disabled: true },
          { value: 'express', label: 'Экспресс' },
        ],
      },
    })

    await wrapper.find('.radio-list').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['express']])
  })

  it('wraps around from first to last on ArrowUp', async () => {
    wrapper = mount(BaseRadioGroup, { props: { modelValue: 'courier', options } })

    await wrapper.find('.radio-list').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toEqual([['pickup']])
  })

  it('uses the provided name attribute on every input when passed', () => {
    wrapper = mount(BaseRadioGroup, {
      props: { modelValue: 'courier', options, name: 'delivery' },
    })

    const names = wrapper.findAll('input[type="radio"]').map((i) => i.attributes('name'))
    expect(names).toEqual(['delivery', 'delivery', 'delivery'])
  })

  it('tokenizes .radio.active background: zero raw rgba(201,100,66,…) in base.css', () => {
    expect(baseCss).not.toMatch(/rgba\(\s*201\s*,\s*100\s*,\s*66/i)
    expect(baseCss).toContain('.radio.active')
    expect(baseCss).toMatch(/\.radio\.active\s*\{[^}]*var\(--accent-soft\)/)
  })
})

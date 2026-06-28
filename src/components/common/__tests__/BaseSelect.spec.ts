import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseSelect from '../BaseSelect.vue'

const options = [
  { value: 'cpu', label: 'Процессоры' },
  { value: 'gpu', label: 'Видеокарты' },
  { value: 'ram', label: 'Память' },
]

describe('BaseSelect', () => {
  it('renders an option per entry', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'cpu', options },
    })

    const items = wrapper.findAll('option')
    expect(items).toHaveLength(3)
    expect(items[1]!.text()).toBe('Видеокарты')
    expect(items[1]!.attributes('value')).toBe('gpu')
  })

  it('emits update:modelValue with the new value on change', async () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'cpu', options },
    })

    await wrapper.find('select').setValue('gpu')

    expect(wrapper.emitted('update:modelValue')).toEqual([['gpu']])
  })

  it('selects the option whose value matches modelValue', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'ram', options },
    })

    expect(wrapper.find('select').element.value).toBe('ram')
  })

  it('reflects the disabled prop', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'cpu', options, disabled: true },
    })

    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('renders a disabled placeholder option when placeholder is provided', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: '', options, placeholder: 'Выберите…' },
    })

    const placeholder = wrapper.find('option')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.attributes('disabled')).toBeDefined()
    expect(placeholder.attributes('value')).toBe('')
    expect(placeholder.text()).toBe('Выберите…')
  })

  it('omits the placeholder option when not configured', () => {
    const wrapper = mount(BaseSelect, {
      props: { modelValue: 'cpu', options },
    })

    expect(wrapper.findAll('option')).toHaveLength(3)
  })
})

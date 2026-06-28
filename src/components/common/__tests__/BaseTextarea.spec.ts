import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseTextarea from '../BaseTextarea.vue'

describe('BaseTextarea', () => {
  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(BaseTextarea, { props: { modelValue: '' } })

    await wrapper.find('textarea').setValue('multi\nline')

    expect(wrapper.emitted('update:modelValue')).toEqual([['multi\nline']])
  })

  it('reflects the modelValue prop on the textarea', () => {
    const wrapper = mount(BaseTextarea, { props: { modelValue: 'init' } })

    expect(wrapper.find('textarea').element.value).toBe('init')
  })

  it('applies the textarea class', () => {
    const wrapper = mount(BaseTextarea, { props: { modelValue: '' } })

    expect(wrapper.find('textarea').classes()).toContain('textarea')
  })

  it('reflects placeholder, id, disabled and rows', () => {
    const wrapper = mount(BaseTextarea, {
      props: {
        modelValue: '',
        placeholder: 'Leave a note',
        id: 'notes',
        disabled: true,
        rows: 5,
      },
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('Leave a note')
    expect(textarea.attributes('id')).toBe('notes')
    expect(textarea.attributes('disabled')).toBeDefined()
    expect(textarea.attributes('rows')).toBe('5')
  })

  it('omits the rows attribute when not provided', () => {
    const wrapper = mount(BaseTextarea, { props: { modelValue: '' } })

    expect(wrapper.find('textarea').attributes('rows')).toBeUndefined()
  })
})

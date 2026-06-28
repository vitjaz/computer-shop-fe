import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseSegmented from '../BaseSegmented.vue'

const options = [
  { value: 'grid', label: 'Сетка', icon: 'compare' },
  { value: 'list', label: 'Список', icon: 'chevron-down' },
  { value: 'map', label: 'Карта' },
]

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseSegmented', () => {
  it('renders a .seg container with role=group and aria-label', () => {
    wrapper = mount(BaseSegmented, {
      props: { modelValue: 'grid', options },
    })

    const seg = wrapper.find('.seg')
    expect(seg.exists()).toBe(true)
    expect(seg.attributes('role')).toBe('group')
    expect(seg.attributes('aria-label')).toBe('Сегментированный переключатель')
  })

  it('renders a button per option', () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'grid', options } })

    expect(wrapper.findAll('.seg button')).toHaveLength(3)
  })

  it('applies .active and aria-pressed=true only to the selected option', () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'list', options } })

    const buttons = wrapper.findAll('.seg button')
    expect(buttons[1]!.classes()).toContain('active')
    expect(buttons[1]!.attributes('aria-pressed')).toBe('true')
    expect(buttons[0]!.classes()).not.toContain('active')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('false')
  })

  it('emits update:modelValue when a non-active option is clicked', async () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'grid', options } })

    await wrapper.findAll('.seg button')[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['map']])
  })

  it('does not emit when the active option is clicked', async () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'grid', options } })

    await wrapper.findAll('.seg button')[0]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders labels in the default text variant', () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'grid', options } })

    const buttons = wrapper.findAll('.seg button')
    expect(buttons[0]!.text()).toContain('Сетка')
    expect(buttons[2]!.text()).toContain('Карта')
  })

  it('hides the label span in the icon variant but still renders the icon', () => {
    wrapper = mount(BaseSegmented, {
      props: { modelValue: 'grid', options, variant: 'icon' },
    })

    const buttons = wrapper.findAll('.seg button')
    expect(buttons[0]!.text()).toBe('')
    expect(buttons[0]!.find('svg').exists()).toBe(true)
  })

  it('uses the provided aria-label override', () => {
    wrapper = mount(BaseSegmented, {
      props: { modelValue: 'grid', options, ariaLabel: 'Вид каталога' },
    })

    expect(wrapper.find('.seg').attributes('aria-label')).toBe('Вид каталога')
  })

  it('reflects a new active option when modelValue changes', async () => {
    wrapper = mount(BaseSegmented, { props: { modelValue: 'grid', options } })

    expect(wrapper.findAll('.seg button')[0]!.classes()).toContain('active')
    await wrapper.setProps({ modelValue: 'map' })
    expect(wrapper.findAll('.seg button')[2]!.classes()).toContain('active')
    expect(wrapper.findAll('.seg button')[0]!.classes()).not.toContain('active')
  })
})

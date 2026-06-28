import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('applies btn + btn-primary by default and defaults type to button', () => {
    const wrapper = mount(BaseButton)

    expect(wrapper.classes()).toContain('btn')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('applies the matching btn-<variant> class for every variant', () => {
    const variants = ['secondary', 'outline', 'ghost'] as const

    for (const variant of variants) {
      const wrapper = mount(BaseButton, { props: { variant } })
      expect(wrapper.classes()).toContain(`btn-${variant}`)
      expect(wrapper.classes()).not.toContain('btn-primary')
    }
  })

  it('toggles btn-sm only when size is sm', () => {
    expect(mount(BaseButton, { props: { size: 'sm' } }).classes()).toContain('btn-sm')
    expect(mount(BaseButton).classes()).not.toContain('btn-sm')
  })

  it('toggles btn-block with the block prop', () => {
    expect(mount(BaseButton, { props: { block: true } }).classes()).toContain('btn-block')
    expect(mount(BaseButton).classes()).not.toContain('btn-block')
  })

  it('toggles btn-arrow with the arrow prop', () => {
    expect(mount(BaseButton, { props: { arrow: true } }).classes()).toContain('btn-arrow')
    expect(mount(BaseButton).classes()).not.toContain('btn-arrow')
  })

  it('reflects the type attribute', () => {
    expect(mount(BaseButton, { props: { type: 'submit' } }).attributes('type')).toBe('submit')
    expect(mount(BaseButton, { props: { type: 'reset' } }).attributes('type')).toBe('reset')
  })

  it('sets the disabled attribute when disabled is true', () => {
    const wrapper = mount(BaseButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables the button while loading', () => {
    const wrapper = mount(BaseButton, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('renders the icon slot before the default slot', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        icon: '<span class="i">icon</span>',
        default: '<span class="label">label</span>',
      },
    })

    const html = wrapper.html()
    expect(html.indexOf('class="i"')).toBeLessThan(html.indexOf('class="label"'))
  })

  it('forwards fallthrough attributes onto the root button', () => {
    const wrapper = mount(BaseButton, {
      attrs: { id: 'cta', 'data-test': 'cta' },
      slots: { default: 'Купить' },
    })

    expect(wrapper.attributes('id')).toBe('cta')
    expect(wrapper.attributes('data-test')).toBe('cta')
  })
})

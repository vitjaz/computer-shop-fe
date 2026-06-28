import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseDropdown from '../BaseDropdown.vue'

const options = [
  { value: 'cpu', label: 'Процессоры' },
  { value: 'gpu', label: 'Видеокарты' },
  { value: 'ram', label: 'Память' },
  { value: 'mb', label: 'Материнские платы', disabled: true },
]

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

describe('BaseDropdown', () => {
  it('renders .dropdown with the default trigger button', () => {
    wrapper = mount(BaseDropdown, { props: { options } })

    expect(wrapper.classes()).toContain('dropdown')
    expect(wrapper.find('.dropdown-trigger').exists()).toBe(true)
    expect(wrapper.find('.dropdown-trigger').element.tagName).toBe('BUTTON')
  })

  it('does not render the menu when closed', () => {
    wrapper = mount(BaseDropdown, { props: { options } })

    expect(wrapper.find('.dropdown-menu').exists()).toBe(false)
  })

  it('renders role=listbox menu with role=option items when open', () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    const menu = wrapper.find('.dropdown-menu')
    expect(menu.exists()).toBe(true)
    expect(menu.attributes('role')).toBe('listbox')
    expect(menu.findAll('[role="option"]')).toHaveLength(4)
  })

  it('links trigger and menu via aria-haspopup, aria-expanded, aria-controls', () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    const trigger = wrapper.find('.dropdown-trigger')
    const menu = wrapper.find('.dropdown-menu')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(menu.attributes('id'))
  })

  it('reflects aria-expanded=false when closed', () => {
    wrapper = mount(BaseDropdown, { props: { options } })

    expect(wrapper.find('.dropdown-trigger').attributes('aria-expanded')).toBe('false')
  })

  it('shows the selected option label in the default trigger', () => {
    wrapper = mount(BaseDropdown, {
      props: { options, modelValue: 'gpu' },
    })

    expect(wrapper.find('.dropdown-trigger').text()).toContain('Видеокарты')
  })

  it('shows the placeholder when no value is selected', () => {
    wrapper = mount(BaseDropdown, {
      props: { options, placeholder: 'Выберите категорию' },
    })

    expect(wrapper.find('.dropdown-trigger').text()).toContain('Выберите категорию')
  })

  it('emits update:open true when the trigger is clicked while closed', async () => {
    wrapper = mount(BaseDropdown, { props: { options } })

    await wrapper.find('.dropdown-trigger').trigger('click')

    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('emits update:open false when the trigger is clicked while open', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-trigger').trigger('click')

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('emits update:modelValue with the option value and closes when an item is clicked', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.findAll('[role="option"]')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['gpu']])
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('marks the selected option with aria-selected=true', () => {
    wrapper = mount(BaseDropdown, {
      props: { options, open: true, modelValue: 'ram' },
    })

    const selected = wrapper.findAll('[role="option"]')[2]!
    expect(selected.attributes('aria-selected')).toBe('true')
  })

  it('marks disabled options with aria-disabled and skips them on selection', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    const disabled = wrapper.findAll('[role="option"]')[3]!
    expect(disabled.attributes('aria-disabled')).toBe('true')

    await disabled.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('closes when Escape is pressed while open', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('opens when ArrowDown is pressed on the trigger while closed', async () => {
    wrapper = mount(BaseDropdown, { props: { options } })

    await wrapper.find('.dropdown-trigger').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('moves the active item down with ArrowDown and up with ArrowUp', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[data-active="true"]').text()).toBe('Видеокарты')

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-active="true"]').text()).toBe('Процессоры')
  })

  it('wraps the active item from first to last on ArrowUp', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-active="true"]').text()).toBe('Память')
  })

  it('skips disabled items while navigating with arrows', async () => {
    wrapper = mount(BaseDropdown, {
      props: { options, open: true, modelValue: 'ram' },
    })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[data-active="true"]').text()).toBe('Процессоры')

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-active="true"]').text()).toBe('Память')
  })

  it('selects the active item and closes on Enter', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['gpu']])
    expect(wrapper.emitted('update:open')).toContainEqual([false])
  })

  it('closes when Tab is pressed while open', async () => {
    wrapper = mount(BaseDropdown, { props: { options, open: true } })

    await wrapper.find('.dropdown-menu').trigger('keydown', { key: 'Tab' })

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('closes when a click lands outside the dropdown', async () => {
    wrapper = mount(BaseDropdown, {
      props: { options, open: true },
      attachTo: document.body,
    })

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('renders a trigger slot override with open/label/toggle scope', async () => {
    wrapper = mount(BaseDropdown, {
      props: { options, modelValue: 'gpu' },
      slots: {
        trigger: '<button data-test="t" @click="toggle">{{ label }} / {{ open }}</button>',
      },
    })

    const trigger = wrapper.find('[data-test="t"]')
    expect(trigger.text()).toBe('Видеокарты / false')

    await trigger.trigger('click')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseTooltip from '../BaseTooltip.vue'

type Placement = 'top' | 'right' | 'bottom' | 'left'

function mountTooltip(props: { content?: string; placement?: Placement } = {}, slot = 'наведи') {
  return mount(BaseTooltip, {
    props: { content: 'подсказка', ...props },
    slots: { default: `<button data-test="trig">${slot}</button>` },
  })
}

describe('BaseTooltip', () => {
  it('renders the .tooltip-trigger wrapper containing the slotted trigger', () => {
    const wrapper = mountTooltip()

    const trigger = wrapper.find('.tooltip-trigger')
    expect(trigger.exists()).toBe(true)
    expect(trigger.find('[data-test="trig"]').exists()).toBe(true)
  })

  it('renders a .tooltip sibling with role=tooltip and a non-empty id', () => {
    const wrapper = mountTooltip({ content: 'подсказка' })

    const tip = wrapper.find('.tooltip')
    expect(tip.exists()).toBe(true)
    expect(tip.attributes('role')).toBe('tooltip')
    expect(tip.attributes('id')).toBeTruthy()
  })

  it('renders the content text inside the tooltip', () => {
    const wrapper = mountTooltip({ content: 'Добавить в корзину' })

    expect(wrapper.find('.tooltip').text()).toBe('Добавить в корзину')
  })

  it('is hidden by default (data-visible="false")', () => {
    const wrapper = mountTooltip()

    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('false')
  })

  it('applies tooltip--top by default', () => {
    const wrapper = mountTooltip()

    expect(wrapper.find('.tooltip').classes()).toContain('tooltip--top')
  })

  it('applies the matching tooltip--<placement> class', () => {
    const placements = ['top', 'right', 'bottom', 'left'] as const

    for (const placement of placements) {
      const wrapper = mountTooltip({ placement })
      expect(wrapper.find('.tooltip').classes()).toContain(`tooltip--${placement}`)
    }
  })

  it('links the wrapper to the tooltip via aria-describedby', () => {
    const wrapper = mountTooltip({ content: 'c' })

    const trigger = wrapper.find('.tooltip-trigger')
    const tipId = wrapper.find('.tooltip').attributes('id')

    expect(trigger.attributes('aria-describedby')).toBe(tipId)
  })

  it('shows on mouseenter and hides on mouseleave', async () => {
    const wrapper = mountTooltip()

    await wrapper.find('.tooltip-trigger').trigger('mouseenter')
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('true')

    await wrapper.find('.tooltip-trigger').trigger('mouseleave')
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('false')
  })

  it('shows on focusin and hides on focusout', async () => {
    const wrapper = mountTooltip()

    await wrapper.find('.tooltip-trigger').trigger('focusin')
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('true')

    await wrapper.find('.tooltip-trigger').trigger('focusout')
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('false')
  })

  it('hides on Escape when visible', async () => {
    const wrapper = mountTooltip()

    await wrapper.find('.tooltip-trigger').trigger('mouseenter')
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('true')

    await wrapper.find('.tooltip-trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('false')
  })

  it('Escape is a no-op when already hidden', async () => {
    const wrapper = mountTooltip()

    await wrapper.find('.tooltip-trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.tooltip').attributes('data-visible')).toBe('false')
  })

  it('keeps the trigger before the tooltip in document order', () => {
    const wrapper = mountTooltip({ content: 'текст' })

    const html = wrapper.html()
    expect(html.indexOf('data-test="trig"')).toBeLessThan(html.indexOf('текст'))
  })
})

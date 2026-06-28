import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseStepper from '../BaseStepper.vue'

const steps = [
  { label: 'Корзина' },
  { label: 'Доставка' },
  { label: 'Оплата' },
  { label: 'Готово' },
]

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseStepper', () => {
  it('renders .steps > .steps-inner with a .step per item', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 0 } })

    expect(wrapper.find('.steps').exists()).toBe(true)
    expect(wrapper.find('.steps-inner').exists()).toBe(true)
    expect(wrapper.findAll('.step')).toHaveLength(4)
  })

  it('marks the current step with .active and aria-current=step', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 2 } })

    const stepEls = wrapper.findAll('.step')
    expect(stepEls[2]!.classes()).toContain('active')
    expect(stepEls[2]!.attributes('aria-current')).toBe('step')
  })

  it('marks steps before current as .done', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 2 } })

    const stepEls = wrapper.findAll('.step')
    expect(stepEls[0]!.classes()).toContain('done')
    expect(stepEls[1]!.classes()).toContain('done')
  })

  it('leaves steps after current as neither active nor done', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 1 } })

    const stepEls = wrapper.findAll('.step')
    expect(stepEls[2]!.classes()).not.toContain('active')
    expect(stepEls[2]!.classes()).not.toContain('done')
    expect(stepEls[3]!.classes()).not.toContain('active')
    expect(stepEls[3]!.classes()).not.toContain('done')
  })

  it('renders a .steps-sep between each pair of steps (count = steps.length - 1)', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 0 } })

    expect(wrapper.findAll('.steps-sep')).toHaveLength(3)
  })

  it('renders no separator when there is a single step', () => {
    wrapper = mount(BaseStepper, {
      props: { steps: [{ label: 'Один' }], current: 0 },
    })

    expect(wrapper.findAll('.steps-sep')).toHaveLength(0)
  })

  it('renders the step number in .num for pending/active steps', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 1 } })

    const nums = wrapper.findAll('.num')
    expect(nums[0]!.text()).toBe('')
    expect(nums[1]!.text()).toBe('2')
    expect(nums[3]!.text()).toBe('4')
  })

  it('renders a check icon in .num for done steps', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 2 } })

    const doneNum = wrapper.findAll('.num')[0]!
    expect(doneNum.find('svg').exists()).toBe(true)
  })

  it('does not set aria-current=step on non-current steps', () => {
    wrapper = mount(BaseStepper, { props: { steps, current: 0 } })

    const stepEls = wrapper.findAll('.step')
    expect(stepEls[0]!.attributes('aria-current')).toBe('step')
    expect(stepEls[1]!.attributes('aria-current')).toBeUndefined()
  })
})

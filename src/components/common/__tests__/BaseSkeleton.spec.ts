import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseSkeleton from '../BaseSkeleton.vue'

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseSkeleton', () => {
  it('renders a single .skeleton with the default text shape class', () => {
    wrapper = mount(BaseSkeleton)

    const sk = wrapper.find('.skeleton')
    expect(sk.exists()).toBe(true)
    expect(sk.classes()).toContain('skeleton--text')
    expect(wrapper.findAll('.skeleton')).toHaveLength(1)
  })

  it('applies the modifier class matching the shape prop', () => {
    wrapper = mount(BaseSkeleton, { props: { shape: 'circle' } })
    expect(wrapper.find('.skeleton').classes()).toContain('skeleton--circle')

    wrapper?.unmount()
    wrapper = mount(BaseSkeleton, { props: { shape: 'rect' } })
    expect(wrapper.find('.skeleton').classes()).toContain('skeleton--rect')

    wrapper?.unmount()
    wrapper = mount(BaseSkeleton, { props: { shape: 'line' } })
    expect(wrapper.find('.skeleton').classes()).toContain('skeleton--line')
  })

  it('renders N stacked .skeleton elements inside a .skeleton-group when lines > 1', () => {
    wrapper = mount(BaseSkeleton, { props: { shape: 'text', lines: 4 } })

    expect(wrapper.find('.skeleton-group').exists()).toBe(true)
    expect(wrapper.findAll('.skeleton')).toHaveLength(4)
    const classes = wrapper.findAll('.skeleton').map((el) => el.classes())
    expect(classes.every((c) => c.includes('skeleton--text'))).toBe(true)
  })

  it('renders a single element when lines is 1 (default)', () => {
    wrapper = mount(BaseSkeleton)

    expect(wrapper.find('.skeleton-group').exists()).toBe(false)
    expect(wrapper.findAll('.skeleton')).toHaveLength(1)
  })

  it('clamps a zero or negative lines prop to a single element', () => {
    wrapper = mount(BaseSkeleton, { props: { lines: 0 } })
    expect(wrapper.findAll('.skeleton')).toHaveLength(1)
  })

  it('reflects width and height as inline style only when provided', () => {
    wrapper = mount(BaseSkeleton, {
      props: { width: '120px', height: '16px' },
    })

    const style = (wrapper.find('.skeleton').element as HTMLElement).style
    expect(style.width).toBe('120px')
    expect(style.height).toBe('16px')
  })

  it('omits width/height inline style when not provided', () => {
    wrapper = mount(BaseSkeleton)

    const style = (wrapper.find('.skeleton').element as HTMLElement).style
    expect(style.width).toBe('')
    expect(style.height).toBe('')
  })

  it('applies inline width/height to every line in multi-line mode', () => {
    wrapper = mount(BaseSkeleton, {
      props: { lines: 3, width: '100%' },
    })

    const els = wrapper.findAll('.skeleton')
    for (const el of els) {
      expect((el.element as HTMLElement).style.width).toBe('100%')
    }
  })
})

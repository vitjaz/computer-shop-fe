import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseGallery from '../BaseGallery.vue'

const images = ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg']

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('BaseGallery', () => {
  it('renders .gallery with role=group and aria-label', () => {
    wrapper = mount(BaseGallery, { props: { images } })

    const gal = wrapper.find('.gallery')
    expect(gal.exists()).toBe(true)
    expect(gal.attributes('role')).toBe('group')
    expect(gal.attributes('aria-label')).toBe('Галерея')
  })

  it('renders .gallery-main with the active image', () => {
    wrapper = mount(BaseGallery, { props: { images } })

    const main = wrapper.find('.gallery-main')
    expect(main.exists()).toBe(true)
    const img = main.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img/1.jpg')
  })

  it('renders a .thumb per image with .active on the current one', () => {
    wrapper = mount(BaseGallery, { props: { images } })

    const thumbs = wrapper.findAll('.thumb')
    expect(thumbs).toHaveLength(3)
    expect(thumbs[0]!.classes()).toContain('active')
    expect(thumbs[0]!.attributes('aria-current')).toBe('true')
    expect(thumbs[1]!.classes()).not.toContain('active')
  })

  it('shows the image matching activeIndex', () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 2 } })

    expect(wrapper.find('.gallery-main img').attributes('src')).toBe('/img/3.jpg')
    expect(wrapper.findAll('.thumb')[2]!.classes()).toContain('active')
  })

  it('emits update:activeIndex when a thumb is clicked', async () => {
    wrapper = mount(BaseGallery, { props: { images } })

    await wrapper.findAll('.thumb')[2]!.trigger('click')

    expect(wrapper.emitted('update:activeIndex')).toEqual([[2]])
  })

  it('does not emit when the active thumb is clicked', async () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 1 } })

    await wrapper.findAll('.thumb')[1]!.trigger('click')

    expect(wrapper.emitted('update:activeIndex')).toBeUndefined()
  })

  it('emits next index on the next button and previous on the prev button', async () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 0 } })

    const nav = wrapper.findAll('.gallery-nav button')
    await nav[1]!.trigger('click')
    expect(wrapper.emitted('update:activeIndex')).toEqual([[1]])

    await wrapper.setProps({ activeIndex: 1 })
    await wrapper.findAll('.gallery-nav button')[0]!.trigger('click')
    expect(wrapper.emitted('update:activeIndex')).toEqual([[1], [0]])
  })

  it('clamps at boundaries: prev disabled at start, next disabled at end', () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 0 } })
    const nav = wrapper.findAll('.gallery-nav button')
    expect(nav[0]!.attributes('disabled')).toBeDefined()
    expect(nav[1]!.attributes('disabled')).toBeUndefined()

    wrapper?.unmount()
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 2 } })
    const nav2 = wrapper.findAll('.gallery-nav button')
    expect(nav2[1]!.attributes('disabled')).toBeDefined()
    expect(nav2[0]!.attributes('disabled')).toBeUndefined()
  })

  it('does not emit when clicking the disabled prev at the first image', async () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 0 } })

    await wrapper.findAll('.gallery-nav button')[0]!.trigger('click')

    expect(wrapper.emitted('update:activeIndex')).toBeUndefined()
  })

  it('changes index via ArrowLeft/ArrowRight keyboard on the gallery', async () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 1 } })

    await wrapper.find('.gallery').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:activeIndex')).toEqual([[2]])

    await wrapper.setProps({ activeIndex: 1 })
    await wrapper.find('.gallery').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:activeIndex')).toEqual([[2], [0]])
  })

  it('renders a .ph-img placeholder and no nav/thumbs when images is empty', () => {
    wrapper = mount(BaseGallery, { props: { images: [] } })

    expect(wrapper.find('.ph-img').exists()).toBe(true)
    expect(wrapper.find('.gallery-main img').exists()).toBe(false)
    expect(wrapper.find('.gallery-nav').exists()).toBe(false)
    expect(wrapper.find('.thumbs').exists()).toBe(false)
  })

  it('hides nav and thumbs when there is a single image', () => {
    wrapper = mount(BaseGallery, { props: { images: ['/only.jpg'] } })

    expect(wrapper.find('.gallery-main img').attributes('src')).toBe('/only.jpg')
    expect(wrapper.find('.gallery-nav').exists()).toBe(false)
    expect(wrapper.find('.thumbs').exists()).toBe(false)
  })

  it('clamps an out-of-range activeIndex prop to the last available image', () => {
    wrapper = mount(BaseGallery, { props: { images, activeIndex: 99 } })

    expect(wrapper.find('.gallery-main img').attributes('src')).toBe('/img/3.jpg')
  })
})

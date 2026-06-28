import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import BaseToastContainer from '../BaseToastContainer.vue'
import { useToastStore } from '@/stores/toast'

let wrapper: ReturnType<typeof mount> | undefined

function containerEl(): HTMLElement {
  const el = document.body.querySelector('.toast-container')
  if (!el) throw new Error('toast-container not teleported')
  return el as HTMLElement
}

function clickClose(): void {
  const btn = document.body.querySelector('.toast-close')
  if (!btn) throw new Error('no .toast-close rendered')
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

beforeEach(() => {
  setActivePinia(createPinia())
  document.body.innerHTML = ''
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

describe('BaseToastContainer', () => {
  it('teleports a .toast-container wrapper to document.body', () => {
    wrapper = mount(BaseToastContainer)

    expect(document.body.querySelector('.toast-container')).not.toBeNull()
  })

  it('marks the container aria-live="polite"', () => {
    wrapper = mount(BaseToastContainer)

    expect(containerEl().getAttribute('aria-live')).toBe('polite')
  })

  it('renders no toasts when the store is empty', () => {
    wrapper = mount(BaseToastContainer)

    expect(document.body.querySelectorAll('.toast')).toHaveLength(0)
  })

  it('renders one .toast per store item with its message', () => {
    const store = useToastStore()
    store.push('первый')
    store.push('второй', 'success')

    wrapper = mount(BaseToastContainer)

    const toasts = document.body.querySelectorAll('.toast')
    expect(toasts).toHaveLength(2)
    expect(toasts[0]?.textContent).toContain('первый')
    expect(toasts[1]?.classList.contains('toast--success')).toBe(true)
  })

  it('keeps store order: oldest-first, top-to-bottom', () => {
    const store = useToastStore()
    store.push('один')
    store.push('два')
    store.push('три')

    wrapper = mount(BaseToastContainer)

    const messages = Array.from(document.body.querySelectorAll('.toast-body')).map((el) =>
      el.textContent,
    )
    expect(messages).toEqual(['один', 'два', 'три'])
  })

  it('wires BaseToast @dismiss to store.dismiss (close click removes the toast)', async () => {
    const store = useToastStore()
    store.push('уйду')

    wrapper = mount(BaseToastContainer)
    expect(store.items).toHaveLength(1)

    clickClose()
    await wrapper.vm.$nextTick()

    expect(store.items).toHaveLength(0)
    expect(document.body.querySelectorAll('.toast')).toHaveLength(0)
  })

  it('updates reactively when a toast is pushed after mount', async () => {
    const store = useToastStore()
    wrapper = mount(BaseToastContainer)
    expect(document.body.querySelectorAll('.toast')).toHaveLength(0)

    store.push('динамический')
    await wrapper.vm.$nextTick()

    expect(document.body.querySelectorAll('.toast')).toHaveLength(1)
    expect(document.body.querySelector('.toast-body')?.textContent).toBe('динамический')
  })

  it('updates reactively when a toast auto-dismisses', async () => {
    vi.useFakeTimers()
    const store = useToastStore()
    store.push('исчезну', 'info', 500)

    wrapper = mount(BaseToastContainer)
    expect(document.body.querySelectorAll('.toast')).toHaveLength(1)

    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()

    expect(document.body.querySelectorAll('.toast')).toHaveLength(0)
    vi.useRealTimers()
  })
})

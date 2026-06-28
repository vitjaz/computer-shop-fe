import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'

import { useToastStore, DEFAULT_TOAST_TIMEOUT } from '../toast'

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('push appends a toast with the message and returns a unique id', () => {
    const store = useToastStore()

    const id = store.push('Сохранено')

    expect(id).toBe(1)
    expect(store.items).toHaveLength(1)
    expect(store.items[0]).toStrictEqual({
      id: 1,
      message: 'Сохранено',
      variant: 'info',
    })
  })

  it('defaults the variant to info', () => {
    const store = useToastStore()

    store.push('привет')

    expect(store.items[0]?.variant).toBe('info')
  })

  it('stores the given variant', () => {
    const store = useToastStore()

    store.push('готово', 'success')
    store.push('ошибка', 'error')

    expect(store.items[0]?.variant).toBe('success')
    expect(store.items[1]?.variant).toBe('error')
  })

  it('returns incrementing ids across pushes', () => {
    const store = useToastStore()

    const first = store.push('a')
    const second = store.push('b')
    const third = store.push('c')

    expect([first, second, third]).toStrictEqual([1, 2, 3])
  })

  it('keeps oldest-first order (newest appended at the end)', () => {
    const store = useToastStore()

    store.push('первый')
    store.push('второй')
    store.push('третий')

    expect(store.items.map((t) => t.message)).toStrictEqual([
      'первый',
      'второй',
      'третий',
    ])
  })

  it('auto-dismisses the toast after the default timeout', () => {
    const store = useToastStore()

    store.push('исчезну')

    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(DEFAULT_TOAST_TIMEOUT - 1)
    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(store.items).toHaveLength(0)
  })

  it('auto-dismisses after a custom timeout', () => {
    const store = useToastStore()

    store.push('кастом', 'info', 1500)

    vi.advanceTimersByTime(1499)
    expect(store.items).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(store.items).toHaveLength(0)
  })

  it('does NOT auto-dismiss when timeout is 0', () => {
    const store = useToastStore()

    store.push('останусь', 'info', 0)

    vi.advanceTimersByTime(60_000)
    expect(store.items).toHaveLength(1)
  })

  it('dismiss removes the item immediately', () => {
    const store = useToastStore()

    const id = store.push('уйду сам', 'info', 0)
    store.dismiss(id)

    expect(store.items).toHaveLength(0)
  })

  it('dismiss is a no-op for an unknown id', () => {
    const store = useToastStore()

    expect(() => store.dismiss(999)).not.toThrow()
    expect(store.items).toHaveLength(0)
  })

  it('dismiss clears the pending timer so it does NOT fire later', () => {
    const store = useToastStore()

    const id = store.push('отменю таймер')
    store.dismiss(id)

    expect(store.items).toHaveLength(0)

    expect(() => vi.advanceTimersByTime(DEFAULT_TOAST_TIMEOUT + 1000)).not.toThrow()
    expect(store.items).toHaveLength(0)
  })

  it('clear removes all toasts and cancels their timers', () => {
    const store = useToastStore()

    store.push('a')
    store.push('b', 'success')
    store.push('c', 'error')
    expect(store.items).toHaveLength(3)

    store.clear()

    expect(store.items).toHaveLength(0)

    expect(() => vi.advanceTimersByTime(DEFAULT_TOAST_TIMEOUT + 1000)).not.toThrow()
    expect(store.items).toHaveLength(0)
  })

  it('pushing again after clear gets a fresh counter but reuses item slots', () => {
    const store = useToastStore()

    store.push('a')
    store.clear()

    const id = store.push('после очистки', 'info', 0)
    expect(id).toBe(2)
    expect(store.items).toHaveLength(1)
    expect(store.items[0]?.message).toBe('после очистки')
  })
})

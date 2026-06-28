import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastVariant = 'info' | 'success' | 'error'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

export const DEFAULT_TOAST_TIMEOUT = 4000

export const useToastStore = defineStore('toast', () => {
  const items = ref<Toast[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let nextId = 1

  function dismiss(id: number): void {
    const handle = timers.get(id)
    if (handle !== undefined) {
      clearTimeout(handle)
      timers.delete(id)
    }
    const idx = items.value.findIndex((t) => t.id === id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function push(
    message: string,
    variant: ToastVariant = 'info',
    timeout: number = DEFAULT_TOAST_TIMEOUT,
  ): number {
    const id = nextId++
    items.value.push({ id, message, variant })
    if (timeout > 0) {
      const handle = setTimeout(() => dismiss(id), timeout)
      timers.set(id, handle)
    }
    return id
  }

  function clear(): void {
    for (const handle of timers.values()) clearTimeout(handle)
    timers.clear()
    items.value = []
  }

  return { items, push, dismiss, clear }
})

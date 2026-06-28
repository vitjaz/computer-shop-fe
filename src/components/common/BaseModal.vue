<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'

import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseIconButton from '@/components/common/BaseIconButton.vue'

interface Props {
  modelValue: boolean
  title?: string
  ariaLabel?: string
  hideClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideClose: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const panel = ref<HTMLElement | null>(null)
const titleId = useId()
let previouslyFocused: HTMLElement | null = null

function close() {
  emit('update:modelValue', false)
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key === 'Tab') trapFocus(event)
}

function trapFocus(event: KeyboardEvent) {
  const panelEl = panel.value
  if (!panelEl) return
  const focusable = Array.from(
    panelEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
  if (focusable.length === 0) {
    event.preventDefault()
    panelEl.focus()
    return
  }
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  const active = document.activeElement
  if (event.shiftKey) {
    if (active === first) {
      event.preventDefault()
      last.focus()
    }
  } else if (active === last) {
    event.preventDefault()
    first.focus()
  }
}

function lockScroll() {
  document.body.style.overflow = 'hidden'
}

function releaseScroll() {
  document.body.style.overflow = ''
}

function focusPanel() {
  nextTick(() => {
    panel.value?.focus()
  })
}

function onOpen() {
  previouslyFocused = (document.activeElement as HTMLElement | null) ?? null
  lockScroll()
  focusPanel()
}

function onClose() {
  releaseScroll()
  previouslyFocused?.focus?.()
  previouslyFocused = null
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) onOpen()
    else onClose()
  },
)

onMounted(() => {
  if (props.modelValue) onOpen()
})

onUnmounted(() => {
  releaseScroll()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click="onBackdropClick">
      <div
        ref="panel"
        class="modal"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :aria-labelledby="title ? titleId : undefined"
        :aria-label="title ? undefined : ariaLabel"
        @keydown="onKeydown"
      >
        <BaseIconButton
          v-if="!hideClose"
          label="Закрыть"
          class="modal-close"
          @click="close"
        >
          <template #icon><BaseIcon name="close" /></template>
        </BaseIconButton>

        <slot name="header">
          <header v-if="title" class="modal-header">
            <h2 :id="titleId" class="modal-title">{{ title }}</h2>
          </header>
        </slot>

        <div class="modal-body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>

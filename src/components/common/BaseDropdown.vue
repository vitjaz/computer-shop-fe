<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'

import BaseIcon from '@/components/common/BaseIcon.vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options: Option[]
  open?: boolean
  ariaLabel?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  open: false,
  placeholder: 'Выберите…',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'update:open': [value: boolean]
}>()

const root = ref<HTMLElement | null>(null)
const menuId = useId()
const activeIndex = ref(-1)

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue)
  return found?.label ?? props.placeholder
})

const activeId = computed(() =>
  activeIndex.value < 0 ? undefined : `${menuId}-${activeIndex.value}`,
)

function initActive() {
  const found = props.options.findIndex((o) => o.value === props.modelValue)
  activeIndex.value = found < 0 ? 0 : found
}

function setOpen(value: boolean) {
  if (value) initActive()
  emit('update:open', value)
}

function toggle() {
  setOpen(!props.open)
}

function close() {
  emit('update:open', false)
}

function moveActive(delta: number) {
  const opts = props.options
  if (opts.length === 0) return
  let next = activeIndex.value < 0 ? 0 : activeIndex.value
  for (let step = 0; step < opts.length; step++) {
    next = (next + delta + opts.length) % opts.length
    if (!opts[next]?.disabled) break
  }
  activeIndex.value = next
}

function selectActive() {
  const opt = props.options[activeIndex.value]
  if (opt && !opt.disabled) emit('update:modelValue', opt.value)
  close()
}

function selectOption(index: number) {
  const opt = props.options[index]
  if (!opt || opt.disabled) return
  emit('update:modelValue', opt.value)
  close()
}

function setActive(index: number) {
  if (!props.options[index]?.disabled) activeIndex.value = index
}

function onKeydown(event: KeyboardEvent) {
  if (!props.open) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
    return
  }
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      break
    case 'Enter':
      event.preventDefault()
      selectActive()
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'Tab':
      close()
      break
  }
}

function onClickOutside(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('click', onClickOutside)
      initActive()
    } else {
      document.removeEventListener('click', onClickOutside)
    }
  },
)

onMounted(() => {
  if (props.open) {
    document.addEventListener('click', onClickOutside)
    initActive()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="root" class="dropdown" @keydown="onKeydown">
    <slot name="trigger" :open="open" :label="selectedLabel" :toggle="toggle">
      <button
        type="button"
        class="dropdown-trigger"
        :aria-haspopup="'listbox'"
        :aria-expanded="open"
        :aria-controls="menuId"
        :aria-label="ariaLabel"
        @click="toggle"
      >
        <span>{{ selectedLabel }}</span>
        <BaseIcon name="chevron-down" class="dropdown-chev" />
      </button>
    </slot>

    <ul
      v-if="open"
      :id="menuId"
      class="dropdown-menu"
      role="listbox"
      tabindex="-1"
      :aria-activedescendant="activeId"
    >
      <li
        v-for="(opt, i) in options"
        :id="`${menuId}-${i}`"
        :key="opt.value"
        class="dropdown-item"
        role="option"
        :aria-selected="opt.value === modelValue ? 'true' : undefined"
        :aria-disabled="opt.disabled ? 'true' : undefined"
        :data-active="i === activeIndex ? 'true' : undefined"
        @click="selectOption(i)"
        @mouseenter="setActive(i)"
      >
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped></style>

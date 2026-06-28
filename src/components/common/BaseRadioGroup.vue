<script setup lang="ts">
import { computed, ref, useId } from 'vue'

interface RadioOption {
  value: string | number
  label: string
  price?: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: RadioOption[]
  name?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const root = ref<HTMLElement | null>(null)
const autoName = useId()
const groupName = computed(() => props.name ?? autoName)

function onPick(opt: RadioOption) {
  if (opt.disabled) return
  if (opt.value === props.modelValue) return
  emit('update:modelValue', opt.value)
}

function onKeydown(event: KeyboardEvent) {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  if (!keys.includes(event.key)) return
  event.preventDefault()
  const opts = props.options
  const n = opts.length
  if (n === 0) return
  const currentIndex = opts.findIndex((o) => o.value === props.modelValue)
  const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
  let next = currentIndex < 0 ? (delta === 1 ? -1 : 0) : currentIndex
  for (let step = 0; step < n; step++) {
    next = (next + delta + n) % n
    const candidate = opts[next]
    if (candidate && !candidate.disabled) {
      onPick(candidate)
      const inputs = root.value?.querySelectorAll<HTMLInputElement>('input')
      inputs?.[next]?.focus()
      break
    }
  }
}
</script>

<template>
  <div ref="root" class="radio-list" role="radiogroup" @keydown="onKeydown">
    <label
      v-for="opt in options"
      :key="opt.value"
      class="radio"
      :class="{ active: opt.value === modelValue }"
    >
      <input
        type="radio"
        class="sr-only"
        :name="groupName"
        :value="opt.value"
        :checked="opt.value === modelValue"
        :disabled="opt.disabled"
        @change="onPick(opt)"
      />
      <span class="dot" />
      <span class="text">{{ opt.label }}</span>
      <span v-if="opt.price" class="price-tag">{{ opt.price }}</span>
    </label>
  </div>
</template>

<style scoped></style>

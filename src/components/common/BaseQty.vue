<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  step: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const atMin = computed(() => props.modelValue <= props.min)
const atMax = computed(() => props.max !== undefined && props.modelValue >= props.max)

function clamp(value: number): number {
  let v = value
  if (v < props.min) v = props.min
  if (props.max !== undefined && v > props.max) v = props.max
  return v
}

function emitValue(value: number) {
  emit('update:modelValue', value)
  emit('change', value)
}

function inc() {
  emitValue(clamp(props.modelValue + props.step))
}

function dec() {
  emitValue(clamp(props.modelValue - props.step))
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value
  if (raw === '') return
  const parsed = Number(raw)
  if (Number.isNaN(parsed)) return
  emitValue(clamp(parsed))
}
</script>

<template>
  <div class="qty" :class="size ? `qty-${size}` : undefined">
    <button type="button" :disabled="atMin" @click="dec">−</button>
    <input type="text" inputmode="numeric" :value="modelValue" @input="onInput" />
    <button type="button" :disabled="atMax" @click="inc">+</button>
  </div>
</template>

<style scoped></style>

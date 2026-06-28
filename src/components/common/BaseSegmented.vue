<script setup lang="ts">

import BaseIcon from '@/components/common/BaseIcon.vue'

interface SegOption {
  value: string | number
  label: string
  icon?: string
}

interface Props {
  modelValue: string | number
  options: SegOption[]
  variant?: 'text' | 'icon'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  ariaLabel: 'Сегментированный переключатель',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function select(opt: SegOption) {
  if (opt.value === props.modelValue) return
  emit('update:modelValue', opt.value)
}
</script>

<template>
  <div class="seg" role="group" :aria-label="ariaLabel">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :class="{ active: opt.value === modelValue }"
      :aria-pressed="opt.value === modelValue ? 'true' : 'false'"
      @click="select(opt)"
    >
      <BaseIcon v-if="opt.icon" :name="opt.icon" />
      <span v-if="variant === 'text'">{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped></style>

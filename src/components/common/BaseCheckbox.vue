<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  count?: string | number
  disabled?: boolean
  id?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="check" :class="{ disabled }">
    <input
      type="checkbox"
      :id="id"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    <span class="box" />
    <span v-if="label">{{ label }}</span>
    <span v-if="count != null" class="count">{{ count }}</span>
  </label>
</template>

<style scoped></style>

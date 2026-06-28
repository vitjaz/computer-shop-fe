<script setup lang="ts">
interface Props {
  modelValue: string
  rows?: number
  placeholder?: string
  id?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    class="textarea"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :id="id"
    :disabled="disabled"
    @input="onInput"
  />
</template>

<style scoped></style>

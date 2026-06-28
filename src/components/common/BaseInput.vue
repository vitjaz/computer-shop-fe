<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: string | number
  type?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  invalid?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div v-if="$slots.prefix || $slots.suffix" class="input-affix">
    <slot name="prefix" />
    <input
      v-bind="$attrs"
      class="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :id="id"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      @input="onInput"
    />
    <slot name="suffix" />
  </div>
  <input
    v-else
    v-bind="$attrs"
    class="input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :id="id"
    :disabled="disabled"
    :aria-invalid="invalid ? 'true' : undefined"
    @input="onInput"
  />
</template>

<style scoped>
.input-affix {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
</style>

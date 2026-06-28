<script setup lang="ts">
interface Props {
  label: string
  pressed?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  pressed: false,
  disabled: false,
  type: 'button',
})
</script>

<template>
  <button
    class="iconbtn"
    :type="type"
    :aria-label="label"
    :aria-pressed="pressed"
    :disabled="disabled"
  >
    <slot name="icon" />
  </button>
</template>

<style scoped></style>

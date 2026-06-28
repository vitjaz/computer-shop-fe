<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm'
  block?: boolean
  arrow?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  block: false,
  arrow: false,
  loading: false,
  disabled: false,
})
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      { 'btn-sm': size === 'sm', 'btn-block': block, 'btn-arrow': arrow },
    ]"
    :type="type"
    :disabled="disabled || loading"
  >
    <slot name="icon" :loading="loading" />
    <slot />
  </button>
</template>

<style scoped></style>

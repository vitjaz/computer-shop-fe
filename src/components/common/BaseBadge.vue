<script setup lang="ts">
interface Props {
  variant?: 'accent' | 'success' | 'neutral'
}

withDefaults(defineProps<Props>(), {
  variant: 'accent',
})
</script>

<template>
  <span
    :class="[
      'pill',
      { 'pill-success': variant === 'success', 'pill-neutral': variant === 'neutral' },
    ]"
  >
    <slot />
  </span>
</template>

<style scoped></style>

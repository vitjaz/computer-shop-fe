<script setup lang="ts">
interface Props {
  flat?: boolean
  hover?: boolean
  as?: string
}

withDefaults(defineProps<Props>(), {
  flat: false,
  hover: false,
  as: 'div',
})
</script>

<template>
  <component :is="as" :class="['card', { 'card-flat': flat, 'card-hover': hover }]">
    <slot />
  </component>
</template>

<style scoped></style>

<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
})
</script>

<template>
  <div :class="['alert', `alert-${variant}`]">
    <span class="alert-icon"><slot name="icon" /></span>
    <div class="alert-body">
      <p v-if="title" class="alert-title">{{ title }}</p>
      <slot />
    </div>
    <div v-if="$slots.action" class="alert-action"><slot name="action" /></div>
  </div>
</template>

<style scoped></style>

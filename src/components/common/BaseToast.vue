<script setup lang="ts">
import type { ToastVariant } from '@/stores/toast'

interface Props {
  message: string
  variant?: ToastVariant
  id?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
})

defineEmits<{
  dismiss: [id?: number]
}>()
</script>

<template>
  <div :class="['toast', `toast--${variant}`]" role="status">
    <div class="toast-body">{{ message }}</div>
    <button class="toast-close" aria-label="Закрыть" @click="$emit('dismiss', id)">
      ×
    </button>
  </div>
</template>

<style scoped></style>

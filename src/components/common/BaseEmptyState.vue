<script setup lang="ts">

import BaseIcon from '@/components/common/BaseIcon.vue'

interface Props {
  title: string
  description?: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="empty-state">
    <div v-if="icon || $slots.icon" class="empty-icon">
      <slot name="icon">
        <BaseIcon v-if="icon" :name="icon" />
      </slot>
    </div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped></style>

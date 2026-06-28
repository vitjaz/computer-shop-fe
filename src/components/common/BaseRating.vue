<script setup lang="ts">
import { computed } from 'vue'

import BaseIcon from '@/components/common/BaseIcon.vue'

interface Props {
  value: number
  max?: number
  count?: number
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 5,
  readonly: true,
})

const filledCount = computed(() => {
  const v = Math.floor(props.value)
  if (v < 0) return 0
  if (v > props.max) return props.max
  return v
})

const ariaLabel = computed(() => `Рейтинг ${props.value} из ${props.max}`)
</script>

<template>
  <span class="rating" :aria-label="ariaLabel">
    <span class="stars">
      <BaseIcon
        v-for="i in max"
        :key="i"
        name="star"
        :class="{ empty: i > filledCount }"
      />
    </span>
    <span v-if="count != null" class="count">({{ count }})</span>
  </span>
</template>

<style scoped></style>

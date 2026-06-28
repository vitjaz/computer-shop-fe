<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  shape?: 'text' | 'rect' | 'circle' | 'line'
  width?: string
  height?: string
  lines?: number
}

const props = withDefaults(defineProps<Props>(), {
  shape: 'text',
  lines: 1,
})

const sizeStyle = computed(() => ({
  width: props.width,
  height: props.height,
}))

const lineCount = computed(() => Math.max(1, props.lines))
</script>

<template>
  <span v-if="lineCount > 1" class="skeleton-group">
    <span
      v-for="i in lineCount"
      :key="i"
      class="skeleton"
      :class="`skeleton--${shape}`"
      :style="sizeStyle"
    />
  </span>
  <span
    v-else
    class="skeleton"
    :class="`skeleton--${shape}`"
    :style="sizeStyle"
  />
</template>

<style scoped></style>

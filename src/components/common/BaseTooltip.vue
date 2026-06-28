<script setup lang="ts">
import { ref, useId } from 'vue'

interface Props {
  content: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

withDefaults(defineProps<Props>(), {
  placement: 'top',
})

const visible = ref(false)
const tooltipId = useId()

function show(): void {
  visible.value = true
}

function hide(): void {
  visible.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') hide()
}
</script>

<template>
  <span
    class="tooltip-trigger"
    :aria-describedby="tooltipId"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="onKeydown"
  >
    <slot />
    <span
      :id="tooltipId"
      :class="['tooltip', `tooltip--${placement}`]"
      role="tooltip"
      :data-visible="visible ? 'true' : 'false'"
      >{{ content }}</span
    >
  </span>
</template>

<style scoped></style>

<script setup lang="ts">
interface Props {
  pressed?: boolean
  removable?: boolean
  variant?: 'default' | 'accent'
}

withDefaults(defineProps<Props>(), {
  pressed: false,
  removable: false,
  variant: 'default',
})

const emit = defineEmits<{
  toggle: []
  remove: []
}>()

function onToggle() {
  emit('toggle')
}

function onRemove() {
  emit('remove')
}
</script>

<template>
  <button
    v-if="!removable"
    :class="['chip', { accent: variant === 'accent' }]"
    type="button"
    :aria-pressed="pressed"
    @click="onToggle"
  >
    <slot />
  </button>
  <span v-else :class="['chip', { accent: variant === 'accent' }]">
    <slot />
    <button type="button" aria-label="Убрать" @click="onRemove">×</button>
  </span>
</template>

<style scoped></style>

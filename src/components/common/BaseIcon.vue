<script setup lang="ts">
import { computed } from 'vue'

const iconModules = import.meta.glob('@/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const iconsByName: Record<string, string> = {}
for (const [path, content] of Object.entries(iconModules)) {
  const file = path.split('/').pop() ?? ''
  const name = file.replace(/\.svg$/, '')
  if (name) iconsByName[name] = content
}

const props = defineProps<{
  name: string
}>()

const svg = computed(() => iconsByName[props.name])
</script>

<template>
  <span v-if="svg" class="base-icon" v-html="svg" />
  <slot v-else />
</template>

<style scoped></style>

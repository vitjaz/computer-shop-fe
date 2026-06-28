<script setup lang="ts">
interface Props {
  label?: string
  help?: string
  error?: string
  required?: boolean
  htmlFor?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="field" :class="{ 'has-error': !!props.error }">
    <label v-if="props.label" :for="props.htmlFor">
      {{ props.label }}<span v-if="props.required" aria-hidden="true"> *</span>
    </label>
    <slot />
    <div v-if="props.error" class="field-help field-error">{{ props.error }}</div>
    <div v-else-if="props.help" class="field-help">{{ props.help }}</div>
  </div>
</template>

<style scoped>
.field-error {
  color: var(--danger);
}
</style>

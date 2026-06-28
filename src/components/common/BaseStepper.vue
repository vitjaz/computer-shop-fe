<script setup lang="ts">

import BaseIcon from '@/components/common/BaseIcon.vue'

interface Step {
  label: string
}

interface Props {
  steps: Step[]
  current: number
}

defineProps<Props>()
</script>

<template>
  <div class="steps">
    <div class="steps-inner">
      <template v-for="(step, i) in steps" :key="i">
        <div
          class="step"
          :class="{ active: i === current, done: i < current }"
          :aria-current="i === current ? 'step' : undefined"
        >
          <span class="num">
            <BaseIcon v-if="i < current" name="check" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          {{ step.label }}
        </div>
        <span v-if="i < steps.length - 1" class="steps-sep" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>

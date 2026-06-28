<script setup lang="ts">
import { computed } from 'vue'

import BaseIcon from '@/components/common/BaseIcon.vue'

interface Props {
  images: string[]
  activeIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  activeIndex: 0,
})

const emit = defineEmits<{
  'update:activeIndex': [value: number]
}>()

const lastIndex = computed(() => props.images.length - 1)

const clampedIndex = computed(() => {
  if (props.images.length === 0) return 0
  return Math.min(Math.max(0, props.activeIndex), lastIndex.value)
})

const atStart = computed(() => clampedIndex.value <= 0)
const atEnd = computed(() => props.images.length === 0 || clampedIndex.value >= lastIndex.value)
const showNav = computed(() => props.images.length > 1)
const showThumbs = computed(() => props.images.length > 1)

function setActive(i: number) {
  if (props.images.length === 0) return
  const clamped = Math.min(Math.max(0, i), lastIndex.value)
  if (clamped === props.activeIndex) return
  emit('update:activeIndex', clamped)
}

function prev() {
  if (atStart.value) return
  setActive(clampedIndex.value - 1)
}

function next() {
  if (atEnd.value) return
  setActive(clampedIndex.value + 1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
}
</script>

<template>
  <div
    class="gallery"
    role="group"
    aria-label="Галерея"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="gallery-main">
      <img v-if="images[clampedIndex]" :src="images[clampedIndex]" alt="" />
      <div v-else class="ph-img" />
      <div v-if="showNav" class="gallery-nav">
        <button
          type="button"
          aria-label="Предыдущее"
          :disabled="atStart"
          @click="prev"
        >
          <BaseIcon name="arrow-left" />
        </button>
        <button
          type="button"
          aria-label="Следующее"
          :disabled="atEnd"
          @click="next"
        >
          <BaseIcon name="arrow-right" />
        </button>
      </div>
    </div>
    <div v-if="showThumbs" class="thumbs">
      <button
        v-for="(img, i) in images"
        :key="i"
        type="button"
        class="thumb"
        :class="{ active: i === clampedIndex }"
        :aria-current="i === clampedIndex ? 'true' : undefined"
        @click="setActive(i)"
      >
        <img :src="img" alt="" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>

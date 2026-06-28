<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  page: number
  total: number
  perPage?: number
  siblingCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 12,
  siblingCount: 1,
})

const emit = defineEmits<{
  change: [page: number]
}>()

const totalPages = computed(() =>
  props.perPage <= 0 ? 0 : Math.ceil(props.total / props.perPage),
)

const clampedPage = computed(() => {
  const last = totalPages.value
  if (last <= 0) return 1
  return Math.min(Math.max(1, props.page), last)
})

type PageToken = number | 'dots'

const pages = computed<PageToken[]>(() => {
  const last = totalPages.value
  if (last <= 0) return []
  const totalSlots = 2 + props.siblingCount * 2 + 2 + 1
  if (last <= totalSlots) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  const current = clampedPage.value
  const leftSibling = Math.max(2, current - props.siblingCount)
  const rightSibling = Math.min(last - 1, current + props.siblingCount)
  const result: PageToken[] = [1]
  if (leftSibling > 2) result.push('dots')
  for (let p = leftSibling; p <= rightSibling; p++) result.push(p)
  if (rightSibling < last - 1) result.push('dots')
  result.push(last)
  return result
})

const range = computed(() => {
  if (props.total <= 0) return null
  const start = (clampedPage.value - 1) * props.perPage + 1
  const end = Math.min(clampedPage.value * props.perPage, props.total)
  return { start, end, total: props.total }
})

function goTo(page: number) {
  if (page < 1 || page > totalPages.value) return
  if (page === clampedPage.value) return
  emit('change', page)
}
</script>

<template>
  <nav class="pager" :aria-label="`Навигация по страницам`">
    <span v-if="range" class="pager-info">{{ range.start }}–{{ range.end }} из {{ range.total }}</span>
    <div v-if="pages.length > 0" class="pager-pages">
      <template v-for="(token, i) in pages" :key="i">
        <span v-if="token === 'dots'" class="dots">…</span>
        <button
          v-else
          type="button"
          :class="{ active: token === clampedPage }"
          :aria-current="token === clampedPage ? 'page' : undefined"
          :disabled="token === clampedPage"
          @click="goTo(token)"
        >
          {{ token }}
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped></style>

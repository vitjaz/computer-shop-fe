<script setup lang="ts">
import { computed, useId } from 'vue'

interface TabItem {
  id: string | number
  label: string
  count?: number
}

interface Props {
  modelValue: string | number
  items: TabItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const baseId = useId()

const activeIndex = computed(() =>
  props.items.findIndex((item) => item.id === props.modelValue),
)

const activeItem = computed<TabItem | undefined>(() => {
  if (activeIndex.value < 0) return undefined
  return props.items[activeIndex.value]
})

function tabId(i: number) {
  return `${baseId}-tab-${i}`
}

function panelId(i: number) {
  return `${baseId}-panel-${i}`
}

function select(i: number) {
  const item = props.items[i]
  if (!item || item.id === props.modelValue) return
  emit('update:modelValue', item.id)
}

function onKeydown(event: KeyboardEvent) {
  const n = props.items.length
  if (n === 0) return
  const cur = activeIndex.value < 0 ? 0 : activeIndex.value
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    select((cur + 1) % n)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    select((cur - 1 + n) % n)
  }
}
</script>

<template>
  <div>
    <div class="tabs" role="tablist" @keydown="onKeydown">
      <button
        v-for="(item, i) in items"
        :id="tabId(i)"
        :key="item.id"
        type="button"
        class="tab"
        :class="{ active: i === activeIndex }"
        role="tab"
        :aria-selected="i === activeIndex ? 'true' : 'false'"
        :aria-controls="panelId(i)"
        :tabindex="i === activeIndex ? 0 : -1"
        @click="select(i)"
      >
        {{ item.label }}
        <span v-if="item.count != null" class="count">{{ item.count }}</span>
      </button>
    </div>
    <div
      v-if="activeItem && activeIndex >= 0"
      :id="panelId(activeIndex)"
      class="tab-panel active"
      role="tabpanel"
      :aria-labelledby="tabId(activeIndex)"
      tabindex="0"
    >
      <slot :name="`panel-${String(activeItem.id)}`" :item="activeItem" />
    </div>
  </div>
</template>

<style scoped></style>

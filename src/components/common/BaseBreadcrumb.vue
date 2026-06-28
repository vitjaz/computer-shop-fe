<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb">
    <div class="crumb">
      <template v-for="(item, i) in props.items" :key="i">
        <RouterLink v-if="item.to && i < props.items.length - 1" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <span v-else :aria-current="i === props.items.length - 1 ? 'page' : undefined">
          {{ item.label }}
        </span>
        <span v-if="i < props.items.length - 1" class="sep" aria-hidden="true">
          <slot name="separator">›</slot>
        </span>
      </template>
    </div>
  </nav>
</template>

<style scoped></style>

<script setup lang="ts">
import BaseToast from '@/components/common/BaseToast.vue'
import { useToastStore } from '@/stores/toast'

const store = useToastStore()

function onDismiss(id?: number): void {
  if (id !== undefined) store.dismiss(id)
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <BaseToast
        v-for="t in store.items"
        :key="t.id"
        :id="t.id"
        :message="t.message"
        :variant="t.variant"
        @dismiss="onDismiss"
      />
    </div>
  </Teleport>
</template>

<style scoped></style>

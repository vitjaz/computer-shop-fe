<script setup lang="ts"></script>

<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" />
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  inset-block-end: var(--sp-6);
  inset-inline-end: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  z-index: 60;
  pointer-events: none;
}
</style>

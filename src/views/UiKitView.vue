<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseIconButton from '@/components/common/BaseIconButton.vue'

const iconNames = [
  'cart',
  'search',
  'heart',
  'compare',
  'star',
  'chevron-down',
  'close',
  'check',
  'arrow-left',
  'arrow-right',
] as const

const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
</script>

<template>
  <div class="container">
    <section class="section">
      <p class="eyebrow">UI-кит</p>
      <h1 class="h1">Базовые компоненты</h1>
      <p class="lead">
        Витрина base-* компонентов. Страница наполняется по мере добавления групп компонентов.
      </p>
    </section>

    <section class="section">
      <p class="eyebrow">BaseIcon</p>
      <h2 class="h2">Иконки</h2>
      <div class="row wrap kit-icon-row">
        <BaseIcon v-for="name in iconNames" :key="name" :name="name" />
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseButton</p>
      <h2 class="h2">Кнопки</h2>
      <div class="stack">
        <div class="row wrap">
          <BaseButton v-for="variant in variants" :key="variant" :variant="variant">
            {{ variant }}
          </BaseButton>
        </div>

        <div class="row wrap">
          <BaseButton variant="primary" size="sm">Small</BaseButton>
          <BaseButton variant="primary" arrow>Со стрелкой</BaseButton>
          <BaseButton variant="primary" disabled>Disabled</BaseButton>
          <BaseButton variant="primary" loading>
            <template #icon>
              <span class="kit-spinner" aria-hidden="true" />
            </template>
            Loading
          </BaseButton>
        </div>

        <BaseButton variant="primary" block>Block</BaseButton>

        <div class="row wrap">
          <BaseButton variant="primary">
            <template #icon><BaseIcon name="cart" /></template>
            В корзину
          </BaseButton>
          <BaseButton variant="outline">
            <template #icon><BaseIcon name="compare" /></template>
            В сравнение
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseIconButton</p>
      <h2 class="h2">Icon-кнопки</h2>
      <div class="row wrap">
        <BaseIconButton label="Корзина">
          <template #icon><BaseIcon name="cart" /></template>
        </BaseIconButton>
        <BaseIconButton label="Поиск">
          <template #icon><BaseIcon name="search" /></template>
        </BaseIconButton>
        <BaseIconButton label="В избранное" pressed>
          <template #icon><BaseIcon name="heart" /></template>
        </BaseIconButton>
        <BaseIconButton label="К сравнению" pressed>
          <template #icon><BaseIcon name="compare" /></template>
        </BaseIconButton>
        <BaseIconButton label="Закрыть">
          <template #icon><BaseIcon name="close" /></template>
        </BaseIconButton>
        <BaseIconButton label="Недоступно" disabled>
          <template #icon><BaseIcon name="check" /></template>
        </BaseIconButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.kit-icon-row {
  font-size: var(--fs-h3);
  color: var(--fg-2);
}

.kit-spinner {
  width: var(--fs-sm);
  height: var(--fs-sm);
  border: 2px solid var(--accent-soft);
  border-top-color: var(--accent);
  border-radius: var(--radius-pill);
  animation: kit-spin 0.6s linear infinite;
}

@keyframes kit-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

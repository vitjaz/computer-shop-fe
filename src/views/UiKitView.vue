<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseCheckbox from '@/components/common/BaseCheckbox.vue'
import BaseField from '@/components/common/BaseField.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseIconButton from '@/components/common/BaseIconButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

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

const formName = ref('')
const formEmail = ref('')
const formInvalid = ref('')
const formNotes = ref('')
const formCategory = ref('')
const formSearch = ref('')
const checkBasic = ref(true)
const checkCount = ref(false)
const checkDisabled = ref(false)

const categoryOptions = [
  { value: 'cpu', label: 'Процессоры' },
  { value: 'gpu', label: 'Видеокарты' },
  { value: 'ram', label: 'Память' },
  { value: 'mb', label: 'Материнские платы' },
]
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

    <section class="section">
      <p class="eyebrow">Поля форм</p>
      <h2 class="h2">BaseField / BaseInput / BaseTextarea / BaseSelect</h2>
      <div class="stack kit-form">
        <div class="grid-2">
          <BaseField label="Имя" html-for="kit-name" required>
            <BaseInput id="kit-name" v-model="formName" placeholder="Как вас зовут?" />
          </BaseField>

          <BaseField label="Email" html-for="kit-email" help="Никому не передаём.">
            <BaseInput id="kit-email" v-model="formEmail" type="email" placeholder="you@shop.ru" />
          </BaseField>

          <BaseField label="С ошибкой" html-for="kit-invalid" error="Введите корректное значение">
            <BaseInput id="kit-invalid" v-model="formInvalid" invalid placeholder="сломано" />
          </BaseField>

          <BaseField label="Заблокировано" html-for="kit-disabled">
            <BaseInput id="kit-disabled" model-value="" disabled placeholder="недоступно" />
          </BaseField>

          <BaseField label="С префиксом" html-for="kit-affix">
            <BaseInput id="kit-affix" v-model="formSearch" placeholder="Поиск">
              <template #prefix><BaseIcon name="search" /></template>
              <template #suffix><span class="meta">↵</span></template>
            </BaseInput>
          </BaseField>

          <BaseField label="Категория" html-for="kit-category">
            <BaseSelect
              id="kit-category"
              v-model="formCategory"
              :options="categoryOptions"
              placeholder="Выберите…"
            />
          </BaseField>
        </div>

        <BaseField label="Комментарий" html-for="kit-notes" help="До 500 символов.">
          <BaseTextarea id="kit-notes" v-model="formNotes" :rows="4" placeholder="Ваш комментарий" />
        </BaseField>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseCheckbox</p>
      <h2 class="h2">Чекбоксы</h2>
      <div class="check-list kit-checks">
        <BaseCheckbox v-model="checkBasic" label="В наличии" id="ck-basic" />
        <BaseCheckbox v-model="checkCount" label="Со скидкой" :count="12" id="ck-count" />
        <BaseCheckbox v-model="checkDisabled" label="Недоступно" disabled id="ck-disabled" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.kit-icon-row {
  font-size: var(--fs-h3);
  color: var(--fg-2);
}

.kit-form {
  max-width: 720px;
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

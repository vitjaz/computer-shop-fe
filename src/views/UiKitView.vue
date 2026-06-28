<script setup lang="ts">
import { ref } from 'vue'

import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseCheckbox from '@/components/common/BaseCheckbox.vue'
import BaseChip from '@/components/common/BaseChip.vue'
import BaseField from '@/components/common/BaseField.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseIconButton from '@/components/common/BaseIconButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseQty from '@/components/common/BaseQty.vue'
import BaseRating from '@/components/common/BaseRating.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseTag from '@/components/common/BaseTag.vue'
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
const qtyDefault = ref(1)
const qtySm = ref(2)
const qtyLg = ref(1)
const chipCpu = ref(false)
const chipGpu = ref(true)

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: 'Каталог', to: '/catalog' },
  { label: 'Процессоры' },
]

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

    <section class="section">
      <p class="eyebrow">BaseQty</p>
      <h2 class="h2">Степпер количества</h2>
      <div class="row wrap kit-qty">
        <BaseQty v-model="qtyDefault" :min="1" :max="10" />
        <BaseQty v-model="qtySm" :min="1" :max="10" size="sm" />
        <BaseQty v-model="qtyLg" :min="1" :max="99" size="lg" />
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseCard</p>
      <h2 class="h2">Поверхности</h2>
      <div class="grid-3 kit-surfaces">
        <BaseCard>
          <h3 class="h4">Обычная карточка</h3>
          <p class="meta">.card — фоновая поверхность с рамкой.</p>
        </BaseCard>

        <BaseCard hover>
          <h3 class="h4">С hover</h3>
          <p class="meta">.card .card-hover — при наведении подъём.</p>
        </BaseCard>

        <BaseCard flat>
          <h3 class="h4">Плоская</h3>
          <p class="meta">.card .card-flat — без фона и отступов.</p>
        </BaseCard>

        <BaseCard as="article" hover>
          <h3 class="h4">Произвольный тег</h3>
          <p class="meta">as="article" — семантическая обёртка.</p>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseBadge · BaseTag</p>
      <h2 class="h2">Пилюли и теги</h2>
      <div class="stack">
        <div class="row wrap">
          <BaseBadge>Акция</BaseBadge>
          <BaseBadge variant="success">В наличии</BaseBadge>
          <BaseBadge variant="neutral">Б/у</BaseBadge>
        </div>

        <div class="row wrap">
          <BaseTag>DDR5</BaseTag>
          <BaseTag>AM5</BaseTag>
          <BaseTag>32 ГБ</BaseTag>
          <BaseTag>7200 МГц</BaseTag>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseChip</p>
      <h2 class="h2">Чипы</h2>
      <div class="stack">
        <div class="row wrap">
          <BaseChip :pressed="chipCpu" @toggle="chipCpu = !chipCpu">Процессоры</BaseChip>
          <BaseChip :pressed="chipGpu" @toggle="chipGpu = !chipGpu">Видеокарты</BaseChip>
          <BaseChip>Память</BaseChip>
        </div>

        <div class="row wrap">
          <BaseChip variant="accent">Акцентный</BaseChip>
          <BaseChip removable>AMD Ryzen 7</BaseChip>
          <BaseChip removable variant="accent">−20%</BaseChip>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseRating</p>
      <h2 class="h2">Рейтинг</h2>
      <div class="stack kit-rating">
        <BaseRating :value="5" :count="128" />
        <BaseRating :value="4.5" :count="354" />
        <BaseRating :value="3" :count="42" />
        <BaseRating :value="2" />
        <BaseRating :value="0" :count="0" />
        <BaseRating :value="4" :max="10" :count="7" />
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseAlert</p>
      <h2 class="h2">Уведомления</h2>
      <div class="stack kit-alerts">
        <BaseAlert variant="info" title="Информация">
          <template #icon><BaseIcon name="search" /></template>
          Сравнение товаров обновлено.
        </BaseAlert>

        <BaseAlert variant="success" title="Готово">
          <template #icon><BaseIcon name="check" /></template>
          Купон SBORKA5 применён.
          <template #action>
            <BaseButton variant="ghost" size="sm">Отменить</BaseButton>
          </template>
        </BaseAlert>

        <BaseAlert variant="warning">
          <template #icon><BaseIcon name="heart" /></template>
          Осталось 2 товара на складе.
        </BaseAlert>

        <BaseAlert variant="danger" title="Ошибка">
          <template #icon><BaseIcon name="close" /></template>
          Не удалось оформить заказ.
          <template #action>
            <BaseButton variant="ghost" size="sm">Повторить</BaseButton>
          </template>
        </BaseAlert>
      </div>
    </section>

    <section class="section">
      <p class="eyebrow">BaseBreadcrumb</p>
      <h2 class="h2">Хлебные крошки</h2>
      <div class="stack kit-crumb">
        <BaseBreadcrumb :items="breadcrumbItems" />
        <BaseBreadcrumb
          :items="[
            { label: 'Каталог', to: '/' },
            { label: 'Видеокарты', to: '/categories/gpu' },
            { label: 'ASUS ROG Strix RTX 4080' },
          ]"
        />
        <BaseBreadcrumb :items="[{ label: 'Только текущая страница' }]" />
        <BaseBreadcrumb
          :items="[
            { label: 'A', to: '/' },
            { label: 'B', to: '/' },
            { label: 'C' },
          ]"
        >
          <template #separator>/</template>
        </BaseBreadcrumb>
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

.kit-alerts {
  max-width: 560px;
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

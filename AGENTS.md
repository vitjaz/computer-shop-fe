# AGENTS.md

Живой документ-контракт для AI-агента, работающего с этим репозиторием.
Описывает суть проекта, стек, архитектуру, конвенции и правила работы.
Файл дополняется и изменяется по мере развития проекта — при изменении
архитектуры/стека/правил обновляйте соответствующие секции.

---

## 1. О проекте

**КОМПОНЕНТА** — SPA интернет-магазин компьютерных комплектующих
(процессоры, видеокарты, материнские платы, память, накопители и т.д.).

Проект создан как полигон для оценки совместной работы **OpenDesign + OpenCode**
при построении фронтенд-приложений. Это значит, что читаемость структуры,
предсказуемость конвенций и стабильность тестов важнее скорости «как-нибудь
сделать».

---

## 2. Стек технологий

| Слой | Технология | Версия |
|---|---|---|
| Фреймворк | Vue 3 (`<script setup>`) | ^3.5 |
| Язык | TypeScript (строгий, `noUncheckedIndexedAccess`) | ~6.0 |
| Состояние | Pinia (setup-стиль) | ^3.0 |
| Роутинг | Vue Router | ^5.1 |
| Сборщик | Vite | ^8.0 |
| Менеджер пакетов | **pnpm** | — |
| Unit/компонентные тесты | Vitest + jsdom + `@vue/test-utils` | ^4.1 |
| E2E/интеграционные тесты | **Playwright** (клики, сценарии пользователя) | TODO: подключить |
| Линт | oxlint (быстрый) + ESLint | — |
| Форматирование | Prettier | 3.8 |

Требования к среде (см. `package.json` → `engines`):
- Node `^22.18.0 || >=24.12.0`
- Пакетный менеджер — **только pnpm** (не npm/yarn).

---

## 3. Архитектура (плоская, без FSD)

Архитектура **плоская**. FSD, feature-sliced и прочие слоистые методологии
**не применяются**. Папки группируются по технической роли, а внутри них
файлы — по доменной принадлежности (product / cart / catalog).

### Структура `src/`

```
src/
├── assets/                 # статика: иконки, логотип, плейсхолдеры изображений
│   └── styles/
│       └── base.css                # дизайн-токены и базовые компоненты (см. раздел 7)
├── components/
│   ├── common/             # базовые UI: BaseButton, BaseInput, BaseModal, BaseIcon, BaseBadge
│   ├── layout/             # AppLayout, AppHeader, AppFooter (каркас страницы)
│   ├── product/            # всё, что относится к товару
│   │   ├── ProductCard.vue          # карточка товара (превью в сетке каталога)
│   │   ├── ProductGallery.vue       # галерея изображений на странице товара
│   │   ├── ProductSpecs.vue         # таблица характеристик
│   │   └── ProductPrice.vue         # цена (валюта/скидки/форматирование)
│   ├── catalog/            # CatalogFilters, CatalogSort, CatalogSearch, CategoryMenu, Pagination
│   └── cart/               # CartButton (в шапке со счётчиком), CartItem, CartSummary, CartTotal
├── views/                  # страницы = маршруты (1 view = 1 маршрут)
│   ├── CatalogView.vue              # /                — каталог товаров (главная)
│   ├── CategoryView.vue             # /categories/:slug — каталог по категории
│   ├── ProductView.vue              # /products/:id    — страница товара
│   ├── CartView.vue                 # /cart            — корзина
│   ├── CheckoutView.vue             # /checkout        — оформление заказа
│   └── NotFoundView.vue             # /:pathMatch(.*)* — 404
├── router/
│   └── index.ts            # маршруты, lazy-load views, guards
├── stores/                 # Pinia, setup-стиль, 1 сущность = 1 файл
│   ├── cart.ts                      # useCartStore
│   ├── catalog.ts                   # useCatalogStore (список + фильтры + пагинация + сортировка)
│   └── product.ts                   # useProductStore (детали открытого товара)
├── composables/            # переиспользуемая логика: useCart, useProduct, useFilters, usePagination
├── services/               # HTTP-слой: обёртка над fetch + эндпоинты
│   ├── http.ts                      # базовый fetch-клиент (baseURL, JSON, ошибки, типизация)
│   ├── products.service.ts          # getProducts, getProductById, getCategories
│   └── cart.service.ts              # серверная часть корзины (когда потребуется)
├── types/                  # доменные TS-типы (импортируются из services/stores/components)
│   ├── product.ts
│   ├── cart.ts
│   └── category.ts
├── utils/                  # чистые функции без побочных эффектов (format.ts: formatPrice/...)
├── constants/              # SORT_OPTIONS, PAGE_SIZE, имена маршрутов, ключи localStorage
├── App.vue
└── main.ts
```

### Расположение тестов

- **Unit/компонентные** — co-located рядом с кодом в `__tests__/`:
  - `src/components/product/__tests__/ProductCard.spec.ts`
  - `src/stores/__tests__/cart.spec.ts`
- **E2E (Playwright)** — в корневой папке `e2e/`:
  - `e2e/catalog.spec.ts`, `e2e/cart.spec.ts`, `e2e/checkout.spec.ts`

---

## 4. Доменные сущности

Ключевое разграничение: **Product, Category, CartItem — это данные** (лежат в `src/types/`),
а **ProductCard и Catalog — это UI/состояние**, а не типы. Не путать.

### `types/product.ts`

```ts
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number              // integer, в копейках (форматирование — в utils/format.ts)
  oldPrice?: number          // для отображения скидки
  currency: string           // 'RUB'
  categoryId: string         // ссылка на Category
  brand: string
  images: string[]
  specs: ProductSpec[]       // характеристики
  stock: number              // остаток на складе
  rating?: number
  isAvailable: boolean
}

export interface ProductSpec {
  name: string               // «Сокет», «Объём памяти», «Тип памяти»
  value: string              // «AM5», «32 ГБ», «DDR5»
}

export interface ProductListItem {
  // облегчённая проекция для сетки каталога (ProductCard работает с ней)
  id: string
  name: string
  slug: string
  price: number
  oldPrice?: number
  image: string
  brand: string
  isAvailable: boolean
}
```

### `types/category.ts`

```ts
export interface Category {
  id: string
  name: string               // «Процессоры», «Видеокарты», «Материнские платы»...
  slug: string
  parentId: string | null    // иерархия (null = корень)
  icon?: string
}
```

### `types/cart.ts`

```ts
export interface CartItem {
  product: ProductListItem   // снимок ключевых полей на момент добавления
  productId: string
  quantity: number
  unitPrice: number          // фиксируем цену на момент добавления
}

export interface Cart {
  items: CartItem[]
  // totalQuantity / totalPrice — НЕ поля, а getters (computed) в useCartStore
}
```

### Соответствие сущность → файлы

| Сущность / концепт | types | store | service | components | view |
|---|---|---|---|---|---|
| **Товар (Product)** | `product.ts` | `product.ts` | `products.service.ts` | `product/*` | `ProductView.vue` |
| **Карточка товара** | — (UI) | — | — | `ProductCard.vue` | используется в `CatalogView` |
| **Каталог** | — (состояние UI) | `catalog.ts` | `products.service.ts` | `catalog/*` | `CatalogView`, `CategoryView` |
| **Категория** | `category.ts` | (внутри `catalog.ts`) | `products.service.ts` | `CategoryMenu.vue` | `CategoryView` |
| **Корзина** | `cart.ts` | `cart.ts` | `cart.service.ts` | `cart/*` | `CartView`, `CheckoutView` |

### Роль компонентов

- **`ProductCard.vue`** — dumb-компонент: принимает `product: ProductListItem` через props,
  эмитит `add-to-cart`. **Не обращается в стор сам** — добавление в корзину делает
  родитель (через `useCart()`).
- **Каталог** — ответственность `useCatalogStore`: хранит `items`, `filters`, `sort`,
  `page`, `total`; действия `fetchProducts()`, `setFilter()`, `setSort()`, `setPage()`.
- **Корзина** — **клиентская** на старте: состояние в Pinia + persist в `localStorage`.
  Геттеры `totalQuantity` / `totalPrice` — `computed`. Серверный вариант
  (через `cart.service.ts`) — позже отдельной задачей.

---

## 5. Конвенции кода

- Обязателен `<script setup lang="ts">` в `.vue`-файлах.
- Импорты только через алиас `@/...` (настроен в `vite.config.ts` и `tsconfig.app.json`).
- Строгий TypeScript; `any` запрещён — предпочтение явным типам в `src/types/`.
- Имена сторов: `useXxxStore`, setup-синтаксис (как `src/stores/counter.ts`).
- Компоненты — **PascalCase**, один корневой элемент в template (по возможности).
- Имена файлов компонентов — PascalCase (`ProductCard.vue`).
- Composables — `useXxx`, файлы в camelCase (`useCart.ts`).
- dumb-компоненты (презентационные) общаются через **props/emit** и не дёргают сторы напрямую;
  контейнерные компоненты/views подключают сторы и composables.
- Чистые хелперы — в `src/utils/`, без побочных эффектов (удобно тестировать).

---

## 6. Роутинг

Маршруты описываются в `src/router/index.ts`. Views подключаются через **lazy-load**:

```ts
routes: [
  { path: '/', name: 'catalog', component: () => import('@/views/CatalogView.vue') },
  // ...
]
```

### Таблица маршрутов

| Path | Name | View |
|---|---|---|
| `/` | `catalog` | CatalogView |
| `/categories/:slug` | `category` | CategoryView |
| `/products/:id` | `product` | ProductView |
| `/cart` | `cart` | CartView |
| `/checkout` | `checkout` | CheckoutView |
| `/:pathMatch(.*)*` | `not-found` | NotFoundView |

Имена маршрутов выносятся в `src/constants/` (не использовать строковые литералы в коде).

---

## 7. Стилизация

- **Scoped CSS / SCSS** внутри блока `<style scoped>` `.vue`-файла.
- Глобальные UI-библиотеки (Element Plus, PrimeVue, Tailwind и т.п.) **не применяются**.
- Общие значения (цвета, отступы) — в `src/assets/` через CSS-переменные.

### Дизайн-токены и макеты (источник правды)

- **Дизайн-токены** (палитра, тип-шкала, отступы, радиусы, тени, базовые
  компоненты `.btn`/`.card`/`.field`/…) — в `src/assets/styles/base.css`.
  Это единственное место с hex-значениями; в прикладном коде используем
  только CSS-переменные (`var(--accent)`, `var(--sp-4)` и т.п.).
  Файл пока подключается по мере необходимости на этапе вёрстки.
- **UI-макеты страниц** (эталон для вёрстки) — в `design-from-opendesign/`
  (`landing.html`, `catalog.html`, `product.html`, `cart.html`, `index.html`).
  Каждый макет самодостаточен (стили инлайн), содержит финальный внешний вид
  страницы — сверься с ним при реализации соответствующего `view`.

---

## 8. Работа с API

- Нативный `fetch` + собственная тонкая обёртка в `src/services/http.ts`
  (baseURL, JSON-сериализация, нормализация ошибок, типизация ответов).
- Эндпоинты — в `*.service.ts` (`products.service.ts`, `cart.service.ts`).
- Конфигурация (base URL и т.п.) — через переменные окружения Vite
  `import.meta.env.VITE_*` (префикс `VITE_` обязателен).
- Компоненты **не вызывают `fetch` напрямую** — только через `services/` (или через сторы/composables, использующие `services/`).

---

## 9. Тестирование (повышенные требования к покрытию)

Тесты — **не необязательны**. Максимум функционала покрывается тестами обоих уровней.
Фича считается принятой вместе с тестами.

### Unit / компонентные (Vitest)

- Инструменты: Vitest + jsdom + `@vue/test-utils`.
- Расположение: `src/**/__tests__/*.spec.ts` (co-located с кодом).
- Запуск: `pnpm test:unit`.
- Покрывают: чистые функции (`utils/`), сторы (`stores/`), dumb-компоненты
  (props/emit, рендер), composables.

### E2E / интеграционные (Playwright)

- Инструмент: **Playwright** (сценарии пользователя: клики, навигация, потоки корзины/чекаута).
- Расположение: `e2e/*.spec.ts`.
- Запуск: `pnpm test:e2e` (TODO: добавить после подключения Playwright).
- Покрывают сквозные сценарии: каталог → карточка → корзина → чекаут.

### Что тестировать обязательно

- математику корзины (`totalPrice`, `totalQuantity`, изменение количества);
- фильтры/сортировку/пагинацию каталога;
- форматирование цены (`formatPrice`);
- навигацию по маршрутам;
- добавление товара в корзину из `ProductCard`.

---

## 10. Команды

| Команда | Действие |
|---|---|
| `pnpm install` | установка зависимостей |
| `pnpm dev` | dev-сервер с HMR |
| `pnpm build` | type-check + production-сборка |
| `pnpm preview` | предпросмотр production-сборки |
| `pnpm test:unit` | unit/компонентные тесты (Vitest, watch) |
| `pnpm type-check` | проверка типов (`vue-tsc --build`) |
| `pnpm lint` | oxlint + eslint (с `--fix` и кэшем) |
| `pnpm format` | форматирование `src/` через Prettier |
| `pnpm test:e2e` | TODO: Playwright (после подключения) |

Правила Prettier (из `.prettierrc.json`): без точек с запятой, одинарные кавычки,
ширина 100. Отступы — 2 пробела (см. `.editorconfig`).

---

## 11. Git и коммиты

### Conventional Commits

Формат: `type(scope?): subject`

Допустимые `type`:
- `feat` — новая функциональность
- `fix` — исправление бага
- `test` — добавление/правки тестов
- `refactor` — рефакторинг без изменения поведения
- `docs` — документация (в т.ч. этот файл)
- `style` — форматирование, не меняющий логику
- `perf` — улучшение производительности
- `ci` — CI-конфигурация
- `build` — сборка/зависимости
- `chore` — прочие рутинные задачи

Примеры: `feat(cart): добавлен пересчёт итога`, `fix(catalog): фильтр по бренду`,
`test(product): покрыт ProductCard`.

### Правила

- Агент **не делает `git add` / `commit` / `push` без явного запроса пользователя**.
- Перед коммитом инспектировать `git status`, `git diff`, `git log --oneline -10`;
- стагировать только intended-файлы, никогда не коммитить секреты.
- Не делать `--amend`, force-push, пустые коммиты без явного запроса.

---

## 12. Контракт агента

При работе над задачей агент **обязан**:

1. Сначала изучить контекст: соседние файлы, конвенции, существующие паттерны
   (использовать Glob/Grep/Read).
2. Следовать существующему стилю кода и не менять конфигурацию
   (ESLint/Prettier/TS/Vite) без запроса.
3. **Перед завершением задачи** прогонять:
   ```sh
   pnpm lint
   pnpm type-check
   pnpm test:unit
   ```
   Если что-то упало — чинить, а не игнорировать. Если команду не удалось
   найти — уточнить у пользователя и записать в этот файл.
4. Не добавлять новые зависимости без согласования с пользователем.
5. Не создавать файлы документации (`*.md`) без явного запроса.
6. Не добавлять комментарии в код без необходимости (следовать разделу «Code style»).
7. Покрывать новую функциональность тестами (см. раздел 9).
8. Соблюдать Conventional Commits и не коммитить без запроса (см. раздел 11).
9. Все правки вносить, опираясь на плоскую архитектуру (раздел 3) и доменные
   сущности (раздел 4); при сомнениях — задавать вопрос, а не додумывать.

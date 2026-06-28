# План 01 — UI-кит базовых компонентов (Base*)

- **Статус:** готов к выполнению
- **Дата:** 2026-06-28
- **Связанные артефакты:**
  - Дизайн-система: `src/assets/styles/base.css` (единственный источник истины)
  - Скилл: `.opencode/skills/design-system-fidelity/SKILL.md`
  - Макеты: `design-from-opendesign/{landing,catalog,product,cart}.html`
  - Контракт: `AGENTS.md` (раздел 3 — `components/common/`, раздел 9 — тесты)

---

## 1. Цель

Построить переиспользуемый UI-кит (`src/components/common/`) — типизированные
Vue-обёртки над дизайн-системой из `base.css`. Компоненты **композируют** классы
и токены, никогда их не дублируя (см. скилл `design-system-fidelity`).

Кит покрывает два уровня:
- **Tier 1 — ядро:** примитивы поверх уже существующих классов `base.css`.
- **Tier 2 — составные:** паттерны из макетов, которых пока нет в `base.css`
  (для них сначала добавляем классы в `base.css`, затем оборачиваем).

Дополнительно строится **страница-витрина** `/ui-kit` для визуальной проверки
фидельности и регресса вёрстки.

---

## 2. Границы scope

### В scope

- 28 `Base*`-компонентов в `src/components/common/` (см. раздел 4).
- Расширение `base.css` недостающими классами (раздел 5).
- Набор иконок `src/assets/icons/` + `BaseIcon`.
- Страница-витрина `views/UiKitView.vue` + dev-маршрут `/ui-kit`.
- Co-located компонентные тесты (Vitest + @vue/test-utils).

### Вне scope (отдельные задачи)

- Доменные карточки: `ProductCard`, `CartItem`, `CatalogFilters`,
  `ProductSpecs`, доменный `ProductGallery`. (Tier 3 — строятся поверх кита.)
- Каркас приложения: `AppLayout`, `AppHeader`, `AppFooter`.
- Реконсил `.ph-img` vs `.product-mark` — относится к доменным карточкам.
- Классы `.pcard`, `.specs-table` — строятся вместе с Tier 3.
- Реальные маршруты/данные/stores/services фич.

---

## 3. Управляющий принцип (fidelity)

Каждый компонент реализуется по рецепту из скилла `design-system-fidelity`:

1. **AUDIT** — прочитать `base.css`, найти класс, реализующий нужный паттерн;
   открыть матчинг-макет в `design-from-opendesign/` для эталонного вида.
2. **COMPOSE** — применить существующий глобальный класс в шаблоне.
3. **EXTEND WITH TOKENS** — если класса нет — добавить в `base.css`, затем
   использовать; scoped-CSS содержит **только** `var(--…)` для layout, уникального
   компоненту.
4. **VERIFY** — scoped-CSS не содержит рестейтментов базового класса.

**Диагностическое правило:** если в `<style scoped>` есть набор свойств
(цвета/padding/radius/типографика/transition), повторяющий класс из `base.css`,
это дублирование → вернуться к шагу 2.

`base.css` — единственное место с hex; в коде компонентов только `var(--…)`.

---

## 4. Инвентарь компонентов

### Tier 1 — ядро (композируют существующий `base.css`)

| Компонент | Композирует | Ключевой API (props / emits) |
|---|---|---|
| `BaseIcon` | набор `assets/icons/` (без класса) | `name: string` \| slot fallback |
| `BaseButton` | `.btn` + `-primary/-secondary/-outline/-ghost`, `-sm`, `-block`, `-arrow`, `:disabled` | `variant`, `size?: 'sm'`, `block`, `arrow`, `loading`, `disabled`, `type`; slots `default`, `icon` |
| `BaseIconButton` | `.iconbtn`, `aria-pressed` | `pressed`, `aria-label` (обяз.); slot `icon` |
| `BaseInput` | `.input` | `v-model`, `type`, `placeholder`, `invalid`, `id`, `disabled`; slots `prefix`/`suffix` |
| `BaseTextarea` | `.textarea` | `v-model`, `rows`, `placeholder`, `disabled` |
| `BaseSelect` | нативный `.select` | `v-model`, `options: {value,label}[]`, `disabled` |
| `BaseField` | `.field`, `.field-help` | `label`, `help`, `error`, `required`, `htmlFor`; default slot + `#control` |
| `BaseCheckbox` | `.check` **(апгрейд до custom-box)**, `.check .count`, `.check.disabled` | `v-model`, `label`, `count?`, `disabled` |
| `BaseQty` | `.qty` **(+новые `-sm`/`-lg`)** | `v-model:number`, `min`, `max`, `step`, `size?: 'sm'|'lg'`; emits `change` |
| `BaseRating` | `.rating .stars` | `value`, `max`, `count?`, `readonly` |
| `BaseCard` | `.card`/`.card-flat`/`.card-hover` | `flat`, `hover`, `as` (tag); default slot |
| `BaseBadge` | `.pill`/`.pill-success`/`.pill-neutral` | `variant: 'accent'|'success'|'neutral'` |
| `BaseTag` | `.tag` | default slot |
| `BaseChip` | `.chip` **(+removable, +`.accent`)** | `pressed`, `removable`, `variant`; emits `remove`, `toggle` |
| `BaseBreadcrumb` | `.crumb` | `items: {label, to?}[]`; slot `separator` |

### Tier 2 — составные (требуют добавления классов в `base.css`)

| Компонент | Классы в `base.css` | Интерактив / a11y |
|---|---|---|
| `BaseModal` | новые `.modal`/`-backdrop`/`-panel`/`-header`/`-body`/`-footer`/`-close` | Teleport, focus-trap, ESC, click-outside, `role="dialog"`, `aria-modal` |
| `BaseDropdown` | новые `.dropdown`/`-trigger`/`-menu`/`-item` | `v-model:open`, keyboard nav (Arrow/Enter/ESC), click-outside |
| `BaseToast` | новые `.toast`/`-container` + варианты | Pinia `useToastStore`, авто-dismiss, стек, `role="status"` |
| `BaseTooltip` | новые `.tooltip` | hover/focus-триггер, Teleport, `placement`, `role="tooltip"` |
| `BaseAlert` | новые `.alert` + варианты info/success/warning/danger (из `.promo-strip`/`.coupon-applied`) | `variant`, `icon?`, `title`; slot |
| `BaseTabs` | перенять `.tabs`/`.tab`/`.tab.active`/`.tab-panel` | `v-model`, `items: {id,label,count?}[]`; `role="tablist/tab/tabpanel"` |
| `BasePagination` | перенять `.pager`/`.pager-pages`/`.dots`/`.active` | `page`, `total`, `perPage`; emits `change` |
| `BaseSegmented` | перенять `.seg` + `.pay-row`/`.pay-opt` | `v-model`, `options`, `variant: 'icon'|'text'` |
| `BaseRadioGroup` | перенять `.radio-list`/`.radio`/`.radio.active`/`.dot` | `v-model`, `options: {value,label,price?}[]`; `role="radiogroup/radio"` |
| `BaseStepper` | перенять `.steps`/`.step`/`.step.active`/`.step.done`/`.steps-sep` | `steps: {label}[]`, `current` |
| `BaseSkeleton` | новые `.skeleton` | `shape: 'text'|'rect'|'circle'|'line'`, `width`, `height`, `lines` |
| `BaseEmptyState` | новые `.empty-state` | `icon?`, `title`, `description`; slot `action` |
| `BaseGallery` | перенять `.gallery`/`.gallery-main`/`.gallery-nav`/`.thumbs`/`.thumb` | `images: string[]`, `v-model:activeIndex` |

**Итого: 28 компонентов** (15 Tier 1 + 13 Tier 2).

---

## 5. Объём правок `base.css`

### Аппгрейды существующих классов

- `.check` → заменить нативный `accent-color` на custom-box визуал из макета
  (`catalog.html` → `.check .box`, `:checked` рисует галочку border'ами), добавить
  `.check .count`, `.check.disabled`. Это **единственное** поведение-несовместимое
  изменение — выделить отдельным коммитом.
- `.chip` → добавить removable-кнопку (`.chip button`) и вариант `.chip.accent`
  (из `catalog.html` → `.active-chips`).
- `.qty` → добавить размерные модификаторы `.qty-sm` (36px) и `.qty-lg` (52px)
  под две высоты из макетов (`cart.html`, `product.html`).

### Новые семейства классов (Tier 2)

- Overlay/диалоги: `.modal`, `.modal-backdrop`, `.modal-panel`, `.modal-header`,
  `.modal-body`, `.modal-footer`, `.modal-close`.
- Выпадашки: `.dropdown`, `.dropdown-trigger`, `.dropdown-menu`, `.dropdown-item`.
- Тосты: `.toast`, `.toast-container`, `.toast--success/-error/-info`.
- Тултип: `.tooltip`, `.tooltip--top/right/bottom/left`.
- Алерт: `.alert`, `.alert--info/-success/-warning/-danger` (обобщить
  `.promo-strip`/`.coupon-applied`).
- Состояния: `.skeleton`, `.empty-state`.
- Перенятые из макетов: `.tabs`/`.tab`/`.tab-panel`, `.pager`/`.pager-pages`,
  `.seg`, `.pay-row`/`.pay-opt`, `.radio-list`/`.radio`, `.steps`/`.step`,
  `.gallery`/`.thumbs`/`.thumb`.

### Разрешение конфликтов имён (base.css — источник истины)

| Макет | Принимаем | Почему |
|---|---|---|
| `.crumbs` | `.crumb` (base.css) | fidelity skill |
| `.icon_btn` / `.icon-btn` | `.iconbtn` (base.css) | fidelity skill |
| `.pcard`, `.specs-table`, `.product-mark` | отложено | Tier 3, вне scope |

### Иконки

Вынести SVG-набор из макетов в `src/assets/icons/` (по одному файлу на иконку:
`cart`, `search`, `heart`, `compare`, `star`, `chevron-down`, `close`, `check`,
`arrow-left/right`, …). `BaseIcon` рендерит по `name`; fallback — slot с inline SVG.

---

## 6. Конвенции компонентов

- `<script setup lang="ts">`, импорты через `@/…`, строгий TS, без `any`.
- Один компонент — один файл в `src/components/common/`.
- Варианты — строковые union-типы, маппятся в базовые классы в шаблоне:
  ```vue
  <button :class="['btn', `btn-${variant}`, { 'btn-sm': size === 'sm', 'btn-block': block }]">
  ```
- `<style scoped>` — пустой или содержит **только** `var(--…)` для layout,
  уникального компоненту (никаких рестейтментов).
- `v-model` с дефолтами; типизированные `defineProps`/`defineEmits`.
- dumb-компоненты — только props/emit, без сторов. Исключение: `BaseToast`
  читает `useToastStore`.
- a11y встроена: ARIA-роли, keyboard (ESC/Arrows/Enter), `:focus-visible` через токены.
- Имена файлов — PascalCase; без комментариев в коде (AGENTS §5).

---

## 7. Тестирование (AGENTS §9)

Каждый компонент получает co-located `src/components/common/__tests__/<Name>.spec.ts`.

Покрывать обязательно:
- корректные базовые классы применяются при разных вариантах props;
- `v-model` двусторонний; emits (`remove`, `toggle`, `change`, `update:*`…);
- `disabled`, `aria-*`, `role`;
- интерактив: Modal (open/ESC/click-outside/focus-trap), Dropdown (keyboard nav),
  Toast (auto-dismiss), Tabs/Pagination/Segmented/Radio (смена значения).

Проверка каждого среза:
```sh
pnpm lint && pnpm type-check && pnpm test:unit
```

---

## 8. Витрина `/ui-kit`

- `src/views/UiKitView.vue` — секция на каждый компонент, все варианты/состояния
  рядом; референс-класс макета по возможности.
- Маршрут `/ui-kit`, имя — в `src/constants/` (например `ROUTE_NAMES.uiKit`).
  Lazy-load, **dev-only**: не входит в основную навигацию.
- В App `BaseToastContainer` монтируется глобально (для теста тостов на витрине).

---

## 9. Порядок исполнения (вертикальные срезы)

Каждый срез = `base.css`-класс (если нужен) → компонент → `*.spec.ts` →
секция витрины → зелёные `lint`/`type-check`/`test:unit`.

### Phase 0 — фундамент
- [ ] Создать `src/components/common/`.
- [ ] Вынести набор иконок в `src/assets/icons/`.
- [ ] `BaseIcon` (+ тест).
- [ ] `BaseButton`, `BaseIconButton` (+ тесты).
- [ ] Scaffold `UiKitView.vue` + маршрут `/ui-kit` + имя в константах.
- [ ] Глобально монтировать `BaseToastContainer` (заглушка).

### Group A — формы
- [ ] `BaseField`, `BaseInput`, `BaseTextarea`, `BaseSelect`
- [ ] `BaseCheckbox` (+ аппгрейд `.check` в `base.css`)
- [ ] `BaseQty` (+ `.qty-sm`/`-lg`)

### Group B — поверхности и теги
- [ ] `BaseCard`, `BaseBadge`, `BaseTag`
- [ ] `BaseChip` (+ removable/`.accent` в `base.css`)
- [ ] `BaseRating`, `BaseBreadcrumb`

### Group C — интерактивный композит
- [ ] `BaseModal` (+ `.modal*`), `BaseDropdown` (+ `.dropdown*`)
- [ ] `BaseTooltip` (+ `.tooltip*`), `BaseAlert` (+ `.alert*`)
- [ ] `BaseToast` (+ `useToastStore`, `.toast*`)

### Group D — данные/навигация + состояния
- [ ] `BaseTabs`, `BasePagination`, `BaseSegmented`, `BaseRadioGroup`, `BaseStepper`
- [ ] `BaseSkeleton`, `BaseEmptyState`
- [ ] `BaseGallery`

---

## 10. Definition of Done

- Все 28 компонентов реализованы в `src/components/common/`.
- Каждый компонент имеет зелёный co-located тест.
- `base.css` расширен недостающими классами; конфликтов имён с макетами нет
  (в пределах scope).
- Витрина `/ui-kit` рендерит все компоненты во всех состояниях.
- `pnpm lint`, `pnpm type-check`, `pnpm test:unit` — чисто.
- Соблюдён принцип fidelity: ни один `<style scoped>` не рестейтит базовый класс.

---

## 11. Риски и заметки

- **Аппгрейд `.check`** — единственное поведение-несовместимое изменение; выделить
  отдельным коммитом `refactor(styles): custom checkbox visual`.
- **Паттерны вне макетов** (modal/toast/tooltip/skeleton/empty/dropdown-open)
  экстраполируются строго по токенам; при расхождении с будущими макетами —
  правится только `base.css`, компоненты не затрагиваются.
- **Focus-trap / Teleport / позиционирование tooltip** — реализовать через
  composable в `src/composables/` (`useFocusTrap`, `useFloating`), если
  потребуется переиспользование; иначе inline в компоненте. Новых зависимостей
  не вводить (AGENTS §12.4) без согласования.
- Имена маршрутов выносить в `src/constants/` (AGENTS §6).

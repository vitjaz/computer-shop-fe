---
name: design-system-fidelity
description: Use when implementing or styling any Vue component — before writing scoped CSS, adding visual styles, or building UI like buttons, cards, fields, inputs, product cards. Triggers on component styling, scoped CSS, CSS variables, design tokens, or reproducing an existing visual pattern.
compatibility: opencode
---

# Design System Fidelity

## Core Principle

`src/assets/styles/base.css` is the **single source of truth** for the design
system — tokens in `:root` and base component classes (`.btn`, `.card`,
`.field`, …). A Vue component is a structural, typed wrapper **over** this
system. It **composes** existing classes and tokens. It never **restates**
them in its own scoped CSS.

Violating this creates a second source of truth that drifts from the original
the moment either side changes.

## The Recipe

Produce a component's styling in this exact order. Step 2 is the one agents skip.

1. **AUDIT** — Before writing any `<style scoped>`, read
   `src/assets/styles/base.css` and grep for existing classes that implement
   the visual pattern you need. Open the matching mockup in
   `design-from-opendesign/` for the reference appearance.
2. **COMPOSE** — If a base class already implements the pattern, apply it on
   the element (global class in the template) and delegate the visuals to it.
   Do **not** restate that class's properties inside scoped CSS.
3. **EXTEND WITH TOKENS** — If no base class fits, write scoped styles using
   **only** `var(--…)` tokens. If a token you need does not exist, add it to
   `:root` in `base.css`, then reference it from the component.
4. **VERIFY** — Confirm the `<style scoped>` block contains zero restatements
   of an existing base class. Diagnostic: if it holds a property set (colors,
   padding, radius, typography, transitions) that mirrors a class in
   `base.css`, you are duplicating — return to step 2.

## What `<style scoped>` IS

A component's scoped styles are, by contract:

- **empty** when an existing base class already covers the visuals, **or**
- **token-only** rules for layout/structure genuinely unique to this
  component (slot arrangement, component-specific composition).

They are **never** a restatement of a base class's visual properties — a
button's colors/padding/radius, a card's surface/border, a field's input
styling all live in `base.css` and stay there.

## Base class families in `base.css` (grep for the exact name)

| Family | Examples |
|---|---|
| Buttons | `.btn`, `.btn-primary/-secondary/-outline/-ghost`, `.btn-sm`, `.btn-block`, `.btn-arrow` |
| Surfaces | `.card`, `.card-flat`, `.card-hover` |
| Forms | `.field`, `.input`, `.select`, `.textarea`, `.check` |
| Tags | `.pill`, `.pill-success/-neutral`, `.tag`, `.chip` |
| Layout | `.container`, `.section`, `.stack`, `.row`, `.row-between`, `.grid-2/3/4` |
| Type | `.h1`–`.h4`, `.lead`, `.eyebrow`, `.meta`, `.num`, `.muted`, `.accent` |
| Product | `.product-card`, `.product-media`, `.product-body`, `.product-brand`, `.product-title`, `.product-specs`, `.product-foot`, `.product-price`, `.price-now/-old` |
| Misc | `.qty`, `.rating`, `.ph-img`, `.crumb`, `.ds-table`, `.filter-group`, `.range-double`, `.iconbtn`, `.badge-count`, `.topnav`, `.pagefoot` |

Token families: colors (`--accent`, `--accent-on/-hover/-active/-soft`,
`--fg`, `--fg-2`, `--muted`, `--meta`, `--surface`, `--surface-warm`, `--border`,
`--border-soft`, `--success`, `--danger`), spacing (`--sp-1`…`--sp-20`, 8px
grid), radius (`--radius-sm`, `--radius`, `--radius-lg`, `--radius-pill`),
type (`--fs-h1`…`--fs-xs`, `--font-display/-body/-mono`), motion
(`--motion-fast`, `--motion-base`, `--ease`).

## Example (real, from this project's baseline)

**Wrong — duplicate.** Scoped CSS restates the button base class, copying its
px values one-to-one. Two sources of truth → drift.

```vue
<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 11px 20px;            /* copied from .btn */
  border-radius: var(--radius);
}
.base-btn--primary {
  background: var(--accent);     /* restates .btn-primary */
  color: var(--accent-on);
  border-color: var(--accent);
}
</style>
```

**Right — compose.** Apply the existing global classes; scoped styles stay
empty. One source of truth.

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-sm': size === 'sm', 'btn-block': block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot name="icon" /><slot />
  </button>
</template>

<style scoped></style>
```

## Rationalization to Reject

> "I'll duplicate the base class into scoped BEM classes so the component is
> self-contained and portable."

Portability comes **from** the design system, not from embedding a copy of
it. A duplicated class is a second source of truth that drifts the instant
either side changes. A component is faithful when it **composes** the system —
not when it contains a clone of it. If the clone ever needs to differ from the
original, that is a new token or a new base class in `base.css`, not a
divergent copy inside one component.

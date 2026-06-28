import { describe, it, expect, afterEach } from 'vitest'

import { mount } from '@vue/test-utils'

import BaseModal from '../BaseModal.vue'

function modal(query: string): HTMLElement {
  const el = document.querySelector(query)
  if (!el) throw new Error(`no element for ${query}`)
  return el as HTMLElement
}

function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

function keydown(el: HTMLElement, key: string, shiftKey = false) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
}

let wrapper: ReturnType<typeof mount> | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

describe('BaseModal', () => {
  it('renders nothing (no dialog) when modelValue is false', () => {
    wrapper = mount(BaseModal, { props: { modelValue: false } })

    expect(document.querySelector('.modal')).toBeNull()
    expect(document.querySelector('.modal-backdrop')).toBeNull()
  })

  it('renders a dialog with role=dialog and aria-modal=true when open', () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    const dialog = modal('[role="dialog"]')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.classList.contains('modal')).toBe(true)
  })

  it('teleports the dialog to document.body', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true },
      attachTo: document.body,
    })

    expect(document.body.querySelector('.modal-backdrop')).not.toBeNull()
  })

  it('renders the title in .modal-title and links it via aria-labelledby', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true, title: 'Подтверждение' },
    })

    const title = modal('.modal-title')
    expect(title.textContent).toBe('Подтверждение')

    const dialog = modal('[role="dialog"]')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(labelledBy).toBe(title.id)
  })

  it('uses ariaLabel as aria-label when no title is provided', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true, ariaLabel: 'Диалог покупки' },
    })

    const dialog = modal('[role="dialog"]')
    expect(dialog.getAttribute('aria-label')).toBe('Диалог покупки')
    expect(dialog.getAttribute('aria-labelledby')).toBeFalsy()
    expect(document.querySelector('.modal-title')).toBeNull()
  })

  it('emits update:modelValue false when Escape is pressed on the panel', async () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    keydown(modal('.modal'), 'Escape')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits update:modelValue false when the backdrop is clicked', async () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    const backdrop = modal('.modal-backdrop')
    click(backdrop)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('does NOT emit when a click lands inside the panel', async () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true },
      slots: { default: '<p data-test="body">тело</p>' },
    })

    click(modal('[data-test="body"]'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders the close button by default and closes on click', async () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    const closeBtn = document.querySelector('.modal-close')
    expect(closeBtn).not.toBeNull()
    expect(closeBtn?.getAttribute('aria-label')).toBe('Закрыть')

    click(modal('.modal-close'))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('omits the close button when hideClose is true', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true, hideClose: true },
    })

    expect(document.querySelector('.modal-close')).toBeNull()
  })

  it('renders the default slot inside .modal-body', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true },
      slots: { default: '<p data-test="msg">тело диалога</p>' },
    })

    expect(modal('.modal-body [data-test="msg"]').textContent).toBe('тело диалога')
  })

  it('renders the footer slot inside .modal-footer when provided', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true },
      slots: { footer: '<button data-test="ok">ОК</button>' },
    })

    expect(modal('.modal-footer [data-test="ok"]').textContent).toBe('ОК')
  })

  it('omits .modal-footer entirely when no footer slot is provided', () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    expect(document.querySelector('.modal-footer')).toBeNull()
  })

  it('renders a header slot override and drops the default header', () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true, title: 'ignored' },
      slots: { header: '<div data-test="hd">свой заголовок</div>' },
    })

    expect(document.querySelector('.modal-title')).toBeNull()
    expect(modal('[data-test="hd"]').textContent).toBe('свой заголовок')
  })

  it('moves focus to the dialog panel when opened on mount', async () => {
    wrapper = mount(BaseModal, {
      props: { modelValue: true },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(modal('.modal'))
  })

  it('locks body scroll while open', () => {
    wrapper = mount(BaseModal, { props: { modelValue: true } })

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll and focuses the trigger when closed', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    wrapper = mount(BaseModal, { props: { modelValue: true } })
    await wrapper.vm.$nextTick()

    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()

    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
  })
})

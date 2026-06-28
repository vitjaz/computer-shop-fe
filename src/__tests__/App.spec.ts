import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { defineComponent, h, type Component } from 'vue'
import { createPinia } from 'pinia'

import App from '../App.vue'

const RouterViewStub: Component = defineComponent({
  name: 'RouterView',
  render: () => h('div', { 'data-test': 'router-view' }),
})

describe('App', () => {
  it('mounts the router outlet and the global toast container', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterView: RouterViewStub,
          teleport: true,
        },
      },
    })

    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
    expect(wrapper.find('.toast-container').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('You did it!')
  })
})

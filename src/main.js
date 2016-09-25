import './styles/main.styl'

import Vue from 'vue'
import { Icon, Btn } from './uis'
import { headicons } from './utils'
import App from './app'
import router from './router'

// Set headicon
headicons()

// Register global components and directives
Vue.component('icon', Icon)
Vue.component('btn', Btn)

// Start App
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

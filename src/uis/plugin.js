import * as uis from './index'

function install (Vue, options) {
  if (install.installed) return
  install.installed = true

  // Utils
  Vue.directive(uis.VClickOutside.name, uis.VClickOutside)

  // Generics
  Vue.component(uis.Icon.name, uis.Icon)
  Vue.component(uis.Btn.name, uis.Btn)

  // UXs
  Vue.component(uis.ToastsManager.name, uis.ToastsManager)
  Vue.component(uis.Dropdown.name, uis.Dropdown)
}

export default class UIPlugin {}
UIPlugin.install = install

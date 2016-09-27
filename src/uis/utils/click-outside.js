/**
 * Click Outside Directive
 * REF: https://github.com/ElemeFE/element/blob/master/src/utils/clickoutside.js
 *
 * @example
 * <div v-click-outside="handler"></div>
 */

const clickoutsideContext = '@@clickoutsideContext'

export default {
  name: 'click-outside',

  bind (el, binding, vnode) {
    const documentHandler = function (e) {
      if (vnode.context && !el.contains(e.target)) {
        vnode.context[el[clickoutsideContext].methodName](e)
      }
    }
    el[clickoutsideContext] = {
      documentHandler,
      methodName: binding.expression
    }
    document.addEventListener('click', documentHandler)
  },

  update (el, binding) {
    el[clickoutsideContext].methodName = binding.expression
  },

  unbind (el) {
    document.removeEventListener('click', el[clickoutsideContext].documentHandler)
  }
}

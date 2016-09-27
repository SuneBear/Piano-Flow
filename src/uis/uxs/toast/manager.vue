<template>
  <transition-group tag="div" class="toasts-manager-container" :class="classesOfPosition">
    <toast
      v-for="(toast, $index) in toasts" :key="toast.id"
      :id="toast.id"
      :position="$index"
      :message="toast.message"
      :tips="toast.tips"
      :options="toast.options"
    ></toast>
  </transition-group>
</template>

<script>
import _ from 'lodash'
import _bus from './_bus'
import Toast from './toast'

const defaultOptions = {
  maxToasts: 5,
  position: 'left bottom'
}

export default {
  name: 'toasts-manager',

  components: {
    Toast
  },

  data () {
    return {
      toasts: [],
      options: defaultOptions
    }
  },

  computed: {
    classesOfPosition () {
      return this._updateClassesOfPosition(this.options.position)
    },
    directionOfJumping () {
      return this._updateDirectionOfJumping(this.options.position)
    }
  },

  beforeCreate () {
    _bus.$on('removeToast', id => this.removeToast(id))
  },

  methods: {
    /**
     * show
     * @param  {String} options.msg
     * @param  {String} options.tips
     * @param  {String} options.type
     * @param  {Number} options.duration
     */
    show ({ msg, tips = '', type = 'success', duration = 5000 }) {
      const options = {
        tips: tips,
        theme: type,
        timeLife: duration
      }
      this._addToast(msg, options)
      this._moveToast()
    },

    removeToast (id) {
      const i = this.toasts.findIndex(el => el.id === id)
      if (i !== -1) this.toasts.splice(i, 1)
      this._moveToast()
    },

    _moveToast () {
      this.toasts = _.takeRight(this.toasts, this.options.maxToasts > 0 ? this.options.maxToasts : 9999)
    },

    _genId () {
      return `${+new Date}${Math.floor((1 + Math.random()) * 0x10000).toString(16)}`
    },

    _addToast (message, options = {}) {
      if (!message) return
      options.directionOfJumping = this.directionOfJumping
      this.toasts.push({
        id: this._genId(),
        message,
        options
      })
    },

    _updateClassesOfPosition (position) {
      return position.split(' ').reduce((prev, val) => {
        prev[`position-${val.toLowerCase()}`] = true
        return prev
      }, {})
    },

    _updateDirectionOfJumping (position) {
      return position.match(/top/i) ? '+' : '-'
    }
  }
}
</script>

<template>
<div class="toast-container"
  :class="[theme, {
    'has-tips': options.tips
  }]" v-show="isShow" :data-id="id">
  <div class="toast-message">
    <span>
      <icon :symbol="themeSymbol"></icon>
      <span class="toast-message-body">{{message}}</span>
    </span>
    <span class="toast-tips" v-if="options.tips">{{options.tips}}</span>
    <span class="toast-close-btn" @click="remove"></span>
  </div>
</div>
</template>

<script>
import Icon from '../../generics/icon'
import _bus from './_bus'

const defaultOptions = {
  tips: '',
  theme: 'default', // info warning error success
  timeLife: 5000
}

export default {
  name: 'toast',

  props: {
    id: String,
    message: String,
    position: Number,
    options: {
      type: Object,
      coerce(options) {
        return Object.assign({}, defaultOptions, options)
      }
    }
  },

  components: {
    Icon
  },

  data () {
    return {
      isShow: false
    }
  },

  computed: {
    theme () {
      return 'status-' + this.options.theme
    },
    themeSymbol () {
      switch (this.options.theme) {
        case 'info':
          return 'circle-info'
        case 'error':
          return 'circle-remove'
        case 'warning':
          return 'warning'
        case 'success':
          return 'state-check'
      }
    },
    style () {
      return `transform: translateY(${this.options.directionOfJumping}${this.position * 100}%)`
    }
  },

  created () {
    setTimeout(() => this.isShow = true, 50)
    this._startTimer()
  },

  beforeDestroy () {
    this._clearTimer()
  },

  methods: {
    // Public
    remove () {
      _bus.$emit('removeToast', this.id)
    },

    // Private
    _startTimer () {
      this._clearTimer()
      this.timerDestroy = setTimeout(() => {
        this.remove()
      }, this.options.timeLife)
    },

    _clearTimer () {
      if (this.timerDestroy) {
        clearTimeout(this.timerDestroy)
      }
    }
  }
}
</script>

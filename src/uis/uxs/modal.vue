<template>
  <transition>
    <div class="modal-wrap" v-show="value" @click.self="handleWrapperClick">
      <div class="modal" :class="[sizeClass, customClass]" ref="modal" :style="{ 'margin-bottom': size !== 'full' ? '50px' : '', 'top': size !== 'full' ? dynamicTop + 'px' : '0' }">
        <div class="modal-header" v-if="title">
          <span class="modal-title">{{title}}</span>
          <icon symbol="remove" class="modal-close" @click.native="close"></icon>
        </div>
        <icon symbol="remove" class="modal-close" @click.native="close" v-else></icon>
        <div class="modal-body" v-if="rendered"><slot></slot></div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'vue-popup'
import Icon from '../generics/icon'

/**
 * Modal UX Component
 *
 * REF: https://github.com/ElemeFE/element/blob/master/packages/dialog/src/component.vue
 */
export default {
  name: 'modal',

  mixins: [ Popup ],

  components: {
    Icon
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickWrap: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'normal'
    },
    customClass: {
      type: String,
      default: ''
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },

  data() {
    return {
      dynamicTop: 0
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.$emit('open')
        this.$nextTick(() => {
          this.$refs.modal.scrollTop = 0
        })
      } else {
        this.$emit('close')
      }
    }
  },

  computed: {
    sizeClass() {
      return `size-${ this.size }`
    }
  },

  mounted() {
    if (this.value) {
      this.rendered = true
      this.open()
    }
    window.addEventListener('resize', this.resetTop)
    this.resetTop()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resetTop)
  },

  methods: {
    handleWrapperClick() {
      if (this.closeOnClickWrap) {
        this.$emit('input', false)
      }
    },
    resetTop() {
      this.dynamicTop = Math.floor((window.innerHeight || document.documentElement.clientHeight) * 0.16)
    }
  }
}
</script>

<style lang="stylus">
@require '../../styles/ref'

// The backdrop transition is suck
@keyframes v-modal-in
  from
    opacity: 0
  to
    opacity: 1

@keyframes v-modal-out
  to
    opacity: 0

.v-modal // Backdrop
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
  opacity: .90
  background: $gray97

  &-enter
    animation: v-modal-in 200ms ease

  &-leave
    animation: v-modal-out 200ms ease forwards

.modal-wrap
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  overflow: auto
  // REF: http://zomigi.com/blog/css3-transitions-and-z-index/
  transition: transform 318ms, opacity 318ms

  &.v-enter,
  &.v-leave-active
    transform: translate3d(0, -20px, 0)
    opacity: 0

.modal
  position: relative
  margin-left: auto
  margin-right: auto
  background: alpha($white, 26%)
  padding: 25px
  border: 2px solid currentColor
  border-radius: $radius
  box-shadow: $shadow

  &.size-normal
    width: 100%
    max-width: 600px

  &.size-full
    max-width: 1024px
    background: alpha($white, 90%)
    border: 0
    padding: 40px

    .modal-close
      top: 30px
      right: 30px
      font-size: 20px
      color: #808080

  &-header
    position: relative
    padding-bottom: 17px
    margin-top: 5px
    margin-bottom: 20px
    border-bottom: 2px solid currentColor
    font-size: 24px

  &-title
    display: block
    line-height: 1
    vertical-align: middle
    padding-right: 60px
    text-overflow()

  &-close
    position: absolute
    font-size: 85%
    right: 0
    top: 2px
    cursor: pointer
    transition: all 318ms

    &:hover
      color: $red !important

  &-body
    font-size: 120%

</style>

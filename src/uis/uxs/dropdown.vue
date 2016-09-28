<template>
<div class="dropdown" :class="{ 'is-open': isOpen }">
  <div class="dropdown-toggler" @click="toggle" v-click-outside="close">
    <slot name="toggler"></slot>
  </div>
  <transition name="slide-transition">
  <div class="dropdown-menu" ref="menu" v-if="isOpen">
    <slot></slot>
  </div>
  </transition>
</div>
</template>

<script>
/**
 * Dropdown UX Component
 * Compatible with Bootstrap: Replace `.dropdown"` to `<dropdown>`
 *
 * @example
 * <dropdown>
 *   <btn icon="menu" slot="toggler"></btn>
 *   <div>Dropdown Content</div>
 * </dropdown>
 */

import VClickOutside from '../utils/click-outside'

export default {
  name: 'dropdown',

  props: {
    isInteractive: {
      type: Boolean,
      default: false
    },
    canToggle: {
      type: Boolean,
      default: true
    },
    onOpen: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      isOpen: false
    }
  },

  components: {
    VClickOutside
  },

  methods: {
    toggle () {
      if (this.isOpen && this.canToggle) {
        this.close()
      } else if (!this.isOpen) {
        this.open()
      }
    },

    open () {
      this.isOpen = true
      this.onOpen()
    },

    close ($event) {
      const $menu = this.$refs.menu
      if ($event && this.isInteractive && $menu.contains($event.target)) return
      this.isOpen = false
      this.onClose()
    }
  }
}
</script>

<style lang="stylus">
@import '../../styles/ref'

.dropdown
  &.is-open
    .dropdown-toggler
      color: darken($gray50, 25%)
      background-color: alpha($gray50, 15%)

.dropdown-toggler
  transition: all 318ms
  display: inline-block

.dropdown-menu
  background: alpha($gray50, 15%)
  min-width: 180px
  max-width: 240px

  &.slide-transition
    transition: 218ms

    &-enter,
    &-leave-active
      transform: translateY(15px)

  li
    padding: 6px 12px
    padding-right: 40px
    opacity: 0.8
    cursor: pointer
    transition: all 318ms
    text-overflow()

    &:after
      content: ' '
      display: block
      position: absolute
      top: 50%
      right: 20px
      width: 5px
      height: 5px
      margin-top: -2.5px
      background: currentColor
      border-radius: 50%
      opacity: 0
      transition: transform 418ms, opacity 318ms
      transform: translate3D(25px, 0 ,0)

    &.is-active
      background: alpha($black, 10%)

      &:after
        transform: translate3D(0, 0 ,0)
        opacity: 1

    &:hover
      background: alpha($black, 10%)

    &.divider
      padding: 0
      height: 1px
      background: currentColor
      opacity: 0.08
</style>

<template>
  <button
    class="btn"
    :class="['btn-' + type, {
      'disabled': disabled,
      'is-ghost': ghost,
      'is-block': block,
      'is-loading': loading
    }]"
    @click="handleClick" themify-darkify>
    <icon :symbol="computedIcon" transition="expand-width" v-if="computedIcon"></icon>
    <slot></slot>
  </button>
</template>

<script>
import Icon from './icon'

/**
 * Button Generic Component
 *
 * @param {string} [type=default] - button type, including default, primary, danger
 * @param {boolean} [disabled=false] - disabled
 * @param {boolean} [is-ghost=false] - is ghost button
 * @param {boolean} [is-block=false] - is block button
 * @param {string} [icon] - icon name
 *
 * @example
 * <btn icon="t" type="primary">Text</btn>
 */
export default {
  name: 'btn',

  props: {
    icon: String,
    disabled: Boolean,
    loading: Boolean,
    block: Boolean,
    ghost: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'default'
    }
  },

  components: {
    Icon
  },

  computed: {
    computedIcon () {
      return this.loading ? 'loading' : this.icon
    }
  },

  methods: {
    handleClick ($event) {
      if (this.disabled || this.loading) {
        $event.preventDefault()
        $event.stopPropagation()
        return
      }
    }
  }

}
</script>

<style lang="stylus">
@require '../../styles/ref'

.btn
  display: inline-flex
  align-items: center
  position: relative
  padding: 12px 12px
  font-size: 22px
  transition: all 318ms
  border: none
  cursor: pointer

  .svg-symbol-loading
    position: absolute
    left: 12px
    top: 12px
    display: inline-flex
    align-self: center
    border: 1px solid currentColor
    border-top-color: transparent
    border-right-color: transparent
    border-radius: 50%
    opacity: 0
    transition: width 318ms, left 318ms, opacity 218ms

    use
      display: none

  &.is-block
    display: flex
    width: 100%
    justify-content: center

  &.disabled
  &.is-loading
    background-color: $gray97 !important
    border-color: $gray85 !important
    color: $gray65 !important
    opacity: 1 !important
    cursor: not-allowed

  &.is-loading
    padding-left: 37px

    .svg-symbol
      left: 17px
      opacity: 1
      animation: spin 1s infinite linear

.btn-default
  &.is-ghost
    background-color: transparent
    color: $gray50

    &:hover
      color: darken($gray50, 20%)
      background-color: alpha($gray50, 10%)

    &:active,
    &.is-active
      color: darken($gray50, 25%)
      background-color: alpha($gray50, 15%)

.btn-dark
  background-color: alpha($gray50, 15%)

  &:hover
    color: white
    background-color: $black

</style>

<template>
  <button
    class="btn"
    :class="['btn-' + type, {
      'disabled': disabled,
      'is-ghost': ghost,
      'is-loading': loading
    }]"
    @click="handleClick">
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
 * @param {boolean} [plain=false] - is ghost button
 * @param {string} [icon] - icon name
 *
 * @example
 * <btn icon="t" type="primary">Text</btn>
 */
export default {
  props: {
    icon: String,
    disabled: Boolean,
    loading: Boolean,
    ghost: Boolean,
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
  padding: 9px 12px
  transition: all 318ms

  .svg-symbol
    margin-right: 4px

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

.btn-primary
  &.is-ghost
    background-color: $white
    border-color: $blue
    color: $blue

    &:hover
      border-color: darken($blue, 15%)
      color: darken($blue, 20%)
      background-color: alpha($blue, 10%)

    &:active
      color: $white
      background-color: $blue
      border-color: $blue
</style>

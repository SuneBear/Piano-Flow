<template>
  <div class="toggle" :class="{
    'is-on': isOn,
    'is-off': !isOn,
    'is-locked': isLocked
    }" @click="handleClick">
    <div class="toggle-switch"></div>
    <div class="active-track"></div>
    <div class="gray-track"></div>
  </div>
</template>

<script>
/**
 * Toggle UX Component
 *
 * @param {boolean} [isOn] - Toggle state
 * @param {function} [toggle] - click handler
 *
 * @example
 * <toggle :is-on="true" :toggle="methodName"></toggle>
 */
export default {
  props: {
    isOn: {
      type: Boolean,
      default: false
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    toggle: {
      type: Function,
      default: () => {}
    }
  },

  methods: {
    handleClick ($event) {
      if (this.isLocked) {
        $event.preventDefault()
        $event.stopPropagation()
      } else {
        this.toggle()
      }
    }
  }
}
</script>

<style lang="stylus">
@require '../../styles/ref'

.toggle
  $radius = 17.8px
  position: relative
  cursor: pointer
  width: 40px
  height: 22px
  background-color: $gray85
  border-radius: $radius
  transition: opacity 218ms 50ms

  .gray-track,
  .active-track
    position: absolute
    left: 0px
    top: 0px
    right: 0px
    bottom: 0px
    border-radius: $radius

  .gray-track
    z-index: 1
    transform: scale(1)
    background: $gray65

  .active-track
    z-index: 2

  .toggle-switch
    position: absolute
    z-index: 3
    top: 3px
    width: 16px
    height: 16px
    border-radius: 50%
    background-color: $white
    left: 3px

  &.is-locked
    opacity: .6

  &.is-on,
  &.is-off
    .active-track
      transition: 418ms

    .toggle-switch
      transition: left 418ms 100ms cubic-bezier(0.455, 0.030, 0.215, 1.130)

  &.is-on
    .active-track
      box-shadow: $blue 0px 0px 0px $radius inset

    .toggle-switch
      left: 21px

    // .gray-track
    //   transform: scale(0)

  // &.is-off
  //   .active-track
  //     transition: 318ms

</style>

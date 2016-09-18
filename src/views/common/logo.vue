<template>
<div class="logo"
  :class="{
    'is-preload': isPreload,
    'on-animation': onAnimation
  }">
  <div class="logo-face logo-face-front">
    <span class="letter-p">P</span>
    <span class="letter-f">f</span>
  </div>
  <div class="logo-face logo-face-back">
    <icon symbol="emoji"></icon>
  </div>
  <div class="logo-face logo-face-left">O</div>
  <div class="logo-face logo-face-right">N</div>
  <div class="logo-face logo-face-bottom">W</div>
  <div class="logo-face logo-face-top">#</div>
</div>
</template>

<script>
export default {
  props: {
    isPreload: Boolean,
    onAnimation: Boolean
  },

  created () {
    // this.onAnimation = true
  }
}
</script>

<style lang="stylus">
@require '../../styles/ref'

@keyframes rotateTheLogo
  0%
    transform: rotateY(0deg) rotateZ(0deg)

  20%
    transform: rotateY(90deg) rotateZ(0deg)

  40%
    transform: rotateX(45deg) rotateZ(45deg)

  60%
    transform: rotateX(90deg) rotateY(180deg) rotateX(90deg)

  80%
    transform: rotateX(310deg) rotateZ(230deg)

  100%
    transform: rotateX(360deg) rotateZ(360deg)

.logo
  position: absolute
  width: 80px
  height: 80px
  font-size: 50px
  transform-style: preserve-3d
  perspective: 9999px
  transition: transform 318ms
  transform: rotateY(0deg) rotateZ(0deg)

  &.on-animation,
  &:hover
    animation: rotateTheLogo 2200ms infinite both

    .logo-face
      box-shadow: inset 0 0 0 1px $black, 0 0 1px 1px $black
      // border-radius: 0

  .logo-face
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    left: 0px
    right: 0px
    top: 0px
    bottom: 0px
    box-shadow: inset 0 0 0 2px $black
    border-radius: $radius
    transition: border-radius 500ms

  .logo-face-front
    transform: translate3d(0, 0, 40px)

    .letter-p
      position: absolute
      left: 21px
      top: -6px
      font-size: 55px

    .letter-f
      position: absolute
      top: 28px
      left: 46px
      font-size: 35px

  .logo-face-back
    transform: rotateY(180deg) translate3d(0, 0, 40px)

    .svg-symbol
      font-size: 37px
      stroke-width: 0.4px
      stroke: #ffffff

  .logo-face-left
    transform: rotateY(-90deg) translate3d(0, 0, 40px)

  .logo-face-right
    transform: rotateY(90deg) translate3d(0, 0, 40px)

  .logo-face-top
    transform: rotateX(90deg) translate3d(0, 0, 40px)

  .logo-face-bottom
    transform: rotateX(-90deg) translate3d(0, 0, 40px)
</style>

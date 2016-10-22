<template>
<div class="logo"
  :class="{
    'is-preload': isPreload,
    'on-animation': onAnimation
  }">
  <div class="logo-face logo-face-front" themify-dark-invert>
    <span class="letter-p">P</span>
    <span class="letter-f">f</span>
  </div>
  <div class="logo-face logo-face-back" themify-dark-invert>
    <svg width="37px" height="79px" viewBox="247 648 37 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M278.788988,690.406266 C277.475773,692.123976 277.740966,694.281037 279.221203,697.41423 C279.5384,698.085636 279.8737,698.734502 280.429055,699.769946 C282.470021,703.575271 283.004063,704.770566 283.130435,706.50242 C283.24162,708.026153 282.786418,709.230153 281.620469,711.25746 C281.567205,711.350075 281.521466,711.42921 281.423106,711.599149 C280.458474,713.266173 280.111438,714.028873 279.998677,714.947085 C279.75068,716.966517 279.850452,718.623969 280.306481,722.401007 C280.54176,724.349691 280.633652,725.219691 280.699639,726.315889 L278.703252,726.436064 C278.640478,725.393229 278.551369,724.54958 278.320901,722.64074 C277.845437,718.70273 277.739191,716.937729 278.013589,714.703306 C278.17068,713.424122 278.59134,712.499615 279.692034,710.597456 C279.790159,710.427921 279.834741,710.350788 279.886748,710.260359 C280.862604,708.563578 281.208717,707.648115 281.135738,706.647971 C281.039342,705.326923 280.537167,704.202951 278.666558,700.715252 C278.096235,699.651902 277.748267,698.97852 277.412856,698.268561 C275.625174,694.484605 275.347397,691.535228 277.184788,689.181294 L274.634373,687.23379 L274.634373,648.116721 L282.707206,648.116721 L282.707206,693.398228 L278.788988,690.406266 Z M253.007073,693.821252 C253.159565,694.862383 253.574381,696.045113 254.221203,697.41423 C254.5384,698.085636 254.8737,698.734502 255.429055,699.769946 C257.470021,703.575271 258.004063,704.770566 258.130435,706.50242 C258.24162,708.026153 257.786418,709.230153 256.620469,711.25746 C256.567205,711.350075 256.521466,711.42921 256.423106,711.599149 C255.458474,713.266173 255.111438,714.028873 254.998677,714.947085 C254.75068,716.966517 254.850452,718.623969 255.306481,722.401007 C255.54176,724.349691 255.633652,725.219691 255.699639,726.315889 L253.703252,726.436064 C253.640478,725.393229 253.551369,724.54958 253.320901,722.64074 C252.845437,718.70273 252.739191,716.937729 253.013589,714.703306 C253.17068,713.424122 253.59134,712.499615 254.692034,710.597456 C254.790159,710.427921 254.834741,710.350788 254.886748,710.260359 C255.862604,708.563578 256.208717,707.648115 256.135738,706.647971 C256.039342,705.326923 255.537167,704.202951 253.666558,700.715252 C253.096235,699.651902 252.748267,698.97852 252.412856,698.268561 C251.807078,696.98632 251.374678,695.799912 251.139209,694.700033 L247.579035,696.375 L247.579035,648.116721 L256.325045,648.116721 L256.325045,692.260235 L253.007073,693.821252 Z" stroke="none" fill="#383838" fill-rule="evenodd"></path>
    </svg>
  </div>
  <div class="logo-face logo-face-left" themify-dark-invert>O</div>
  <div class="logo-face logo-face-right" themify-dark-invert>N</div>
  <div class="logo-face logo-face-bottom" themify-dark-invert>W</div>
  <div class="logo-face logo-face-top" themify-dark-invert>#</div>
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
  color: $black

  &.align-center
    top: 38.2%
    left: 50%
    margin-top: -40px
    margin-left: -40px

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
    user-select: none

  .logo-face-front
    transition: opacity 418ms
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

  .logo-face-left
    transform: rotateY(-90deg) translate3d(0, 0, 40px)

  .logo-face-right
    transform: rotateY(90deg) translate3d(0, 0, 40px)

  .logo-face-top
    transform: rotateX(90deg) translate3d(0, 0, 40px)

  .logo-face-bottom
    transform: rotateX(-90deg) translate3d(0, 0, 40px)
</style>

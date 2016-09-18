<template>
<div id="app">
  <logo :is-preload="!isLoaded"></logo>
  <div id="content">
    <router-view keep-alive></router-view>
  </div>
  <div id="game">
    <router-view keep-alive name="game"></router-view>
  </div>
</div>
</template>>

<script>
import './game'
import { context } from './services'
import { Logo } from './views'

export default {
  components: {
    Logo
  },

  data () {
    return {
      isLoaded: false
    }
  },

  mounted () {
    const $globalLoading = document.querySelector('.global-loading')
    setTimeout(() => {
      context.status.next('loaded')
      context.status.subscribe(status => this.isLoaded = status === 'loaded')
    }, __DEBUG__ ? 0 : 2000)
  }
}
</script>

<style lang="stylus">
@require './styles/ref'

#app
  min-height: $appMinHeight

  .logo
    left: 50%
    top: 38.2%
    margin-top: -40px
    margin-left: -40px
    transition: transform 318ms, left 500ms 368ms

    body[status='loaded'] &
      left: ($shorterSide/2)

    &.is-preload
      transform: rotateY(90deg) rotateZ(0deg)

#content
  position: absolute
  top: ($shorterSide/2)
  bottom: ($shorterSide/2)
  left: ($shorterSide - 2%)
  right: ($shorterSide/2)
  transform: translate3d(5%, 0, 0)
  opacity: 0
  transition: all 418ms 668ms

  > *:first-child
    height: 100%

  body[status='loaded'] &
    opacity: 1
    transform: translate3d(0, 0, 0)

#game
  position: fixed
  z-index: $zIndexGame
  top: 0
  left: 0
  transform: translateY(100%)
  transition: all 318ms
</style>

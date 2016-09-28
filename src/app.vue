<template>
<div id="app">
  <div id="game" themify-bgfill>
    <router-view keep-alive name="game"></router-view>
  </div>
  <logo :is-preload="!isLoaded"></logo>
  <div id="content">
    <router-view keep-alive></router-view>
  </div>
  <toasts-manager ref="toast"></toasts-manager>
</div>
</template>>

<script>
import { bus, context } from './services'
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
    // Register for Buses, every manager needs to possess a bus to take his members :)
    bus.$on('toast', this.$refs.toast.show)

    // Switch App Status & Remove Loading
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

// TODO: Mobile-Friendly Responsive Design
#app
  min-height: $appMinHeight

  > .logo
    left: 50%
    top: 38.2%
    margin-top: -40px
    margin-left: -40px
    transition: transform 318ms, left 500ms 368ms

    [status='loaded'] &
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

  [status='loaded'] &
    opacity: 1
    transform: translate3d(0, 0, 0)

#game
  position: fixed
  z-index: $zIndexGame
  top: 0
  left: 0
  // Safari Bug: http://stackoverflow.com/questions/5472802/css-z-index-lost-after-webkit-transform-translate3d
  transform: translateY(100%) translateZ(9999px)
  transition: all 518ms cubic-bezier(0.27, 0.17, 0.37, 1.03)

  [game-status='loading'] &,
  [game-status='playing'] &,
  [game-status='paused'] &
    transform: translateY(0) translateZ(9999px)

</style>

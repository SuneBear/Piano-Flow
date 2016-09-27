<template>
<div class="piece-view" :data-id="id">
  <transition appear>
  <div class="control-layer">
    <dropdown class="menu-handler">
      <btn slot="toggler" icon="menu"></btn>
      <ul class="list">
        <li @click="pause">Pause</li>
        <li @click="restart">Restart</li>
        <li class="divider"></li>
        <li @click="switchMode('autoplay')" :class="{ 'is-active': mode === 'autoplay' }" themify-pseudo>Autoplay Mode</li>
        <li @click="switchMode('rhythm')" :class="{ 'is-active': mode === 'rhythm' }" themify-pseudo>Rhythm Mode</li>
        <li @click="switchMode('sheet')" :class="{ 'is-active': mode === 'sheet' }"  themify-pseudo>Sheet Mode</li>
      </ul>
    </dropdown>
    <router-link :to="{ name: 'pieces' }" class="close-handler"><btn icon="remove"></btn></router-link>
  </div>
  </transition>
  <transition appear>
  <div class="loading-layer" v-show="!isLoaded">
    <logo class="align-center" :on-animation="true" :style="{ top: logoTop + 'px' }"></logo>
  </div>
  </transition>
  <transition appear>
  <div class="info-layer" :style="{ top: infoTop + 'px' }">
    <div class="piece-name">{{piece.fullname}} ~ {{piece.musician.name}}</div>
  </div>
  </transition>
</div>
</template>

<script>
import _ from 'lodash'
import { Subject } from 'rxjs/Subject'
import { context, pieceAPI } from '../services'
import Logo from './common/logo'
import game from '../game'

export default {
  components: {
    Logo
  },

  data () {
    return {
      id$: new Subject(),
      mode: 'rhythm',
      status: null,
      piece: { musician: {} },
      height: window.innerHeight,
      isLoaded: false
    }
  },

  computed: {
    id () {
      const id = this.$route.params.id
      this.id$.next(id)
      return id
    },

    infoTop () {
      return this.height - 44
    },

    logoTop () {
      return this.height * 0.382
    }
  },

  mounted () {
    if (__DEBUG__) window.game = game
    this.wrappedHandleResize = _.throttle(this.handleResize, 50)
    window.addEventListener('resize', this.wrappedHandleResize)
    context.gameStatus.next('loading')
    context.gameStatus.subscribe(status => this.isLoaded = status !== 'loading')
    // FIXME: Rerender the component when changing routes
    this.signal = this.id$
      .mergeMap(id => pieceAPI.getPieceById(id))
      .subscribe(piece => {
        this.piece = piece
        context.title.next(piece.name)
        setTimeout(() => context.gameStatus.next('playing'), 3000)
      })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.wrappedHandleResize)
    context.gameStatus.next('stop')
    this.signal.unsubscribe()
  },

  methods: {
    handleResize () {
      this.height = window.innerHeight
    },

    resume () {

    },

    pause () {

    },

    restart () {

    },

    switchMode (mode) {
      this.mode = mode
    },

    switchStatus (Status) {

    }
  }
}
</script>

<style lang="stylus">
@require '../styles/ref'

.piece-view

  [class*='-layer']
    transition: all 318ms

    &.v-enter,
    &.v-leave-active
      opacity: 0
      visibility: hidden
      transform: translateY(30px)

  .loading-layer
    height: inherit
    transition: all 418ms

    [game-status='loading'] &
      transition-delay: 918ms

  .control-layer
    position: relative
    z-index: 2
    transition-delay: 618ms

    > *
      position: absolute
      top: 20px

    .menu-handler
      left: 25px

    .close-handler
      right: 25px

  .info-layer
    position: absolute
    z-index: 2
    top: 0
    left: 25px
    max-width: 100%

    [game-status='loading'] &
      transition-delay: 668ms

    .piece-name
      margin-right: 40px
      text-overflow()

// FIXME: Wierd 1px border in Safari
#game canvas
  position: relative
  z-index: -1
  // transform: scale(0.5)
  transition: all 418ms 218ms

  [game-status='loading'] &
    opacity: 0
    transform: translateY(30px)
    transition-delay: 0ms

</style>

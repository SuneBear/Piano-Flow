<template>
<div class="piece-view" :data-id="id">

  <transition appear>
  <div class="control-layer">
    <dropdown class="menu-handler">
      <btn slot="toggler" icon="menu"></btn>
      <ul class="list">
        <li @click="switchStatus('pause')">Pause</li>
        <li @click="switchStatus('restart')">Restart</li>
        <li class="divider"></li>
        <li @click="switchMode('rhythm')" :class="{ 'is-active': mode === 'rhythm' }" themify-pseudo>Rhythm Mode</li>
        <li @click="switchMode('autoplay')" :class="{ 'is-active': mode === 'autoplay' }" themify-pseudo>Autoplay Mode</li>
        <!-- <li @click="switchMode('sheet')" :class="{ 'is-active': mode === 'sheet' }"  themify-pseudo>Sheet Music Mode</li> -->
      </ul>
    </dropdown>
    <router-link :to="{ name: 'pieces' }" class="close-handler"><btn icon="remove"></btn></router-link>
  </div>
  </transition>

  <transition appear>
  <div class="loading-layer" v-show="!isLoaded">
    <div class="progress">
      <div class="progress-bar" :style="{ width: loadedPercent + '%' }" themify-darkify-progress></div>
    </div>
    <logo class="align-center" :on-animation="true"></logo>
  </div>
  </transition>

  <transition appear>
  <div class="info-layer">
    <div class="piece-name">{{piece.fullname}} ~ {{piece.musician.name}}</div>
  </div>
  </transition>

  <modal title="Game Paused" v-model="pausedModalVisible" :onClose="switchStatus">
    <ul class="list paused-panel-list">
      <li><btn @click.native="switchStatus('resume')" :block="true" :ghost="false" type="dark">Resume</li>
      <li><btn @click.native="switchStatus('restart')" :block="true" :ghost="false" type="dark">Restart</btn></li>
    </ul>
  </modal>

  <modal v-model="sheetModalVisible" class="sheet-modal" :size="'full'" :onClose="switchMode">
    <sheet></sheet>
  </modal>

</div>
</template>

<script>
import _ from 'lodash'
import { Subject } from 'rxjs/Subject'
import { bus, context, pieceAPI } from '../services'
import { getCurrentTheme } from '../utils'
import Sheet from './common/sheet'
import Logo from './common/logo'
import game from '../game'

export default {
  components: {
    Logo,
    Sheet
  },

  data () {
    return {
      id$: new Subject(),
      mode: 'rhythm',
      instrument: 'acoustic_grand_piano', // acoustic_guitar_nylon
      piece: { musician: {} },
      windowHeight: window.innerHeight,
      pausedModalVisible: false,
      sheetModalVisible: false,
      isLoaded: false,
      loadedPercent: 0
    }
  },

  computed: {
    id () {
      const id = this.$route.params.id
      this.id$.next(id)
      return id
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
      .catch(() => bus.$emit('toast', { msg: 'Failed to load the MIDI file', type: 'error' }))
      .subscribe(piece => {
        this.piece = piece
        context.theme.next(piece.theme)
        context.title.next(piece.name)
        game.init({
          $wrap: this.$el,
          theme: getCurrentTheme(),
          instrument: this.instrument,
          mode: this.mode,
          piece: this.piece,
          onProgress: this.onProgress,
          onLoaded: this.onLoaded
        })
      })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.wrappedHandleResize)
    clearTimeout(this.loadTimer)
    context.gameStatus.next('stop')
    game.stop()
    this.signal.unsubscribe()
  },

  methods: {
    handleResize () {
      this.windowHeight = window.innerHeight
    },

    onProgress (state, progress) {
      this.loadedPercent = progress * 100
    },

    onLoaded () {
      this.loadTimer = setTimeout(() => {
        context.gameStatus.next('playing')
        game.start()
      }, __DEBUG__ ? 0 : 2500)
    },

    switchStatus(status = 'resume') {
      this.pausedModalVisible = status === 'pause'
      switch (status) {
        case 'pause':
          game.pause()
          break
        case 'resume':
          game.resume()
          break
        case 'restart':
          game.restart()
          break
      }
    },

    switchMode (mode = 'rhythm') {
      this.mode = mode
      this.sheetModalVisible = mode === 'sheet'
      game.switchMode(mode)
    }
  }
}
</script>

<style lang="stylus">
@require '../styles/ref'

.piece-view
  height: 100%

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

    .progress
      position: fixed
      top: 0
      left: 0
      width: 100%

      &-bar
        height: 2px
        background: $gray50
        box-shadow: 0 0 8px alpha($gray50, 50%)
        transition: width 1218ms, transform 418ms

    .logo
      top: 38.2%

    &.v-enter,
    &.v-leave-active
      .progress-bar
        transform: translateY(-32px)

    [game-status='loading'] &

      &,
      .progress-bar
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
    bottom: 20px
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

.paused-panel-list
  display: flex

  li
    flex: 1

    + li
      margin-left: 25px

  .btn
    padding: 8px 12px

</style>

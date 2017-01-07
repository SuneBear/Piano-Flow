import PIXI from 'pixi.js'
import MIDI from './midi'
import { bus, context } from '../services'
import Perlin from './perlin'
import SamplePlayer from './sample-player'
import ConductorPerformer from './conductor-performer'

// Refactor Flag: I will rewrite a better one in the future
class Root {

  constructor () {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.shouldAutoRender = false // isPlaying
    context.gameStatus.subscribe(status => { this.isLoaded = status !== 'loading' }) // isLoaded

    this.mdown = this._onMouseDown.bind(this)
    this.mleave = this._hideInfoOverlay.bind(this)
    this.mmove = this._onMouseMove.bind(this)
    this.mup = this._onMouseUp.bind(this)
    this.tend = this._onTouchEnd.bind(this)
    this.tmove = this._onTouchMove.bind(this)
    this.tstart = this._onTouchStart.bind(this)
    this.kdown = this._onKeyDown.bind(this)
    this.kup = this._onKeyUp.bind(this)

    this._ready()
    this._setupRender()
  }

  _ready () {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }

  _setupRender () {
    // Remove PIXI banner from the console
    PIXI.utils.sayHello = () => {}

    const options = {
      transparent: true,
      autoResize: true,
      antialias: true,
      resolution: 1 || window.devicePixelRatio // TODO: Optimize Ratio
    }

    const type = navigator.userAgent.match(/Version\/[\d.]+.*Safari/) ? '2d' : 'auto'

    switch (type) {
      case '2d':
        this.renderer = new PIXI.CanvasRenderer(this.width, this.height, options)
        break
      case 'auto':
        this.renderer = new PIXI.WebGLRenderer(this.width, this.height, options)
    }

    this.stage = new PIXI.Container()
  }

  init (options) {
    this.$wrap = options.$wrap
    this.theme = options.theme
    this.mode = options.mode
    this.vm = options.vm
    this.instrument = options.instrument
    this.repeatOnHold = options.repeatOnHold
    this.initLocation = options.location

    this.spacingMultiplier = options.spacingMultiplier || 1
    this.sizeMultiplier = options.sizeMultiplier || 1

    MIDI.Player.loadPiece(options)
      .then(() => { this._mount() })
  }

  _mount () {
    this.$wrap.appendChild(this.renderer.view)
    this.samplePlayer = new SamplePlayer(this.audioCtx, this.instrument)
    this.perlin = new Perlin(655366 * Math.random())
    this.performer = new ConductorPerformer(this.mode === 'autoplay')
    this._update()
  }

  _update (timestamp) {
    // REF: https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
    this.renderRaf = window.requestAnimationFrame(this._update.bind(this))
    this.renderer.render(this.stage)
    if (this.shouldAutoRender && this.isLoaded) this.performer && this.performer.redraw(timestamp)
  }

  performerReady () {
    this._startRender()
  }

  ghostWasSpooked () {
    // Empty
  }

  _hideInfoOverlay () {
    this.$wrap.classList.add('is-hide-info')
  }

  _showInfoOverlay () {
    this.$wrap.classList.remove('is-hide-info')
  }

  _onMouseDown (event) {
    if (event.target.tagName === 'CANVAS' || event.target.isSameNode(this.$wrap)) {
      this.performer.handleMouseDown(event)
    }
  }

  _onMouseMove () {
    this._showInfoOverlay()
  }

  _onMouseUp (event) {
    if (event.target.tagName === 'CANVAS' || event.target.isSameNode(this.$wrap)) {
      this.performer.handleMouseUp(event)
    }
  }

  _onTouchEnd (event) {
    if (event.target.tagName === 'CANVAS' || event.target.isSameNode(this.$wrap)) {
      this.performer.handleUntouch(event)
    }
  }

  _onTouchMove () {
    // Empty
  }

  _onTouchStart (event) {
    if (event.target.tagName === 'CANVAS' || event.target.isSameNode(this.$wrap)) {
      this.performer.handleTouch(event)
      // TODO: Special handling
      // this._hideInfoOverlay()
    }
  }

  _onKeyDown (event) {
    if (event.which === 0 || event.which === 16 || event.which === 20 || event.ctrlKey || event.metaKey || event.altKey) return
    if (event.which === 27 && this.shouldAutoRender) { // Press esc to pause
      return setTimeout(() => {
        this.pause()
        this.vm.switchStatus('pause')
      }, 0)
    }
    this.performer.handleKeyPress(event)
    this._hideInfoOverlay()
  }

  _onKeyUp (event) {
    if (event.which === 0 || event.which === 16 || event.which === 20 || event.which === 27 || event.ctrlKey || event.metaKey || event.altKey) return
    this.performer.handleKeyDepress(event)
    this._hideInfoOverlay()
  }

  _attachResponders () {
    document.addEventListener('mousedown', this.mdown)
    document.addEventListener('mouseleave', this.mleave)
    document.addEventListener('mousemove', this.mmove)
    document.addEventListener('mouseup', this.mup)
    document.addEventListener('touchend', this.tend)
    document.addEventListener('touchstart', this.tstart)
    document.addEventListener('keydown', this.kdown)
    document.addEventListener('keyup', this.kup)
  }

  _detachResponders () {
    document.removeEventListener('mousedown', this.mdown)
    document.removeEventListener('mouseleave', this.mleave)
    document.removeEventListener('mousemove', this.mmove)
    document.removeEventListener('mouseup', this.mup)
    document.removeEventListener('touchend', this.tend)
    document.removeEventListener('touchstart', this.tstart)
    document.removeEventListener('keydown', this.kdown)
    document.removeEventListener('keyup', this.kup)
  }

  _startRender () {
    this.shouldAutoRender = true
    this._attachResponders()
  }

  _stopRender () {
    this.shouldAutoRender = false
    this._detachResponders()
  }

  _clear () {
    this._stopRender()
    this.samplePlayer && this.samplePlayer.offAllNotes()
    this.stage.removeChildren()
    this.renderer.render(this.stage)
  }

  endPiece () {
    this.mode = 'rhythm' // Avoid autoplay in a loop
    this.vm.mode = 'rhythm'
    bus.$emit('toast', { msg: 'Fin. The piece renewed for you.', type: 'info' })
    this.endTimer = setTimeout(() => {
      this.restart()
    }, 500)
  }

  pause () {
    this._stopRender()
  }

  resume () {
    this._startRender()
  }

  stop () {
    // FIXME: Destroy the old instances when the game stops
    window.cancelAnimationFrame(this.renderRaf)
    clearTimeout(this.endTimer)
    this._clear()
  }

  restart () {
    this.stop()
    this._mount()
  }

  // Handle resize & orientationchange
  rerender () {
    this.stop()
    this._ready()
    this.renderer.resize(this.width, this.height)
    this.performer.render()
    this._update()
    if (!this.vm.pausedModalVisible) this._startRender()
  }

  switchMode (mode) {
    this.mode = mode
    this.performer.switchMode(mode)
  }

}

export default new Root()

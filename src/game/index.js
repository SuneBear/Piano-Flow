import PIXI from 'pixi.js'
import player from './player'

class Game {
  constructor () {
    // Public members
    this.mode = null
    this.theme = null
    this.$wrap = null
    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
      transparent: true,
      antialias: true
    })
  }

  /**
   * Init game
   * @param {object} options
   */
  init (options) {
    this.mode = options.mode
    this.theme = options.theme
    this.$wrap = options.$wrap
    this.$wrap.appendChild(this.renderer.view)
    player.loadPiece(options)
  }

  start () {
    if (this.mode === 'autoplay') player.start()
  }

  pause () {
    player.pause()
  }

  resume () {
    player.currentTime += 1e-6 // bugfix for MIDI.js
    if (this.mode === 'autoplay') player.resume()
  }

  stop () {
    player.stop()
  }

  restart () {
    this.stop()
    this.start()
  }

  switchMode (mode) {
    this.mode = mode
    if (this.mode === 'autoplay') {
      this.resume()
    } else {
      this.pause()
    }
  }
}

export default new Game()

import PIXI from 'pixi.js'
import player from './player'

class Game {
  constructor () {
    console.log('game', PIXI)
  }

  /**
   * Init game
   * @param {object} options
   */
  init (options) {
    this.mode = options.mode
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

import Phaser from 'phaser'

import { BootState, SplashState, GameState } from './states'

class Game extends Phaser.Game {

  constructor () {
    let width = window.innerWidth
    let height = window.innerHeight

    super(width, height, Phaser.AUTO, 'game', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

export default new Game()

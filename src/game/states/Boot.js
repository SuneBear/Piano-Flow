import Phaser from 'phaser'

export default class extends Phaser.State {
  preload () {
    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)
  }

  render () {
    this.state.start('Splash')
  }
}

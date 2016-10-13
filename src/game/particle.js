import PIXI from 'pixi.js'
import root from './_root'
import { noteTexture } from './textures'

/**
 * class Particle
 * Dependencies: PIXI, Perlin, root.stage
 */
export default class Particle {

  constructor (x, y, size, tint) {
    this.curX = x
    this.curY = y
    this.sprite = new PIXI.Sprite(noteTexture)
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    // this.sprite.blendMode = PIXI.BLEND_MODES.ADD
    this.sprite.tint = tint
    this.sprite.position.x = this.curX
    this.sprite.position.y = this.curY
    this.sprite.scale.x = 0.9 * size
    this.sprite.scale.y = 0.9 * size
    this.perlinZ = 0.1 * Math.random() + 0.3
    this.isDead = false
    root.stage.addChild(this.sprite)
  }

  advance (delta, distance) {
    if (this.isDead) return
    let shiftX = 0.18181 * delta * Math.cos(6.28318530718 * root.perlin.get(0.01 * this.curX, 0.01 * this.curY, this.perlinZ))
    let shiftY = 0.18181 * delta * Math.sin(6.28318530718 * root.perlin.get(0.005 * this.curX, 0.005 * this.curY, this.perlinZ))
    this.curX = this.curX + shiftX - distance
    this.curY = this.curY + 1 * shiftY
    this.perlinZ += 0.01
    this.perlinZ > 1 && (this.perlinZ = 0)
    let scale = Math.pow(0.96, 0.0625 * delta)
    this.sprite.scale.x *= scale
    this.sprite.scale.y *= scale
    this.sprite.position.x = this.curX
    this.sprite.position.y = this.curY
    this.sprite.alpha *= scale
    if (this.sprite.alpha < 0.01 || this.sprite.curX < 0) {
      root.stage.removeChild(this.sprite)
      this.isDead = true
    }
  }

  init (x, y, size, tint) {
    this.curX = x
    this.curY = y
    this.sprite.tint = tint
    this.sprite.position.x = this.curX
    this.sprite.position.y = this.curY
    this.sprite.scale.x = 0.9 * size
    this.sprite.scale.y = 0.9 * size
    this.sprite.alpha = 1
    this.isDead = false
    root.stage.addChild(this.sprite)
  }

}

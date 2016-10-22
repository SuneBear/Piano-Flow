import PIXI from 'pixi.js'
import root from './_root'
import { noteTexture } from './textures'

/**
 * class ConductorNoteVis
 * Dependencies: PIXI, Perlin, DecayParticleManager
 */
export default class ConductorNoteVis {

  constructor (x, y, size, note) {
    this.curX = x
    this.curY = y
    this.sizeMul = size
    this.texture = noteTexture
    this.isPlayed = false
    this.sprite = null
    this.isOnStage = false
    this.bubbleScale = 0
    this.noteOnTick = note[0]
    this.noteOffTick = note[1]
    this.notePitch = note[2]
    this.noteVel = note[3]
    this.emitParticlesAllowed = true
    this.setupSprite()
  }

  setupSprite () {
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    this.sprite.alpha = 0.9
    // this.sprite.blendMode = PIXI.BLEND_MODES.ADD
    this.sprite.tint = 0
    this.sprite.position.x = this.curX
    this.sprite.position.y = this.curY
    this.sprite.scale.x = 0.1
    this.sprite.scale.y = 0.1
  }

  setScale (scale) {
    this.velScale = scale * this.sizeMul
    this.sprite.scale.x = this.velScale
    this.sprite.scale.y = this.velScale
  }

  setTint (tint) {
    this.sprite.tint = tint
  }

  advance (delta) {
    if (this.isPlayed) {
      this.sprite.scale.x *= 0.9
      this.sprite.scale.y *= 0.9
      this.sprite.alpha *= 0.95
      const shiftX = 0.18181 * delta * Math.cos(2 * Math.PI * root.perlin.get(0.01 * this.curX, 0.01 * this.curY, 0))
      const shiftY = 0.18181 * delta * Math.sin(2 * Math.PI * root.perlin.get(0.001 * this.curX, 0.001 * this.curY, 0))
      this.curX = this.curX - Math.abs(shiftX)
      this.curY = this.curY + shiftY
      if (this.emitParticlesAllowed) {
        root.performer.particleManager.addParticle(this.sprite.position.x, this.sprite.position.y, this.sprite.scale.x, this.sprite.tint)
      }
    } else {
      this.sprite.scale.x = this.velScale + this.bubbleScale
      this.sprite.scale.y = this.velScale + this.bubbleScale
      this.bubbleScale *= Math.pow(0.9, 0.0625 * delta)
    }
  }

  playTrigger () {
    this.isPlayed = true
    this.sprite.scale.x *= 2
    this.sprite.scale.y *= 2
    this.bubbleScale = 0
  }

  pressTrigger (distanceRatio, velocity) {
    distanceRatio = Math.min(Math.max(0, distanceRatio), 1)
    velocity = Math.min(Math.max(0, velocity), 500)
    velocity /= 500
    this.bubbleScale += velocity * Math.pow(distanceRatio, 4) * (128 / this.texture.width)
  }

  addSelfToStage (stage) {
    stage.addChild(this.sprite)
    this.isOnStage = true
  }

  removeSelfFromStage (stage) {
    stage.removeChild(this.sprite)
    this.isOnStage = false
  }

  setPosition (x, y) {
    this.sprite.position.x = x
    this.sprite.position.y = y
  }

  stopEmittingParticles () {
    this.emitParticlesAllowed = false
  }

}

import Particle from './particle'

export default class DecayParticleManager {

  constructor () {
    this.particles = []
    this.numAlive = 0
    this.penalizeLimit = 50
  }

  addParticle = function (x, y, size, tint) {
    let aliveRatio = this.numAlive / this.penalizeLimit
    aliveRatio = Math.min(1, aliveRatio)

    if (aliveRatio >= 1) return
    let isDead = false
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]
      if (particle.isDead) {
        particle.init(x, y, size, tint)
        isDead = true
        break
      }
    }
    if (!isDead) this.particles.push(new Particle(x, y, size, tint))
  }

  advance (delta, distance) {
    let numAlive = 0
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]
      if (!particle.isDead) {
        numAlive++
        particle.advance(delta, distance)
      }
    }
    this.numAlive = numAlive
  }

}

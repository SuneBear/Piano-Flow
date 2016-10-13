import root from './_root'
import { mapCurve } from './utils'

/**
 * class ConductorSounder
 * Dependencies: Performer, SamplePlayer
 */
export default class ConductorSounder {

  constructor () {
    this.currentlyOn = []
    this.numPress = 0
    this.nextOnBunch = 0
    this.lastOnTick = root.performer.noteObjects[0][0].noteOnTick
    this.pitchPressStatus = []
    for (let i = 0; i < 128; i++) {
      this.pitchPressStatus.push(0)
    }
  }

  setLocation (location) {
    this.nextOnBunch = location
    this.lastOnTick = root.performer.noteObjects[location][0].noteOnTick
  }

  // Power is volume
  press (power) {
    if (this.nextOnBunch < root.performer.noteObjects.length) {
      this.numPress++
      this.numPress < 0 && (this.numPress = 0)
      const bunch = root.performer.noteObjects[this.nextOnBunch]
      this.nextOnBunch++
      const newOn = []
      for (let i = 0; i < this.currentlyOn.length; i++) {
        const noteVis = this.currentlyOn[i]
        if (noteVis.noteOffTick <= this.lastOnTick && this.pitchPressStatus[noteVis.notePitch] === 1) {
          root.samplePlayer.noteOff(noteVis.notePitch, 0)
          this.pitchPressStatus[noteVis.notePitch]--
        } else {
          newOn.push(noteVis)
        }
      }
      this.currentlyOn = newOn.slice(0)
      let lastPlayedTotalVel = 0
      for (let i = 0; i < bunch.length; i++) {
        const noteVis = bunch[i]
        const velocity = this.scaleVelocity2(noteVis.noteVel, power)
        const delta = (noteVis.notePitch - root.samplePlayer.noteOffset) / 87 * 1 - 0.5
        if (i === bunch.length - 1) {
          root.samplePlayer.noteOn(noteVis.notePitch, velocity, 0, delta)
        } else {
          root.samplePlayer.noteOn(noteVis.notePitch, velocity, 30 * Math.random() / 1000, delta)
        }
        this.pitchPressStatus[noteVis.notePitch]++
        this.currentlyOn.push(noteVis)
        this.lastOnTick = noteVis.noteOnTick
        lastPlayedTotalVel += velocity
      }
      return lastPlayedTotalVel
    }
  }

  depress () {
    this.numPress--
    this.numPress < 0 && (this.numPress = 0)
    if (this.nextOnBunch < root.performer.noteObjects.length) {
      if (this.numPress === 0) {
        let noteOnTick = root.performer.noteObjects[this.nextOnBunch][0].noteOnTick
        const newOn = []
        for (let i = 0; i < this.currentlyOn.length; i++) {
          const noteVis = this.currentlyOn[i]
          if (noteVis.noteOffTick <= noteOnTick && this.pitchPressStatus[noteVis.notePitch] === 1) {
            noteVis.stopEmittingParticles()
            root.samplePlayer.noteOff(noteVis.notePitch, 0.1)
            this.pitchPressStatus[noteVis.notePitch]--
          } else {
            newOn.push(noteVis)
          }
        }
        this.currentlyOn = newOn.slice(0)
      }
    } else if (this.numPress === 0) {
      for (let i = 0; i < this.currentlyOn.length; i++) {
        const noteVis = this.currentlyOn[i]
        noteVis.stopEmittingParticles()
        root.samplePlayer.noteOff(noteVis.notePitch, 1)
      }
      this.currentlyOn = []
    }
  }

  // scaleVelocity (velocity, power) {
  //   if (power === 0.5 || typeof power === 'undefined') {
  //     return velocity
  //   } else if (power > 0.5) {
  //     power = 2 * (power - 0.5)
  //     return Math.round(velocity + (127 - velocity) * power)
  //   } else if (power < 0.5) {
  //     power = 1 - 2 * power
  //     return Math.round(velocity - velocity * power)
  //   }
  // }

  scaleVelocity2 (velocity, power) {
    const delta = 0.5
    if (power === 0.5 || typeof power === 'undefined') {
      return velocity
    } else if (power > 0.5) {
      power = Math.min(power, 1)
      power = mapCurve(power, 0.5, 1, 0.5, 1, delta)
      power = 2 * (power - 0.5)
      return Math.round(velocity + (127 - velocity) * power)
    } else if (power < 0.5) {
      power = Math.max(power, 0)
      power = mapCurve(power, 0, 0.5, 0, 0.5, -1 * delta)
      power = 1 - 2 * power
      return Math.round(velocity - velocity * power)
    }
  }

}

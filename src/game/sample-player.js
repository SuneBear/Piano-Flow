import { Base64Binary, mapCurve } from './utils'

export default class SamplePlayer {

  constructor (ctx, soundBank) {
    this.ctx = ctx
    this.soundBank = soundBank
    this.noteNames = Object.keys(this.soundBank)
    this.audioBuffers = []
    this.loadedBuffers = 0
    this.noteOffset = 21
    this.sources = []
    this.masterVolume = 3
    for (let i = 0; i < this.noteNames.length; i++) {
      let note = this.soundBank[this.noteNames[i]].split(',')[1]
      note = Base64Binary.decodeArrayBuffer(note)
      this.ctx.decodeAudioData(note, (buffer) => {
        this.audioBuffers[i] = buffer
        this.loadedBuffers++
      })
    }
  }

  noteOn (notePitch, velocity, startTime, delta = 0) {
    let panX = 90 * delta
    let panY = panX + 90
    panY > 90 && (panY = 180 - panY)

    startTime < this.ctx.currentTime && (startTime += this.ctx.currentTime)
    const source = this.ctx.createBufferSource()
    this.sources[notePitch] && this.duplicateNoteOff(notePitch)
    this.sources[notePitch] = source
    source.buffer = this.audioBuffers[notePitch - this.noteOffset]
    source.gainNode = this.ctx.createGain ? this.ctx.createGain() : this.ctx.createGainNode()
    source.filterNode = this.ctx.createBiquadFilter()
    source.filterNode.type = 'lowpass'
    source.panNode = this.ctx.createPanner()
    source.panNode.panningModel = 'equalpower'
    source.panNode.setPosition(Math.sin(panX * (Math.PI / 180)), 0, Math.sin(panY * (Math.PI / 180)))
    source.filterNode.frequency.value = mapCurve(velocity, 0, 127, 350, 13500, 2.72) // midicps[notePitch]
    source.filterNode.Q.value = 0.4
    source.filterNode.connect(source.gainNode)
    source.gainNode.gain.value = Math.max(0, mapCurve(velocity, 0, 127, 0, 1, 1)) * this.masterVolume
    source.gainNode.connect(source.panNode)
    source.panNode.connect(this.ctx.destination)
    source.connect(source.filterNode)
    source.noteOn ? source.noteOn(startTime || 0) : source.start(startTime || 0)
    return source
  }

  noteOff (notePitch, startTime = 0) {
    startTime < this.ctx.currentTime && (startTime += this.ctx.currentTime)
    const source = this.sources[source]
    if (!source) return
    if (source.gainNode) {
      let gain = source.gainNode.gain
      gain.linearRampToValueAtTime(gain.value, startTime)
      gain.linearRampToValueAtTime(0, startTime + 0.2)
    }
    source.noteOff ? source.noteOff(startTime + 0.3) : source.stop(startTime + 0.3)
    this.sources[notePitch] = null
  }

  duplicateNoteOff (notePitch) {
    const source = this.sources[notePitch]
    if (!source) return
    if (source.gainNode) {
      let gain = source.gainNode.gain
      gain.linearRampToValueAtTime(gain.value, this.ctx.currentTime)
      gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2)
    }
    source.noteOff ? source.noteOff(this.ctx.currentTime + 0.3) : source.stop(this.ctx.currentTime + 0.3)
    this.sources[notePitch] = null
  }

  offAllNotes () {
    for (let i = 0; i < this.noteNames.length; i++) {
      this.noteOff(i + this.noteOffset)
    }
  }

}


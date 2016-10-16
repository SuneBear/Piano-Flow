import MIDI from './midi'
import root from './_root'
import { rgb2hex, blendAlpha } from './utils'
import { noteTexture } from './textures'
import ConductorSounder from './conductor-sounder'
import ConductorNoteVis from './conductor-note-vis'
import GhostPlayer from './ghost-player'
import DecayParticleManager from './decay-particle-manager'

export default class ConductorPerformer {

  constructor (isGhost, location = root.initLocation) {
    this.noteInfos = []
    this.bunchInfos = []
    this.ghostInfos = []
    this.firstVisibleBunchIndex = location
    this.nextTargetBunchIndex = location // firstVisibleBunchIndex is equal to nextTargetBunchIndex
    this.isGhostMode = isGhost

    this.bunchPositions = []
    this.noteObjects = []

    this.pressedKeys = []
    this.noteTexture = noteTexture
    this.noteTexture.baseTexture.premultipliedAlpha = false
    this.camAtPixel = 0
    this.prevCamAtPixel = 0
    this.lastFrameTime = 0
    this.residual = 0
    this.particleManager = new DecayParticleManager()
    this.pressTrigger = false
    this.pieceEnded = false
    this.numTouched = 0
    this.touchedIds = []
    this.ready()
  }

  ready () {
    setTimeout(() => {
      this.colorTheme = this.generateColorTheme(root.theme)
      this.noteInfos = this.generateNoteInfos(MIDI.Player.data)
      this.bunchInfos = this.generateBunchInfos(this.noteInfos)
      this.ghostInfos = this.generateGhostInfos(this.bunchInfos)
      this.render()

      this.ghostPlayer = new GhostPlayer(this.ghostOn.bind(this), this.ghostOff.bind(this))
      this.sounder = new ConductorSounder()
      this.sounder.setLocation(this.firstVisibleBunchIndex)

      root.performerReady()
    }, 0)
  }

  render () {
    this.bunchPositions = this.generateBunchPositions(this.bunchInfos)
    this.noteObjects = this.generateNoteObjects(this.bunchInfos)
  }

  generateColorTheme (theme) {
    if (Array.isArray(theme)) {
      // TODO: More flexible theme
      return [15641186, 11502404, 8281903, 5783073, 3613208].reverse()
    }
    return [
      rgb2hex(theme.brand),
      blendAlpha(theme.accent, 0.6, theme.brand),
      rgb2hex(theme.accent),
      blendAlpha(theme.accent, 0.7, theme.bg),
      blendAlpha(theme.accent, 0.4, theme.bg)
    ].reverse()
  }

  generateNoteInfos (midiData) {
    let currentTime = 0
    const noteInfos = []
    const noteTimes = []
    const noteVelocities = []

    for (let i = 0, len = midiData.length; i < len; i++) {
      const midi = midiData[i]
      const event = midi[0].event
      const interval = midi[1]
      const { subtype, noteNumber, channel, velocity } = event

      currentTime += interval

      // In General MIDI, channel 10 is reserved for percussion instruments only.
      // It doesn't make any sense to convert it into piano notes. So just skip it.
      if (channel === 9) continue

      if (subtype === 'noteOn') {
        // if note is on, record its start time & velocity
        noteTimes[noteNumber] = currentTime
        noteVelocities[noteNumber] = velocity
      } else if (subtype === 'noteOff') {
        // if note if off, calculate its duration and build the model
        const startTime = noteTimes[noteNumber]
        const duration = currentTime - startTime
        const velocity = noteVelocities[noteNumber]
        noteInfos.push({
          notePitch: noteNumber,
          duration: duration,
          startTime: startTime,
          endTime: currentTime,
          velocity: velocity
        })
      }
    }

    noteInfos.sort((a, b) => a.startTime - b.startTime)
    return noteInfos
  }

  generateBunchInfos (noteInfos) {
    const bunchInfos = []
    let bunch = []
    let currentStartTime = noteInfos[0].startTime

    // TODO: Combine notes more flexible
    for (let i = 0; i < noteInfos.length; i++) {
      const { startTime, endTime, notePitch, velocity } = noteInfos[i]
      if (Math.abs(startTime - currentStartTime) > (1000 / 10) && velocity > 16) { // startTime !== currentStartTime
        currentStartTime = startTime
        bunch.sort((a, b) => a[2] - b[2])
        bunchInfos.push(bunch)
        bunch = []
      }
      bunch.push([startTime, endTime, notePitch, velocity])
    }

    bunch.sort((a, b) => a[2] - b[2])
    bunchInfos.push(bunch) // Push the last bunch
    return bunchInfos
  }

  generateGhostInfos (bunchInfos) {
    const ghostInfos = []

    for (let i = 0; i < bunchInfos.length; i++) {
      const [startTime, endTime] = bunchInfos[i][0]
      ghostInfos.push([startTime, endTime - startTime])
    }

    return ghostInfos
  }

  generateBunchPositions (bunchInfos) {
    const bunchPositions = []
    let spacingFactor = (0.07 * bunchInfos.length * root.width) / (bunchInfos[bunchInfos.length - 1][0][0] - bunchInfos[0][0][0])
    spacingFactor *= root.spacingMultiplier
    spacingFactor = Math.max(spacingFactor, 0.27) // Minimum
    let initTime = bunchInfos[0][0][0]
    // TODO: Limit min and max distance
    for (let i = 0; i < bunchInfos.length; i++) {
      const bunch = bunchInfos[i]
      let nextTime = bunch[0][0]
      nextTime -= initTime
      bunchPositions.push(nextTime * spacingFactor)
    }
    return bunchPositions
  }

  generateNoteObjects (bunchInfos) {
    const noteObjects = []
    let minPitch = 999999
    let maxPitch = -999999
    for (let i = 0; i < bunchInfos.length; i++) {
      const bunch = bunchInfos[i]
      for (let j = 0; j < bunch.length; j++) {
        const note = bunch[j]
        note[2] < minPitch && (minPitch = note[2])
        note[2] > maxPitch && (maxPitch = note[2])
      }
    }
    let index = 0
    for (let i = 0; i < bunchInfos.length; i++) {
      const bunch = bunchInfos[i]
      const noteVisBunch = []
      noteObjects.push(noteVisBunch)
      for (let j = 0; j < bunch.length; j++) {
        const note = bunch[j]
        let positionY = (1 - (note[2] - minPitch) / (maxPitch - minPitch)) * root.height
        positionY *= 0.70
        positionY += 0.1 * root.height
        // TODO: Limit min and max size
        let size = note[3] / 127 * 0.96
        size = Math.max(size, 0.25) // Minimum
        size = Math.min(size, 0.6) // Maximum
        const noteVis = new ConductorNoteVis(this.bunchPositions[index], positionY, size, note)
        noteVis.setScale(0.003125 * root.height * (128 / this.noteTexture.width) * 0.4 * root.sizeMultiplier)
        noteVisBunch.push(noteVis)
      }
      switch (noteVisBunch.length) {
        case 1:
          noteVisBunch[0].setTint(this.colorTheme[4])
          break
        case 2:
          noteVisBunch[0].setTint(this.colorTheme[1])
          noteVisBunch[1].setTint(this.colorTheme[4])
          break
        case 3:
          noteVisBunch[0].setTint(this.colorTheme[1])
          noteVisBunch[1].setTint(this.colorTheme[3])
          noteVisBunch[2].setTint(this.colorTheme[4])
          break
        case 4:
          noteVisBunch[0].setTint(this.colorTheme[1])
          noteVisBunch[1].setTint(this.colorTheme[2])
          noteVisBunch[2].setTint(this.colorTheme[3])
          noteVisBunch[3].setTint(this.colorTheme[4])
          break
        default:
          for (let i = 0; i < noteVisBunch.length; i++) {
            noteVisBunch[i].setTint(this.colorTheme[4 - Math.min(noteVisBunch.length - 1 - i, this.colorTheme.length - 1)])
          }
      }
      index++
    }

    return noteObjects
  }

  redraw (timestamp) {
    if (this.lastFrameTime === 0) return (this.lastFrameTime = timestamp)

    let deltaTime = timestamp - this.lastFrameTime
    this.lastFrameTime = timestamp
    deltaTime += this.residual
    this.residual = deltaTime % 1
    deltaTime -= this.residual
    deltaTime > 500 && (deltaTime = 16)

    for (let i = this.firstVisibleBunchIndex; i < this.noteObjects.length; i++) {
      const bunch = this.noteObjects[i]
      let isBunchOnStage = false
      let outOfStage = false
      for (let j = 0; j < bunch.length; j++) {
        const note = bunch[j]
        const noteX = this.warpX(note.curX, note.curY)
        const noteY = this.warpY(note.curX, note.curY)
        if (noteX >= 0 && noteX <= 1.2 * root.width) {
          isBunchOnStage = true
          note.setPosition(noteX, noteY)
          !note.isOnStage && note.addSelfToStage(root.stage)
          note.advance(deltaTime)
          if (!note.isPlayed && this.pressTrigger) {
            const distanceRatio = 1 - (this.bunchPositions[i] - this.bunchPositions[this.nextTargetBunchIndex - 1]) / root.width
            note.pressTrigger(distanceRatio, this.lastPlayedTotalVel)
          }
        }
        if (noteX < 0 && note.isOnStage) note.removeSelfFromStage(root.stage)
        if (noteX > root.width) outOfStage = true
      }
      if (outOfStage) break // Stage locking
      if (!isBunchOnStage) {
        for (let i = 0; i < this.noteObjects[this.firstVisibleBunchIndex].length; i++) {
          let j = this.noteObjects[this.firstVisibleBunchIndex][i]
          j.isOnStage && j.removeSelfFromStage(root.stage)
        }
        this.firstVisibleBunchIndex++
      }
    }

    this.prevCamAtPixel = this.camAtPixel
    for (let i = 0; i < Math.floor(deltaTime); i++) {
      this.camAtPixel += 0.00228 * (this.bunchPositions[this.nextTargetBunchIndex] - this.camAtPixel)
    }
    this.particleManager.advance(deltaTime, this.camAtPixel - this.prevCamAtPixel)
    this.pressTrigger = false
    if (this.isGhostMode && !this.pieceEnded) this.ghostPlayer.advance(deltaTime)
  }

  switchMode (mode) {
    this.isGhostMode = mode === 'autoplay'
    if (this.isGhostMode) this.ghostPlayer.ready()
  }

  pressAdvance () {
    if (!this.pieceEnded) {
      for (let i = 0; i < this.noteObjects[this.nextTargetBunchIndex].length; i++) {
        const noteVis = this.noteObjects[this.nextTargetBunchIndex][i]
        noteVis.playTrigger()
      }

      this.nextTargetBunchIndex++
      this.pressTrigger = true

      if (this.nextTargetBunchIndex === this.noteObjects.length) {
        this.nextTargetBunchIndex--
        this.pieceEnded = true
        this.isGhostMode && root.endPiece()
      }
    }
  }

  handleKeyPress (event) {
    event.preventDefault()
    if (this.isGhostMode) return root.ghostWasSpooked()
    if (this.pressedKeys.indexOf(event.keyCode) === -1) {
      !root.repeatOnHold && this.pressedKeys.push(event.keyCode)
      this.lastPlayedTotalVel = this.sounder.press(0.5)
      this.pressAdvance()
    }
  }

  handleKeyDepress (event) {
    event.preventDefault()
    if (this.isGhostMode) return
    if (this.pressedKeys.indexOf(event.keyCode) !== -1) {
      this.pressedKeys.splice(this.pressedKeys.indexOf(event.keyCode), 1)
      this.sounder.depress()
    }
    if (this.pieceEnded && !this.pressedKeys.length) {
      root.endPiece()
    }
  }

  handleTouch (event) {
    if (this.isGhostMode) return root.ghostWasSpooked()
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      if (this.touchedIds.indexOf(touch.identifier) === -1) {
        !root.repeatOnHold && this.touchedIds.push(touch.identifier)
        const power = (root.height - touch.clientY) / root.height
        this.lastPlayedTotalVel = this.sounder.press(power)
        this.numTouched++
        this.pressAdvance()
      }
    }
  }

  handleUntouch (event) {
    if (!this.isGhostMode) {
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i]
        const index = this.touchedIds.indexOf(touch.identifier)
        if (index === -1) {
          this.touchedIds.splice(index, 1)
          this.numTouched--
          if (this.numTouched < 0) this.numTouched = 0
          this.sounder.depress()
        }
      }
      if (this.pieceEnded && this.numTouched === 0) root.endPiece()
    }
  }

  handleMouseDown (event) {
    event.preventDefault()
    if (event.which === 1) {
      if (this.isGhostMode) return root.ghostWasSpooked()
      const power = (root.height - event.clientY) / root.height
      this.lastPlayedTotalVel = this.sounder.press(power)
      this.pressAdvance()
    }
  }

  handleMouseUp (event) {
    event.preventDefault()
    if (event.which === 1 && !this.isGhostMode) {
      if (this.pieceEnded) root.endPiece()
      this.sounder.depress()
    }
  }

  warpX (x) {
    let distance = x - this.camAtPixel
    let distanceRatio = distance / root.width
    let delta = -1.5
    let count = 1 - Math.exp(distanceRatio * delta)
    let total = 1 - Math.exp(delta)
    let widthShift = 0.25 * root.width
    return widthShift + root.width * (count / total)
  }

  warpY (x, y) {
    return y
  }

  ghostOn () {
    this.lastPlayedTotalVel = this.sounder.press(0.5)
    this.pressAdvance()
  }

  ghostOff () {
    this.sounder.depress()
  }

}

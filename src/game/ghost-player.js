import root from './_root'

/**
 * class GhostPlayer
 * Dependencies: Performer
 */
export default class GhostPlayer {

  constructor (on, off) {
    this.data = root.performer.ghostInfos
    this.pf = on
    this.dpf = off
    this.ready()
  }

  ready () {
    this.curEventIndex = root.performer.firstVisibleBunchIndex
    this.nextOn = this.data[this.curEventIndex][0]
    this.nextOffs = []
    this.curTime = this.nextOn - 1000
  }

  advance (time) {
    this.curTime += time
    while (this.curTime >= this.nextOn) {
      this.pressFunc()
      this.nextOffs.push(this.data[this.curEventIndex][1] + this.curTime)
      this.curEventIndex++
      if (this.curEventIndex >= this.data.length) return
      this.nextOn = this.data[this.curEventIndex][0]
    }
    if (this.nextOffs.length > 0) {
      while (this.curTime >= this.nextOffs[0] && this.nextOffs.length) {
        this.depressFunc()
        this.nextOffs.shift()
      }
    }
  }

  pressFunc () {
    this.pf()
  }

  depressFunc () {
    this.dpf()
  }

}

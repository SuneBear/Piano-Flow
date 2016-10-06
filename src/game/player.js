import MIDI from './midi'

class Player {
  constructor () {
    // Mixin
    Object.assign(this, MIDI.Player)
    // Config
    MIDI.soundfontUrl = './assets/soundfonts/'
  }

  loadPiece (options) {
    MIDI.loadPlugin({
      instrument: options.instrument,
      onprogress: options.onProgress,
      onsuccess: () => {
        this.loadFile(options.piece.midi, () => {
          // Change instrument
          MIDI.programChange(0, MIDI.GM.byName[options.instrument].number)
          // Loaded callback
          options.onLoaded && options.onLoaded()
        })
      }
    })
  }
}

export default new Player()

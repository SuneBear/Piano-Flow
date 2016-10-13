/*
  ----------------------------------------------------------
  Web Audio API - OGG Soundbank
  ----------------------------------------------------------
  http://webaudio.github.io/web-audio-api/
  ----------------------------------------------------------
*/
import root from './_root'

// REF: http://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
function base64ToArrayBuffer (base64) {
  var binaryString = window.atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

window.AudioContext && (function () {
  const audio = root.WebAudio = { api: 'webaudio' }
  const sources = {}
  const effects = {}

  audio.audioBuffers = {}
  audio.masterVolume = 127

  audio.programChange = function (channelId, program) {
    let channel = root.channels[channelId]
    channel.instrument = program
  }

  audio.pitchBend = function (channelId, program) {
    let channel = root.channels[channelId]
    channel.pitchBend = program
  }

  audio.noteOn = function (channelId, noteId, velocity, delay) {
    delay = delay || 0

    // check whether the note exists
    var channel = root.channels[channelId]
    var instrument = channel.instrument
    var bufferId = instrument + '' + noteId
    var buffer = audio.audioBuffers[bufferId]
    if (!buffer) return

    // convert relative delay to absolute delay
    if (delay < audio.audioContext.currentTime) {
      delay += audio.audioContext.currentTime
    }

    // create audio buffer
    let source
    source = audio.audioContext.createBufferSource()
    source.buffer = buffer

    // add effects to buffer
    if (effects) {
      let chain = source
      for (let key in effects) {
        chain.connect(effects[key].input)
        chain = effects[key]
      }
    }

    // add gain + pitchShift
    const gain = (velocity / 127) * (audio.masterVolume / 127) * 2 - 1
    source.connect(audio.audioContext.destination)
    source.playbackRate.value = 1 // pitch shift
    source.gainNode = audio.audioContext.createGain() // gain
    source.gainNode.connect(audio.audioContext.destination)
    source.gainNode.gain.value = Math.min(1.0, Math.max(-1.0, gain))
    source.connect(source.gainNode)
    source.start(delay || 0)
    sources[channelId + '' + noteId] = source
    return source
  }

  audio.noteOff = function (channelId, noteId, delay) {
    delay = delay || 0

    // check whether the note exists
    var channel = root.channels[channelId]
    var instrument = channel.instrument
    var bufferId = instrument + '' + noteId
    var buffer = audio.audioBuffers[bufferId]
    if (!buffer) return
    if (delay < audio.audioContext.currentTime) {
      delay += audio.audioContext.currentTime
    }
    var source = sources[channelId + '' + noteId]
    if (source) {
      if (source.gainNode) {
        // @Miranet: 'the values of 0.2 and 0.3 could of course be used as
        // a 'release' parameter for ADSR like time settings.'
        // add { 'metadata': { release: 0.3 } } to soundfont files
        var gain = source.gainNode.gain
        gain.linearRampToValueAtTime(gain.value, delay)
        gain.linearRampToValueAtTime(-1.0, delay + 0.3)
      }
      if (source.noteOff) {
        source.noteOff(delay + 0.5)
      } else {
        source.stop(delay + 0.5)
      }
      delete sources[channelId + '' + noteId]
      return source
    }
  }

  audio.chordOn = function (channel, chord, velocity, delay) {
    var res = {}
    for (var n = 0, note, len = chord.length; n < len; n++) {
      res[note = chord[n]] = audio.noteOn(channel, note, velocity, delay)
    }
    return res
  }

  audio.chordOff = function (channel, chord, delay) {
    var res = {}
    for (var n = 0, note, len = chord.length; n < len; n++) {
      res[note = chord[n]] = audio.noteOff(channel, note, delay)
    }
    return res
  }

  audio.stopAllNotes = function () {
    for (var sid in sources) {
      var delay = 0
      if (delay < audio.audioContext.currentTime) {
        delay += audio.audioContext.currentTime
      }
      var source = sources[sid]
      source.gain.linearRampToValueAtTime(1, delay)
      source.gain.linearRampToValueAtTime(0, delay + 0.3)
      if (source.noteOff) { // old api
        source.noteOff(delay + 0.3)
      } else { // new api
        source.stop(delay + 0.3)
      }
      delete sources[sid]
    }
  }

  audio.setEffects = function (list) {
    if (audio.audioContext.tunajs) {
      for (var n = 0; n < list.length; n++) {
        var data = list[n]
        var effect = new audio.audioContext.tunajs[data.type](data)
        effect.connect(audio.audioContext.destination)
        effects[data.type] = effect
      }
    } else {
      return console.log('Effects module not installed.')
    }
  }

  audio._connect = function (opts) {
    root.setDefaultPlugin(audio)
    audio._setContext(audio.audioContext || new window.AudioContext(), opts.onsuccess)
  }

  audio._setContext = function (ctx, onload, onprogress, onerror) {
    audio.audioContext = ctx

    // tuna.js effects module - https://github.com/Dinahmoe/tuna
    if (typeof window.Tuna !== 'undefined' && !audio.audioContext.tunajs) {
      audio.audioContext.tunajs = new window.Tuna(ctx)
    }

    // loading audio files
    var urls = []
    var notes = root.keyToNote
    for (let key in notes) urls.push(key)

    var waitForEnd = function (instrument) {
      for (let key in bufferPending) { // has pending items
        if (bufferPending[key]) return
      }
      if (onload) { // run onload once
        onload()
        onload = null
      }
    }

    var requestAudio = function (soundfont, instrumentId, index, key) {
      var url = soundfont[key]
      if (url) {
        bufferPending[instrumentId]++
        _loadAudio(url, function (buffer) {
          buffer.id = key
          var noteId = root.keyToNote[key]
          console.log(buffer)
          audio.audioBuffers[instrumentId + '' + noteId] = buffer
          if (--bufferPending[instrumentId] === 0) {
            waitForEnd(instrument)
          }
        }, function (err) {
          console.error(err)
        })
      }
    }

    var bufferPending = {}
    for (var instrument in root.Soundfont) {
      var soundfont = root.Soundfont[instrument]
      if (soundfont.isLoaded) {
        continue
      }
      var synth = root.GM.byName[instrument]
      var instrumentId = synth.number
      bufferPending[instrumentId] = 0
      for (let index = 0; index < urls.length; index++) {
        let key = urls[index]
        requestAudio(soundfont, instrumentId, index, key)
      }
    }
    // /
    setTimeout(waitForEnd, 1)
  }

  /* Load audio file: base64 | arraybuffer
  ---------------------------------------------------------------------- */
  function _loadAudio (url, onload, onerror) {
    if (url.indexOf('data:audio') === 0) { // Base64 string
      var base64 = url.split(',')[1]
      var buffer = base64ToArrayBuffer(base64)
      audio.audioContext.decodeAudioData(buffer, onload, onerror)
    } else { // XMLHTTP buffer
      var request = new window.XMLHttpRequest()
      request.open('GET', url, true)
      request.responseType = 'arraybuffer'
      request.onload = function () {
        audio.audioContext.decodeAudioData(request.response, onload, onerror)
      }
      request.send()
    }
  }
})()

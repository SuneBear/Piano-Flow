/*
  ----------------------------------------------------------
  MIDI.Player : 0.3.1 : 2015-03-26
  ----------------------------------------------------------
  https://github.com/mudcube/midi.js
  ----------------------------------------------------------
*/

import { MidiFile, Replayer } from './jasmid'
import root from './_root'

(function () {
  root.Player = {}
  const player = root.Player
  player.currentTime = 0
  player.endTime = 0
  player.restart = 0
  player.playing = false
  player.timeWarp = 1
  player.startDelay = 0
  player.BPM = 120

  player.start = player.resume = function (onsuccess) {
    if (player.currentTime < -1) {
      player.currentTime = -1
    }
    startAudio(player.currentTime, null, onsuccess)
  }

  player.pause = function () {
    var tmp = player.restart
    stopAudio()
    player.restart = tmp
  }

  player.stop = function () {
    stopAudio()
    player.clearAnimation()
    player.restart = 0
    player.currentTime = 0
  }

  player.addListener = function (onsuccess) {
    onMidiEvent = onsuccess
  }

  player.removeListener = function () {
    onMidiEvent = undefined
  }

  player.clearAnimation = function () {
    if (player.animationFrameId) {
      window.cancelAnimationFrame(player.animationFrameId)
    }
  }

  player.setAnimation = function (callback) {
    var currentTime = 0
    var tOurTime = 0
    var tTheirTime = 0
    //
    player.clearAnimation()
    // /
    var frame = function () {
      player.animationFrameId = window.requestAnimationFrame(frame)
      // /
      if (player.endTime === 0) {
        return
      }
      if (player.playing) {
        currentTime = (tTheirTime === player.currentTime) ? tOurTime - Date.now() : 0
        if (player.currentTime === 0) {
          currentTime = 0
        } else {
          currentTime = player.currentTime - currentTime
        }
        if (tTheirTime !== player.currentTime) {
          tOurTime = Date.now()
          tTheirTime = player.currentTime
        }
      } else { // paused
        currentTime = player.currentTime
      }
      // /
      var endTime = player.endTime
      // var percent = currentTime / endTime
      var total = currentTime / 1000
      var minutes = total / 60
      var seconds = total - (minutes * 60)
      var t1 = minutes * 60 + seconds
      var t2 = (endTime / 1000)
      // /
      if (t2 - t1 < -1.0) {
        return
      } else {
        callback({
          now: t1,
          end: t2,
          events: noteRegistrar
        })
      }
    }
    // /
    window.requestAnimationFrame(frame)
  }

  // helpers

  player.loadMidiFile = function (onsuccess, onprogress, onerror) {
    try {
      player.replayer = new Replayer(MidiFile(player.currentData), player.timeWarp, null, player.BPM)
      player.data = player.replayer.getData()
      player.endTime = getLength()
      root.loadPlugin({
        onsuccess: onsuccess,
        onprogress: onprogress,
        onerror: onerror
      })
    } catch (event) {
      console.error(event)
      onerror && onerror(event)
    }
  }

  player.parseFile = function (file, onsuccess, onprogress, onerror) {
    player.stop()
    const reader = new window.FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const data = window.atob(reader.result.split(',')[1])
      player.currentData = data
      player.loadMidiFile(onsuccess, onprogress, onerror)
    }
  }

  player.loadPiece = function (options) {
    return new Promise((resolve, reject) => {
      root.loadPlugin({
        instrument: options.instrument,
        onprogress: options.onProgress,
        onsuccess: () => {
          player.parseFile(options.piece.midiFile, () => {
            // Change instrument
            root.channels[0].instrument = root.GM.byName[options.instrument].number
            // Loaded callback
            options.onLoaded && options.onLoaded()
            resolve()
          })
        }
      })
    })
  }

  player.getFileInstruments = function () {
    var instruments = {}
    var programs = {}
    for (var n = 0; n < player.data.length; n++) {
      var event = player.data[n][0].event
      if (event.type !== 'channel') {
        continue
      }
      var channel = event.channel
      switch (event.subtype) {
        case 'controller':
          // console.log(event.channel, root.defineControl[event.controllerType], event.value)
          break
        case 'programChange':
          programs[channel] = event.programNumber
          break
        case 'noteOn':
          var program = programs[channel]
          var gm = root.GM.byId[isFinite(program) ? program : channel]
          instruments[gm.id] = true
          break
      }
    }
    var ret = []
    for (var key in instruments) {
      ret.push(key)
    }
    return ret
  }

  // Playing the audio
  var eventQueue = [] // hold events to be triggered
  var queuedTime //
  var startTime = 0 // to measure time elapse
  var noteRegistrar = {} // get event for requested note
  var onMidiEvent // listener
  var scheduleTracking = function (channel, note, currentTime, offset, message, velocity, time) {
    return setTimeout(function () {
      var data = {
        channel: channel,
        note: note,
        now: currentTime,
        end: player.endTime,
        message: message,
        velocity: velocity
      }
      //
      if (message === 128) {
        delete noteRegistrar[note]
      } else {
        noteRegistrar[note] = data
      }
      if (onMidiEvent) {
        onMidiEvent(data)
      }
      player.currentTime = currentTime
      // /
      eventQueue.shift()
      // /
      if (eventQueue.length < 1000) {
        startAudio(queuedTime, true)
      } else if (player.currentTime === queuedTime && queuedTime < player.endTime) { // grab next sequence
        startAudio(queuedTime, true)
      }
    }, currentTime - offset)
  }

  player.getContext = function () {
    if (root.api === 'webaudio') {
      return root.WebAudio.audioContext
    } else {
      player.ctx = {currentTime: 0}
    }
    return player.ctx
  }

  var getLength = function () {
    var data = player.data
    var length = data.length
    var totalTime = 0.5
    for (var n = 0; n < length; n++) {
      totalTime += data[n][1]
    }
    return totalTime
  }

  var __now
  var getNow = function () {
    if (window.performance && window.performance.now) {
      return window.performance.now()
    } else {
      return Date.now()
    }
  }

  var startAudio = function (currentTime, fromCache, onsuccess) {
    if (!player.replayer) {
      return
    }
    if (!fromCache) {
      if (typeof currentTime === 'undefined') {
        currentTime = player.restart
      }
      // /
      player.playing && stopAudio()
      player.playing = true
      player.data = player.replayer.getData()
      player.endTime = getLength()
    }
    // /
    var note
    var offset = 0
    var messages = 0
    var data = player.data
    var ctx = player.getContext()
    var length = data.length
    //
    queuedTime = 0.5
    // /
    // var interval = eventQueue[0] && eventQueue[0].interval || 0
    var foffset = currentTime - player.currentTime
    // /
    if (root.api !== 'webaudio') { // set currentTime on ctx
      var now = getNow()
      __now = __now || now
      ctx.currentTime = (now - __now) / 1000
    }
    // /
    startTime = ctx.currentTime
    // /
    for (var n = 0; n < length && messages < 100; n++) {
      var obj = data[n]
      if ((queuedTime += obj[1]) <= currentTime) {
        offset = queuedTime
        continue
      }
      // /
      currentTime = queuedTime - offset
      // /
      var event = obj[0].event
      if (event.type !== 'channel') {
        continue
      }
      // /
      var channelId = event.channel
      var channel = root.channels[channelId]
      var delay = ctx.currentTime + ((currentTime + foffset + player.startDelay) / 1000)
      var queueTime = queuedTime - offset + player.startDelay
      switch (event.subtype) {
        case 'programChange':
          root.programChange(channelId, event.programNumber, delay)
          break
        case 'pitchBend':
          root.pitchBend(channelId, event.value, delay)
          break
        case 'noteOn':
          if (channel.mute) break
          note = event.noteNumber - (player.MIDIOffset || 0)
          eventQueue.push({
            event: event,
            time: queueTime,
            source: root.noteOn(channelId, event.noteNumber, event.velocity, delay),
            interval: scheduleTracking(channelId, note, queuedTime + player.startDelay, offset - foffset, 144, event.velocity)
          })
          messages++
          break
        case 'noteOff':
          if (channel.mute) break
          note = event.noteNumber - (player.MIDIOffset || 0)
          eventQueue.push({
            event: event,
            time: queueTime,
            source: root.noteOff(channelId, event.noteNumber, delay),
            interval: scheduleTracking(channelId, note, queuedTime, offset - foffset, 128, 0)
          })
          break
        default:
          break
      }
    }
    // /
    onsuccess && onsuccess(eventQueue)
  }

  var stopAudio = function () {
    var ctx = player.getContext()
    player.playing = false
    player.restart += (ctx.currentTime - startTime) * 1000
    // stop the audio, and intervals
    while (eventQueue.length) {
      let o = eventQueue.pop()
      window.clearInterval(o.interval)
      if (!o.source) continue // is not webaudio
      if (typeof (o.source) === 'number') {
        window.clearTimeout(o.source)
      } else { // webaudio
        o.source.disconnect(0)
      }
    }
    // run callback to cancel any notes still playing
    for (var key in noteRegistrar) {
      let o = noteRegistrar[key]
      if (noteRegistrar[key].message === 144 && onMidiEvent) {
        onMidiEvent({
          channel: o.channel,
          note: o.note,
          now: o.now,
          end: o.end,
          message: 128,
          velocity: o.velocity
        })
      }
    }
    // reset noteRegistrar
    noteRegistrar = {}
  }
})()

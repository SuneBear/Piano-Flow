/*
  ----------------------------------------------------------
  root.Plugin : 0.3.4 : 2015-03-26
  ----------------------------------------------------------
  https://github.com/mudcube/root.js
  ----------------------------------------------------------
  Inspired by javax.sound.midi (albeit a super simple version):
    http://docs.oracle.com/javase/6/docs/api/javax/sound/midi/package-summary.html
  ----------------------------------------------------------
  Technologies
  ----------------------------------------------------------
    Web MIDI API - no native support yet (jazzplugin)
    Web Audio API - firefox 25+, chrome 10+, safari 6+, opera 15+
    HTML5 Audio Tag - ie 9+, firefox 3.5+, chrome 4+, safari 4+, opera 9.5+, ios 4+, android 2.3+
  ----------------------------------------------------------
*/

import { request } from './utils'
import root from './_root'

root.Soundfont = {}
root.soundfontUrl = './assets/soundfonts/'

/*
  root.loadPlugin({
    onsuccess: function() { },
    onprogress: function(state, percent) { },
    targetFormat: 'mp3', // optionally can force to use MP3 (for instance on mobile networks)
    instrument: 'acoustic_grand_piano', // or 1 (default)
    instruments: [ 'acoustic_grand_piano', 'acoustic_guitar_nylon' ] // or multiple instruments
  })
*/

root.loadPlugin = function (opts) {
  if (typeof opts === 'function') opts = { onsuccess: opts }

  root.soundfontUrl = opts.soundfontUrl || root.soundfontUrl
  root.__api = 'webaudio'
  root.__audioFormat = 'mp3'

  root.loadResource(opts)
}

/*
  root.loadResource({
    onsuccess: function() { },
    onprogress: function(state, percent) { },
    instrument: 'banjo'
  })
*/

root.loadResource = function (opts) {
  var instruments = opts.instruments || opts.instrument || 'acoustic_grand_piano'
  // /
  if (typeof instruments !== 'object') {
    if (instruments || instruments === 0) {
      instruments = [instruments]
    } else {
      instruments = []
    }
  }
  // / convert numeric ids into strings
  for (var i = 0; i < instruments.length; i++) {
    var instrument = instruments[i]
    if (instrument === +instrument) { // is numeric
      if (root.GM.byId[instrument]) {
        instruments[i] = root.GM.byId[instrument].id
      }
    }
  }
  // /
  opts.format = root.__audioFormat
  opts.instruments = instruments
  // /
  requestQueue(opts, 'WebAudio')
}

var requestQueue = function (opts, context) {
  var audioFormat = opts.format
  var instruments = opts.instruments
  var onprogress = opts.onprogress
  var onsuccess = opts.onsuccess
  var onerror = opts.onerror
  // /
  var length = instruments.length
  var pending = length
  var waitForEnd = function () {
    if (!--pending) {
      onprogress && onprogress('load', 1.0)
      // root.connect[context](opts)
      onsuccess && onsuccess()
    }
  }
  // /
  for (var i = 0; i < length; i++) {
    var instrumentId = instruments[i]
    if (root.Soundfont[instrumentId]) { // already loaded
      waitForEnd()
    } else { // needs to be requested
      sendRequest(instruments[i], audioFormat, function (evt, progress) {
        var fileProgress = progress / length
        var queueProgress = (length - pending) / length
        onprogress && onprogress('load', fileProgress + queueProgress, instrumentId)
      }, function () {
        waitForEnd()
      }, onerror)
    }
  }
}

var sendRequest = function (instrumentId, audioFormat, onprogress, onsuccess, onerror) {
  var soundfontPath = root.soundfontUrl + instrumentId + '-' + audioFormat + '.js'
  request({
    url: soundfontPath,
    format: 'text',
    onerror: onerror,
    onprogress: onprogress,
    onsuccess: function (event, responseText) {
      var script = document.createElement('script')
      script.language = 'javascript'
      script.type = 'text/javascript'
      script.text = responseText
      document.body.appendChild(script)
      onsuccess()
    }
  })
}

root.setDefaultPlugin = function (midi) {
  for (var key in midi) {
    root[key] = midi[key]
  }
}

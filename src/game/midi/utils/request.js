/*
  ----------------------------------------------------------
  Request : 0.1.1 : 2015-03-26
  ----------------------------------------------------------
  request({
    url: './dir/something.extension',
    data: 'test!',
    format: 'text', // text | xml | json | binary
    responseType: 'text', // arraybuffer | blob | document | json | text
    headers: {},
    withCredentials: true, // true | false
    ///
    onerror: function(evt, percent) {
      console.log(evt)
    },
    onsuccess: function(evt, responseText) {
      console.log(responseText)
    },
    onprogress: function(evt, percent) {
      percent = Math.round(percent * 100)
      loader.create('thread', 'loading... ', percent)
    }
  })
*/

export function request (opts, onsuccess, onerror, onprogress) {
  if (typeof opts === 'string') opts = {url: opts}
  const data = opts.data
  const url = opts.url
  const method = opts.method || (opts.data ? 'POST' : 'GET')
  const format = opts.format
  const headers = opts.headers
  const responseType = opts.responseType
  const withCredentials = opts.withCredentials || false
  const xhr = new window.XMLHttpRequest()
  onsuccess = onsuccess || opts.onsuccess
  onerror = onerror || opts.onerror
  onprogress = onprogress || opts.onprogress
  xhr.open(method, url, true)
  if (headers) {
    for (var type in headers) {
      xhr.setRequestHeader(type, headers[type])
    }
  } else if (data) { // set the default headers for POST
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  }
  if (format === 'binary') { // - default to responseType="blob" when supported
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined')
    }
  }
  if (responseType) {
    xhr.responseType = responseType
  }
  if (withCredentials) {
    xhr.withCredentials = 'true'
  }
  if (onerror && 'onerror' in xhr) {
    xhr.onerror = onerror
  }
  if (onprogress && xhr.upload && 'onprogress' in xhr.upload) {
    if (data) {
      xhr.upload.onprogress = function (evt) {
        onprogress.call(xhr, evt, evt.loaded / evt.total)
      }
    } else {
      xhr.addEventListener('progress', function (evt) {
        var totalBytes = 0
        if (evt.lengthComputable) {
          totalBytes = evt.total
        } else if (xhr.totalBytes) {
          totalBytes = xhr.totalBytes
        } else {
          var rawBytes = parseInt(xhr.getResponseHeader('Content-Length'))
          if (isFinite(rawBytes)) {
            xhr.totalBytes = totalBytes = rawBytes
          } else {
            return
          }
        }
        onprogress.call(xhr, evt, evt.loaded / totalBytes)
      })
    }
  }
  // /
  xhr.onreadystatechange = function (evt) {
    if (xhr.readyState === 4) { // The request is complete
      if (xhr.status === 200 || // Response OK
        xhr.status === 304 || // Not Modified
        xhr.status === 308 // Permanent Redirect
      ) {
        if (onsuccess) {
          var res
          if (format === 'xml') {
            res = evt.target.responseXML
          } else if (format === 'text') {
            res = evt.target.responseText
          } else if (format === 'json') {
            try {
              res = JSON.parse(evt.target.response)
            } catch (err) {
              onerror && onerror.call(xhr, evt)
            }
          }
          onsuccess.call(xhr, evt, res)
        }
      } else {
        onerror && onerror.call(xhr, evt)
      }
    }
  }
  xhr.send(data)
  return xhr
}

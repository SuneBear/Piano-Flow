// rgb(12,173,22) or #D22BFF => [12, 173, 22]
function _rgb2Array (colorString) {
  if (colorString.indexOf('#') !== -1 && colorString.length === 7) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString)
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
  } else {
    const digits = /(.*?)rgb(a)*\((\d+),(\d+),(\d+)(,[0-9]*\.*[0-9]+)*\)/i.exec(colorString.replace(/\s+/g, ''))
    return [parseInt(digits[3]), parseInt(digits[4]), parseInt(digits[5])]
  }
}

function _blendAlpha (color, alpha, bg) {
  return Math.round(alpha * color + (1 - alpha) * bg)
}

// REF: https://github.com/christian-bromann/rgb2hex/blob/master/rgb2hex.js
// rgb(12,173,22) => D22BFF
export function rgb2hex (color, options = { hasPrefix: true }) {
  const colorArray = Array.isArray(color) ? color : _rgb2Array(color)
  const red = colorArray[0]
  const green = colorArray[1]
  const blue = colorArray[2]
  let rgb = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1).toUpperCase()
  if (options.hasPrefix) rgb = '0x' + rgb
  return rgb
}

export function blendAlpha (frontColorString, frontAlpha, bgColorString, options = { hasPrefix: true }) {
  const frontColorArray = _rgb2Array(frontColorString)
  const bgColorArray = _rgb2Array(bgColorString)
  const newColorArray = [
    _blendAlpha(frontColorArray[0], frontAlpha, bgColorArray[0]),
    _blendAlpha(frontColorArray[1], frontAlpha, bgColorArray[1]),
    _blendAlpha(frontColorArray[2], frontAlpha, bgColorArray[2])
  ]
  return rgb2hex(newColorArray, options)
}


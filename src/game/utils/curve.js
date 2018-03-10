/**
 * Constrains a value between a minimum and maximum value.
 * @param {Number} n    number to constrain
 * @param {Number} low  minimum limit
 * @param {Number} high maximum limit
 *
 */
function constrain (n, low, high) {
  return Math.max(Math.min(n, high), low)
}

/**
 * Exponential ease out, adapted from Golan Levin's [polynomial shapers](http://www.flong.com/texts/code/shapers_poly/)
 * @parma {Number} t a value between 0 to 1
 * @parma {Number} c the value to shape, default is 1
 * @parma {Number} p a value between 0 to 1 to control the curve. Default is 0.25.
 */
function exponentialOut (t, c = 1, p = 0.25) {
  return c * Math.pow(t, p)
}

/**
 * Re-maps a number from one range to another.
 * In the first example above, the number 25 is converted from a value in the
 * range of 0 to 100 into a value that ranges from the left edge of the
 * window (0) to the right edge (width).
 *
 * @param {Number} value  the incoming value to be converted
 * @param {Number} start1 lower bound of the value's current range
 * @param {Number} stop1  upper bound of the value's current range
 * @param {Number} start2 lower bound of the value's target range
 * @param {Number} stop2  upper bound of the value's target range
 * @param {Boolean} [withinBounds] constrain the value to the newly mapped range
 * @return {Number} remapped number
 */
export function map (n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2)
  } else {
    return constrain(newval, stop2, start2)
  }
}

export function mapCurve (origin, start1, stop1, start2, stop2, delta) {
  if (Math.abs(delta) < 0.001) {
    return map(origin, start1, stop1, start2, stop2)
  }

  const expDelta = Math.exp(delta)
  const amt = 1 - expDelta
  const targetRangeDiff = (stop2 - start2) / amt
  const lerpedTargetValue = start2 + targetRangeDiff
  const originRatio = (origin - start1) / (stop1 - start1)
  return lerpedTargetValue - exponentialOut(expDelta, targetRangeDiff, originRatio)
}

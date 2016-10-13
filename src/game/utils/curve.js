// From TouchPianist, need to unuglify
export function mapCurve (a, b, c, d, e, f) {
  if (Math.abs(f) < 0.001) return (a - b) / (c - b) * (e - d) + d
  let g = Math.exp(f)
  let h = (e - d) / (1 - g)
  let i = d + h
  let j = (a - b) / (c - b)
  return i - h * Math.pow(g, j)
}

// Convert a midi note number to a frequency in hz
export const midicps = []
for (let mInd = 0; mInd < 128; mInd++) {
  midicps.push(440 * Math.pow(2, 0.083333333333 * (mInd - 69)))
}

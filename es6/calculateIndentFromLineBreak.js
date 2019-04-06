/**
 *
 * @param {string} str
 * @param {number} pointer
 * @returns {number}
 */
export default (str, pointer) => {
  let spaceStart = false
  let spaceStartPointer = 0
  let spaceEndPointer = 0
  for (let i = pointer; i >= 0; --i) {
    if (str[i] === ' ' && !spaceStart) {
      spaceStart = true
      spaceStartPointer = i
    } else if (str[i] === '\n' || i === 0) {
      spaceEndPointer = i
      if (str[i] === '\n' && i === 0 && spaceStartPointer > 2) {
        ++spaceEndPointer
      } else if (str[i] !== '\n' && i === 0 && spaceStartPointer > 0) {
        --spaceEndPointer
      }
      break
    } else if (str[i] !== ' ') {
      spaceStart = false
      spaceStartPointer = 0
    }
  }
  return (spaceStartPointer === 0) ? 0 : spaceStartPointer - spaceEndPointer
}

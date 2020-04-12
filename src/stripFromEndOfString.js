module.exports = (input, strip) => {
  return (input.substring(input.length - strip.length) === strip) ?
    input.substring(0, input.length - strip.length) :
    input
}

module.exports = function (conf) {
  if (!Array.isArray(conf)) {
    throw new Error('The BOATS helper "inject" should be an array of inject objects')
  }
  if (!global.boatsInject) {
    console.log('Injection object stored')
    global.boatsInject = conf
  }
  return ''
}

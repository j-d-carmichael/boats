module.exports = (e) => {
  console.dir(e, { depth: null });
  throw new Error(e)
}

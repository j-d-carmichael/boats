import Bundler from '../es6/Bundler'

let bundler

const tryOrFail = (f, done) => {
  try {
    f()
    done()
  }
  catch (e) {
    done(e)
  }
}

describe('Load the construct', () => {
  it('should not fail with a simple import point', (done) => {
    tryOrFail(() => {
      bundler = new Bundler({
        input: './srcOA2/index.yml'
      })
    }, done)
  })

  it('should not fail with a simple import point and exclude_version', (done) => {
    tryOrFail(() => {
      bundler = new Bundler({
        input: './srcOA2/index.yml',
        exclude_version: true
      })
    }, done)
  })

  it('should fail with missing input', (done) => {
    try {
      bundler = new Bundler({
        exclude_version: true
      })
      done('Did not fail!')
    }
    catch (e) {
      done()
    }
  })
})

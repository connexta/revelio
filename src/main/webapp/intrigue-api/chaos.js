const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * max) + min
}

const randomFailure = errorRate => {
  if (Math.random() < errorRate) {
    throw new Error(
      `Chaos Induced Failure(errorRate: ${Math.floor(errorRate * 100)}%)`
    )
  }
}

const randomize = async (opts = {}) => {
  const {
    sleepMin = 500,
    sleepMax = 1000,
    errorRate = 0.55, // 10% error rate
  } = opts

  await sleep(randomBetween(sleepMin, sleepMax))
  randomFailure(errorRate)
}

const withChaos = (fn, opts) => async (...args) => {
  await randomize(opts)
  return fn(...args)
}

module.exports = withChaos

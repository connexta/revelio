const sleep = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })

const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min
}

const randomFailure = (errorRate: number) => {
  if (Math.random() < errorRate) {
    throw new Error(
      `Chaos Induced Failure(errorRate: ${Math.floor(errorRate * 100)}%)`
    )
  }
}

type Options = {
  sleepMin?: number
  sleepMax?: number
  errorRate?: number
}
const randomize = async (opts: Options) => {
  const {
    sleepMin = 500,
    sleepMax = 1000,
    errorRate = 0.1, // 10% error rate
  } = opts

  await sleep(randomBetween(sleepMin, sleepMax))
  randomFailure(errorRate)
}

const withChaos = (fn: any, opts: Options = {}) => async (...args: any[]) => {
  await randomize(opts)
  return fn(...args)
}

export default withChaos

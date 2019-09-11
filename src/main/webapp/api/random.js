const sleep = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout)
  })

const randomSleep = async () => {
  const timeout = Math.floor((Math.random() * 10000) % 1000)
  await sleep(timeout)
}

const randomFailure = () => {
  if (Math.random() < 0.1) {
    throw new Error('Random Failure')
  }
}

const randomize = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await randomSleep()
    randomFailure()
  }
}

export default randomize

import fetch from './fetch'

const resultForms = './internal/forms/result'

const getResultForms = async () => {
  const res = await fetch('./internal/forms/result')
  return res.json()
}

export { getResultForms }

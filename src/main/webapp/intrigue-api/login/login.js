const ROOT = '/search/catalog/internal'

const typeDefs = `
    extend type Mutation {
        logIn(username: String!, password: String!): String
    }`

const btoa = arg => {
  if (typeof window !== 'undefined') {
    return window.btoa(arg)
  }
  return Buffer.from(arg).toString('base64')
}

const logIn = async (parent, args, { fetch }) => {
  const { username, password } = args
  const authorization = 'Basic ' + btoa(`${username}:${password}`)
  const res = await fetch(ROOT, {
    headers: {
      authorization,
    },
  })
  return res.headers.get('set-cookie')
}

const resolvers = {
  Mutation: {
    logIn,
  },
}

module.exports = {
  resolvers,
  typeDefs,
}

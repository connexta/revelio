const LA = {
  title: 'Los Angeles',
  description: `Painting should do one thing. It should put happiness in your heart.
  Give him a friend, we forget the trees get lonely too. Don't forget to tell these special people in your life just how special they are to you.
  If I paint something, I don't want to have to explain what it is. We're not trying to teach you a thing to copy.
  We're just here to teach you a technique, then let you loose into the world. Trees get lonely too, so we'll give him a little friend.`,
  created: 'September 4, 1781',
  modified: 'April 29, 1992',
  checksum: '1',
}

const genResults = (n = 100) => {
  const results = []

  results.push({
    metacard: {
      properties: {
        ...LA,
        id: '-1',
      },
    },
  })

  for (let i = 0; i < n; i++) {
    results.push({
      metacard: {
        properties: {
          ...LA,
          id: i.toString(),
        },
      },
    })
  }

  return results
}

export default genResults

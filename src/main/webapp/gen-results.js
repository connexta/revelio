const LA = {
  title: 'Los Angeles',
  description: `Painting should do one thing. It should put happiness in your heart.
  Give him a friend, we forget the trees get lonely too. Don't forget to tell these special people in your life just how special they are to you.
  If I paint something, I don't want to have to explain what it is. We're not trying to teach you a thing to copy.
  We're just here to teach you a technique, then let you loose into the world. Trees get lonely too, so we'll give him a little friend.`,
  created: 'September 4, 1781',
  modified: 'April 29, 1992',
  checksum: '1',
  location: 'POINT(-118.2437 34.0522)',
}

const DC = {
  title: 'Washington DC',
  description: `To exercise exclusive Legislation in all Cases whatsoever, over such District (not exceeding ten Miles square) as
  may, by Cession of Particular States, and the Acceptance of Congress, become the Seat of the Government of
  the United States, and to exercise like Authority over all Places purchased by the Consent of the Legislature of
  the State in which the Same shall be, for the Erection of Forts, Magazines, Arsenals, dock-Yards and other
  needful Buildings`,
  created: 'July 16, 1790',
  modified: 'February 21, 1871',
  checksum: '1',
  location: 'POINT(-77.0369 38.9072)',
}

const PHOENIX = {
  title: 'Phoenix',
  description: `According to legend, Phoenix gets its name from Cambridge-educated pioneer Darrell Duppa, who saw the
  ruins and prehistoric canals of the Hohokam and believed another civilization would rise from the ashes.`,
  created: 'February 25, 1881',
  modified: 'February 14, 1912',
  checksum: '1',
  location: 'POINT(-112.0740 33.4484)',
}

const PARIS = {
  title: 'Paris',
  description: `Liberty, equality, fraternity, or death; - the last, much the easiest to bestow, O Guillotine!`,
  created: '250 CE',
  modified: 'August 25, 1944',
  checksum: '1',
  location: 'POINT(2.3522 48.8566)',
}

const CITIES = [DC, LA, PARIS, PHOENIX]

const genResults = (n = 100) =>
  new Array(n).fill(0).map((_v, i) => ({
    metacard: {
      properties: {
        ...CITIES[Math.min(i, CITIES.length - 1)],
        id: (i+1).toString(),
      },
    },
  }))

export default genResults

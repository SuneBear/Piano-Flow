const musicians = [
  {
    name: 'Johann Sebastian Bach',
    alias: 'J.S. Bach',
    birthday: '1685-03-31',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Ludwig van Beethoven',
    alias: 'L.V. Beethoven',
    birthday: '1770-12-17',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Frédéric François Chopin',
    alias: 'Frederic Chopin',
    birthday: '1810-03-01',
    country: 'Poland',
    style: 'Classical'
  },
  {
    name: 'Johannes Brahms',
    alias: 'Brahms',
    birthday: '1833-05-07',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Edvard Hagerup Grieg',
    alias: 'Edvard Grieg',
    birthday: '1843-06-15',
    country: 'Norway',
    style: 'Classical'
  },
  {
    name: 'Claude Debussy',
    alias: 'Claude-Achille Debussy',
    birthday: '1862-08-22',
    country: 'France',
    style: 'Classical'
  }
]

// Generate avatar
musicians.map(musician => {
  const filename = musician.name.replace(/\s/g, '-')
  musician.avatar = require(`../../assets/images/musicians/${filename}.png`)
  return musician
})

export default musicians

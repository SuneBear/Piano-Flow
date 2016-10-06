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

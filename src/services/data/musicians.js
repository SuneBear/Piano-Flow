const musicians = [
  {
    name: 'Johann Sebastian Bach',
    alias: 'J.S. Bach',
    birthday: '1685-03-31',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Joseph Haydn',
    alias: 'Franz Joseph Haydn',
    birthday: '1732-03-31',
    country: 'Austria',
    style: 'Classical'
  },
  {
    name: 'Wolfgang Amadeus Mozart',
    alias: 'Johannes Chrysostomus Wolfgangus Theophilus Mozart',
    birthday: '1756-01-27',
    country: 'Austria',
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
    name: 'Franz Schubert',
    alias: 'Franz Peter Schubert',
    birthday: '1797-01-31',
    country: 'Austria',
    style: 'Classical'
  },
  {
    name: 'Felix Mendelssohn',
    alias: 'Jakob Ludwig Felix Mendelssohn Bartholdy',
    birthday: '1809-02-03',
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
    name: 'Robert Schumann',
    birthday: '1810-06-08',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Franz Liszt',
    alias: 'Liszt Ferenc',
    birthday: '1811-10-22',
    country: 'Hungary',
    style: 'Classical'
  },
  {
    name: 'Johannes Brahms',
    birthday: '1833-05-07',
    country: 'Germany',
    style: 'Classical'
  },
  {
    name: 'Modest Mussorgsky',
    alias: 'Modest Petrovich Mussorgsky',
    birthday: '1839-03-21',
    country: 'Russia',
    style: 'Classical'
  },
  {
    name: 'Pyotr Ilyich Tchaikovsky',
    alias: 'Peter Ilyich Tchaikovsky',
    birthday: '1840-04-25',
    country: 'Russia',
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
  },
  {
    name: 'Sergei Rachmaninoff',
    alias: 'Sergei Vasilievich Rachmaninoff',
    birthday: '1873-04-01',
    country: 'Russia',
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

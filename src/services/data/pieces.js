import _ from 'lodash'
import musicians from './musicians'

const musiciansMap = _.keyBy(musicians, 'name')

const pieces = [
  {
    name: 'Prélude',
    suite: 'Suite Bergamasque',
    number: 1,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized'
  },
  {
    name: 'Menuet',
    suite: 'Suite Bergamasque',
    number: 2,
    musician: musiciansMap['Claude Debussy'],
    theme: 'midnight'
  },
  {
    name: 'Clair de Lune',
    suite: 'Suite Bergamasque',
    number: 3,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized'
  },
  {
    name: 'Passepied',
    suite: 'Suite Bergamasque',
    number: 4,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized'
  },
  {
    name: 'Air on the G String',
    suite: 'Orchestral Suite',
    number: 3, // Combine with suite
    snc: 'BWV 1068', // Standard Numbered Catalogue
    pitch: 'D',
    musician: musiciansMap['Johann Sebastian Bach'],
    theme: 'moonized'
  },
  {
    name: 'Prelude in C',
    suite: null,
    number: 1,
    snc: 'WTC Bk. 1',
    pitch: 'C',
    musician: musiciansMap['Johann Sebastian Bach'],
    theme: 'moonized'
  },
  {
    name: 'Moonlight, 1st',
    suite: 'Piano Sonata',
    number: 14,
    pitch: 'C Sharp Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'midnight'
  },
  {
    name: 'Moonlight, 3rd',
    suite: 'Piano Sonata',
    number: 14,
    pitch: 'C Sharp Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'midnight'
  },
  {
    name: 'Pathétique',
    suite: 'Piano Sonata',
    number: 8,
    pitch: 'C Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized'
  },
  {
    name: 'Symphony No.5, 1st',
    suite: null,
    snc: 'Op.67',
    pitch: 'C minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized'
  },
  {
    name: 'Ballade, 3rd',
    suite: null,
    snc: 'Op.118',
    pitch: 'G',
    musician: musiciansMap['Johannes Brahms'],
    theme: 'moonized'
  },
  {
    name: 'Capriccio, 2rd',
    suite: null,
    snc: 'Op.76',
    pitch: 'B minor',
    musician: musiciansMap['Johannes Brahms'],
    theme: 'moonized'
  }
]

// Generate piece fullname & ID
pieces.map(piece => {
  let fullname = `${piece.name} via ${piece.suite || piece.snc}`
  if (piece.number) fullname += `, No.${piece.number}`
  const id = fullname.replace(/(,?\s|\.)/g, '-').replace(/é/g, 'e')
  piece.fullname = fullname
  piece.id = id
  return piece
})

// Generate midi path
pieces.map(piece => {
  piece.midiPath = require(`../../assets/midis/${piece.id}.mid`)
  return piece
})

export default pieces

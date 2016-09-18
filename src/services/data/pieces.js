import _ from 'lodash'
import musicians from './musicians'

const musiciansMap = _.keyBy(musicians, 'name')

const pieces = [
  {
    name: 'Prélude',
    suite: 'Suite Bergamasque',
    number: 1,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Menuet',
    suite: 'Suite Bergamasque',
    number: 2,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Clair de Lune',
    suite: 'Suite Bergamasque',
    number: 3,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Passepied',
    suite: 'Suite Bergamasque',
    number: 4,
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Air on the G String',
    suite: 'Orchestral Suite',
    number: 3,
    id: 'BWV 1068',
    pitch: 'D',
    musician: musiciansMap['Johann Sebastian Bach'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Moonlight, 1st',
    suite: 'Piano Sonata',
    number: 14,
    pitch: 'C Sharp Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Moonlight, 3rd',
    suite: 'Piano Sonata',
    number: 14,
    pitch: 'C Sharp Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized',
    midi: null,
    mp3: null
  },
  {
    name: 'Pathétique',
    suite: 'Piano Sonata',
    number: 8,
    pitch: 'C Minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized',
    midi: null,
    mp3: null
  }
]

// Generate piece fullname & ID
pieces.map(piece => {
  const fullname = `${piece.name} via ${piece.suite}, No.${piece.number}`
  const id = fullname.replace(/(,?\s|\.)/g, '-').replace(/é/g, 'e')
  piece.fullname = fullname
  piece.id = id
  return piece
})

export default pieces

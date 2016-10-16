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
    name: 'Arabesque, 1st',
    pitch: 'E',
    snc: 'L. 66',
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized'
  },
  {
    name: 'Reverie',
    pitch: 'G',
    snc: 'L. 68',
    musician: musiciansMap['Claude Debussy'],
    theme: 'fantasy'
  },
  {
    name: 'La plus que lente',
    alias: 'Valse',
    snc: 'L. 121',
    pitch: '',
    musician: musiciansMap['Claude Debussy'],
    theme: 'moonized'
  },
  {
    name: 'The Girl With The Flaxen Hair',
    alias: 'La fille aux cheveux de lin',
    suite: 'Préludes, Book 1',
    number: '8',
    pitch: 'G',
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
    snc: 'Op.67',
    pitch: 'C minor',
    musician: musiciansMap['Ludwig van Beethoven'],
    theme: 'moonized'
  },
  {
    name: 'Ballade, 3rd',
    snc: 'Op.118',
    pitch: 'G',
    musician: musiciansMap['Johannes Brahms'],
    theme: 'moonized'
  },
  {
    name: 'Capriccio, 2nd',
    snc: 'Op.76',
    pitch: 'B minor',
    musician: musiciansMap['Johannes Brahms'],
    theme: 'moonized'
  },
  {
    name: 'Ballade, 1st',
    snc: 'Op.23',
    pitch: 'G',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'moonized'
  },
  {
    name: 'Prelude, 4th',
    snc: 'Op.28',
    pitch: 'E',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'moonized'
  },
  {
    name: 'Études, 1st',
    snc: 'Op.25',
    pitch: 'A flat',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'moonized'
  },
  {
    name: 'Études, 5th',
    snc: 'Op.10',
    pitch: 'G flat',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'moonized'
  },
  {
    name: 'Études, 11th',
    snc: 'Op.25',
    pitch: 'A',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'moonized'
  },
  {
    name: 'Nocturne, 1st',
    snc: 'Op.37',
    pitch: 'G',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'midnight'
  },
  {
    name: 'Nocturne, 2nd',
    snc: 'Op.9',
    pitch: 'E flat',
    musician: musiciansMap['Frédéric François Chopin'],
    theme: 'midnight'
  },
  {
    name: 'Arietta',
    suite: 'Lyric Pieces, Book 1',
    number: '8',
    pitch: '',
    musician: musiciansMap['Edvard Hagerup Grieg'],
    theme: 'moonized'
  },
  {
    name: 'March of the Dwarfs',
    suite: 'Lyric Pieces, Book 4',
    number: '3',
    pitch: '',
    musician: musiciansMap['Edvard Hagerup Grieg'],
    theme: 'moonized'
  },
  {
    name: 'Wedding Day at Troldhaugen',
    suite: 'Lyric Pieces, Book 8',
    number: '6',
    pitch: '',
    musician: musiciansMap['Edvard Hagerup Grieg'],
    theme: 'moonized'
  },
  {
    name: 'Solveigs sang',
    suite: 'Piano Pieces after Original Songs',
    number: '4',
    pitch: '',
    musician: musiciansMap['Edvard Hagerup Grieg'],
    theme: 'moonized'
  }
]

// Generate piece fullname & ID
pieces.map(piece => {
  let fullname = `${piece.name} via ${piece.suite || piece.snc}`
  if (piece.number) fullname += `, No.${piece.number}`
  const id = fullname
    .replace(/(,?\s|\.(\s?))/g, '-')
    .replace(/é/g, 'e')
    .replace(/É/g, 'E')
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

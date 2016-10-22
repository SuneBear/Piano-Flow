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
    theme: 'freshorigin'
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
    theme: 'midnight'
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
    pitch: 'C Minor',
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
    pitch: 'B Minor',
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
    theme: 'fantasy'
  },
  {
    name: 'Solveigs sang',
    suite: 'Piano Pieces after Original Songs',
    number: '4',
    pitch: '',
    musician: musiciansMap['Edvard Hagerup Grieg'],
    theme: 'moonized'
  },
  {
    name: 'Fantasy in C',
    snc: 'K. 475',
    pitch: 'C minor',
    musician: musiciansMap['Wolfgang Amadeus Mozart'],
    theme: 'moonized'
  },
  {
    name: 'Fantasy in D',
    snc: 'K. 397',
    pitch: 'D minor',
    musician: musiciansMap['Wolfgang Amadeus Mozart'],
    theme: 'moonized'
  },
  {
    name: 'Sonata, 3rd',
    snc: 'K. 331',
    pitch: 'A',
    musician: musiciansMap['Wolfgang Amadeus Mozart'],
    theme: 'moonized'
  },
  {
    name: 'Ah vous dirai-je, Maman',
    suite: 'Twelve Variations',
    musician: musiciansMap['Wolfgang Amadeus Mozart'],
    theme: 'moonized'
  },
  {
    name: 'Bydlo',
    suite: 'Pictures at an Exhibition',
    musician: musiciansMap['Modest Mussorgsky'],
    theme: 'monochrome'
  },
  {
    name: 'Promenade',
    suite: 'Pictures at an Exhibition',
    musician: musiciansMap['Modest Mussorgsky'],
    theme: 'moonized'
  },
  {
    name: 'Waltz of the Flowers',
    suite: 'The Nutcracker',
    number: '20',
    musician: musiciansMap['Pyotr Ilyich Tchaikovsky'],
    theme: 'fantasy'
  },
  {
    name: 'Dances of the Little Swans',
    suite: 'Swan Lake',
    snc: 'Op.20',
    number: '13d',
    musician: musiciansMap['Pyotr Ilyich Tchaikovsky'],
    theme: 'monochrome'
  },
  {
    name: 'Old French Song',
    snc: 'Op.39',
    number: '16',
    musician: musiciansMap['Pyotr Ilyich Tchaikovsky'],
    theme: 'bygone'
  },
  {
    name: 'Flight of the Bumblebee',
    suite: 'The Tale of Tsar Saltan',
    musician: musiciansMap['Sergei Rachmaninoff'],
    theme: 'moonized'
  },
  {
    name: 'Wedding March',
    suite: 'A Midsummer Night\'s Dream',
    snc: 'Op.61',
    number: '3',
    pitch: 'C',
    musician: musiciansMap['Felix Mendelssohn'],
    theme: 'lovepotion'
  },
  {
    name: 'Spring Song',
    snc: 'Op.62',
    number: '6',
    pitch: 'A',
    musician: musiciansMap['Felix Mendelssohn'],
    theme: 'moonized'
  },
  {
    name: 'Song without Words',
    snc: 'Op.85',
    number: '1',
    pitch: 'F',
    musician: musiciansMap['Felix Mendelssohn'],
    theme: 'moonized'
  },
  {
    name: 'La campanella',
    alisa: 'The little bell',
    suite: 'Paganini Etude',
    number: '3',
    pitch: 'G',
    musician: musiciansMap['Franz Liszt'],
    theme: 'moonized'
  },
  {
    name: 'Impromptu in G flat',
    snc: 'Op.90',
    number: '3',
    pitch: 'G flat',
    musician: musiciansMap['Franz Schubert'],
    theme: 'moonized'
  },
  {
    name: 'Impromptu in A flat',
    snc: 'Op.90',
    number: '4',
    pitch: 'A flat',
    musician: musiciansMap['Franz Schubert'],
    theme: 'moonized'
  },
  {
    name: 'Almost Too Serious',
    snc: 'Op.15',
    number: '10',
    pitch: 'G Sharp',
    musician: musiciansMap['Robert Schumann'],
    theme: 'moonized'
  },
  {
    name: 'Sonata, 1st',
    snc: 'Hob. XVI 52',
    pitch: 'E flat',
    musician: musiciansMap['Joseph Haydn'],
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

import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { request } from './utils'
import pieces from '../data/pieces'

class PieceAPI {

  constructor () {
    this.pieces = new ReplaySubject(1)
  }

  getPieces () {
    if (!this.hasFetched) this._fetchPieces()
    return this.pieces
  }

  getPieceById (id) {
    if (!this.hasFetched) this._fetchPieces()
    return this.pieces
      .map(pieces => pieces.find(piece => piece.id === id))
      .concatMap(piece => {
        return Observable.fromPromise(request(piece.midiPath))
          .map(fileBlob => {
            const reader = new window.FileReader()
            reader.readAsDataURL(fileBlob)
            reader.onloadend = () => { piece.midi = reader.result }
            return piece
          })
      })
  }

  _fetchPieces () {
    this.hasFetched = true
    Observable.fromPromise(Promise.resolve(pieces))
      .catch(() => { this.hasFetched = false })
      .subscribe(r => this.pieces.next(r))
  }
}

export const pieceAPI = new PieceAPI()

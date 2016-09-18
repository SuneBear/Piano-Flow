import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import pieces from '../data/pieces'

class PieceAPI {

  constructor () {
    this.hasFetched = false
    this.pieces = new ReplaySubject(1)
  }

  getPieces () {
    if (!this.hasFetched) this._fetchgetPieces()
    return this.pieces
  }

  getPieceById (id) {
    if (!this.hasFetched) this._fetchgetPieces()
    return this.pieces
      .map(pieces => pieces.find(piece => piece.id === id))
  }

  _fetchgetPieces () {
    this.hasFetched = true
    Observable.fromPromise(Promise.resolve(pieces))
      .catch(() => { this.hasFetched = false })
      .subscribe(r => this.pieces.next(r))
  }
}

export const pieceAPI = new PieceAPI()

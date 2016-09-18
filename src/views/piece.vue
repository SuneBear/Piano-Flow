<template>
<div class="piece-view">
  {{id}}
</div>
</template>

<script>
import game from '../game'
import { Subject } from 'rxjs/Subject'
import { context, pieceAPI } from '../services'

export default {
  data () {
    return {
      id$: new Subject(),
      piece: {},
      isLoaded: false
    }
  },

  computed: {
    id () {
      const id = this.$route.params.id
      this.id$.next(id)
      return id
    }
  },

  mounted () {
    if (__DEBUG__) window.game = game
    // FIXME: Rerender the component when changing routes
    this.signal = this.id$
      .mergeMap(id => pieceAPI.getPieceById(id))
      .subscribe(piece => {
        this.piece = piece
        context.title.next(piece.name)
      })
  },

  beforeDestroy () {
    this.signal.unsubscribe()
  }
}
</script>

<style lang="stylus">
@require '../styles/ref'

.piece-view
  position: absolute

</style>

<template>
<div class="pieces-view">
  <music-list></music-list>
</div>
</template>

<script>
import { context } from '../services'
import MusicList from './common/music-list'

export default {

  components: {
    MusicList
  },

  mounted () {
    context.title.next('Pieces')
  }

}
</script>

<style lang="stylus">
.pieces-view
  null

</style>

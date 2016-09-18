<template>
<div class="music-list">
  <ul class="pieces-list">
   <router-link v-for="piece in pieces"
      tag="DIV"
      class="piece-item"
      :title="piece.fullname"
      :to="{ name: 'piece', params: { id: piece.id } }"
      active-class>
      <span class="avatar info-avatar" :style="{backgroundImage: 'url(' + piece.musician.avatar + ')'}"></span>
      <span class="info-name">
        {{piece.name}}
        <span class="subinfo-suite" v-if="piece.suite">
        via {{piece.suite}}<span v-if="piece.number" class="subinfo-number">, No.{{piece.number}}</span>
        </span>
      </span>
      <span class="info-musician">{{piece.musician.name}}</span>
    </router-link>
  </ul>
</div>
</template>

<script>
import { pieceAPI } from '../../services'

export default {
  data () {
    return {
      pieces: []
    }
  },

  created () {
    pieceAPI.getPieces()
      .subscribe(data => {
        this.pieces = data
      })
  }
}
</script>

<style lang="stylus">
@require '../../styles/ref'

// FIXME: Adjust scroll area
.music-list
  $scrollMaskSize = 10%
  height: (100% + $scrollMaskSize * 2)
  margin-top: -15%
  display: flex
  flex-direction: column
  flex: 1 1 auto

  .pieces-list
    flex: 1 1 0
    overflow-y: auto
    list-style: none
    padding: $scrollMaskSize 0
    margin: 0
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) $scrollMaskSize,
      rgba(255, 255, 255, 1) 80%,
      rgba(255, 255, 255, 0.5) (100% - $scrollMaskSize),
      rgba(255, 255, 255, 0) 100%
    )

  .piece-item
    display: flex
    align-items: center
    cursor: pointer
    padding: .2em 0

    & + .piece-item
      margin-top: 30px

    &.router-link-active
      .info-name
        color: $brand

    &.router-link-active,
    &:hover
      .info-avatar
        -webkit-filter: grayscale(0)

      .subinfo-suite,
      .info-musician
        color: darken($gray50, 40%)

    .info-avatar
      width: 48px
      height: 48px
      margin-right: 20px
      transition: -webkit-filter 318ms
      -webkit-filter: grayscale(100%)

    .info-name
      flex: 1
      display: inline-block
      font-size: 22px
      text-overflow()
      transition: color 318ms

    .subinfo-suite,
    .info-musician
      color: $gray50
      transition: color 318ms

    .subinfo-suite
      color: $gray50
      font-size: 70%

    .info-musician
      margin-left: 20px

</style>

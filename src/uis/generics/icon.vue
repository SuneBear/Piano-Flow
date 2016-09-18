<template>
  <svg class="svg-symbol" :class="computedClass">
    <use :href="'#ss-' + symbol"></use>
  </svg>
</template>

<script>
// FIXME: Not work in Safari
{
  const _require = require.context('tb-icons/lib/svgs', true, /\.svg$/)
  _require.keys().forEach(key => _require(key))
}

/**
 * Icons Generic Component
 *
 * @param {string} [symbol] - Name of SVG symbol
 *
 * @example
 * <icon symobl="t"></icon>
 */
export default {
  props: {
    symbol: String,
    class: {
      type: String,
      default: ''
    }
  },

  computed: {
    computedClass () {
      return [
        `svg-symbol-${this.symbol}`,
        this.class
      ]
    }
  }

}
</script>

<style lang="stylus">
.svg-symbol
  display: inline-block
  vertical-align: middle
  fill: currentColor
  overflow: hidden
  width: 1em
  height: 1em
</style>

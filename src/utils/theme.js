import { context } from '../services'

const $theme = document.createElement('DIV')

~(function () {
  $theme.setAttribute('themify-all', '')
  $theme.style.display = 'none'
  document.body.appendChild($theme)
})()

export function getCurrentTheme () {
  // Get Theme Name
  let themeName
  context.theme.subscribe(name => { themeName = name })

  // Get Colors
  const styles = window.getComputedStyle($theme)
  const $brand = styles.fill
  const $bg = styles.backgroundColor
  const $accent = styles.borderColor

  return {
    name: themeName,
    $brand: $brand,
    $bg: $bg,
    $accent: $accent
  }
}
